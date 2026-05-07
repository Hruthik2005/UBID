from sentence_transformers import SentenceTransformer
from rapidfuzz import fuzz
from sqlalchemy.orm import Session
from models import UBIDRecord, DepartmentRecord, ReviewTask
import uuid

# Load model lazily
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def normalize_text(text: str) -> str:
    if not text:
        return ""
    return str(text).lower().strip()

def calculate_similarity(record1, record2):
    # Rule 1: Exact PAN/GSTIN match
    if record1.pan and record2.pan and record1.pan == record2.pan:
        return 1.0, "Exact PAN Match"
    if record1.gstin and record2.gstin and record1.gstin == record2.gstin:
        return 1.0, "Exact GSTIN Match"
    
    # Rule 2: Fuzzy Name + Address Match
    name_score = fuzz.token_sort_ratio(normalize_text(record1.business_name), normalize_text(record2.primary_name)) / 100.0
    
    # Rule 3: Embedding similarity if fuzzy is ambiguous
    model = get_model()
    emb1 = model.encode(normalize_text(record1.business_name) + " " + normalize_text(record1.address))
    emb2 = model.encode(normalize_text(record2.primary_name) + " " + normalize_text(record2.primary_address))
    
    # Cosine similarity
    from numpy import dot
    from numpy.linalg import norm
    cosine_sim = dot(emb1, emb2)/(norm(emb1)*norm(emb2))
    
    final_score = (name_score * 0.4) + (cosine_sim * 0.6)
    
    return final_score, f"Fuzzy+Embedding (Name: {name_score:.2f}, Vector: {cosine_sim:.2f})"

def process_new_record(db: Session, record: DepartmentRecord):
    # Find candidates in the same pincode
    candidates = db.query(UBIDRecord).filter(UBIDRecord.pincode == record.pincode).all()
    
    best_match = None
    highest_score = 0
    best_reason = ""
    
    for candidate in candidates:
        score, reason = calculate_similarity(record, candidate)
        if score > highest_score:
            highest_score = score
            best_match = candidate
            best_reason = reason
            
    record.confidence_score = float(highest_score)
    
    if highest_score >= 0.85:
        # Auto-link
        record.ubid = best_match.id
        db.commit()
        return best_match, "Auto-linked"
    elif highest_score >= 0.50:
        # Send to review
        task = ReviewTask(
            department_record_id=record.id,
            suggested_ubid=best_match.id if best_match else None,
            confidence_score=float(highest_score),
            reasoning=best_reason
        )
        db.add(task)
        db.commit()
        return None, "Sent to Review"
    else:
        # Create new UBID
        new_ubid_str = f"UBID-{uuid.uuid4().hex[:8].upper()}"
        new_ubid = UBIDRecord(
            id=new_ubid_str,
            pan=record.pan,
            gstin=record.gstin,
            primary_name=record.business_name,
            primary_address=record.address,
            pincode=record.pincode
        )
        db.add(new_ubid)
        db.commit()
        
        record.ubid = new_ubid.id
        db.commit()
        return new_ubid, "New UBID Created"
