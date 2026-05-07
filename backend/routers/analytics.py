from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import UBIDRecord, DepartmentRecord, ActivityEvent, ReviewTask

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_ubids = db.query(UBIDRecord).count()
    active_ubids = db.query(UBIDRecord).filter(UBIDRecord.status == "Active").count()
    dormant_ubids = db.query(UBIDRecord).filter(UBIDRecord.status == "Dormant").count()
    closed_ubids = db.query(UBIDRecord).filter(UBIDRecord.status == "Closed").count()
    
    total_records = db.query(DepartmentRecord).count()
    pending_reviews = db.query(ReviewTask).filter(ReviewTask.status == "Pending").count()
    
    return {
        "metrics": {
            "total_businesses": total_ubids,
            "active_businesses": active_ubids,
            "dormant_businesses": dormant_ubids,
            "closed_businesses": closed_ubids,
            "total_source_records": total_records,
            "pending_reviews": pending_reviews
        }
    }
