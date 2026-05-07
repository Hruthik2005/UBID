from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import schemas
from models import DepartmentRecord
from services.entity_resolution import process_new_record
from services.activity_engine import activity_queue

router = APIRouter()

@router.post("/record")
def ingest_record(record: schemas.DepartmentRecordCreate, db: Session = Depends(get_db)):
    # 1. Save raw record
    new_record = DepartmentRecord(
        source_system=record.source_system,
        source_record_id=record.source_record_id,
        business_name=record.business_name,
        address=record.address,
        pincode=record.pincode,
        pan=record.pan,
        gstin=record.gstin,
        raw_data=record.raw_data
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    # 2. Entity Resolution
    ubid_record, action_reason = process_new_record(db, new_record)
    
    return {
        "status": "success",
        "record_id": new_record.id,
        "assigned_ubid": new_record.ubid,
        "action": action_reason
    }

@router.post("/event")
async def ingest_event(event: schemas.ActivityEventCreate):
    # Push to async queue simulating Kafka
    await activity_queue.put({
        "ubid": event.ubid,
        "event_type": event.event_type,
        "source_system": event.source_system,
        "description": event.description
    })
    
    return {"status": "event queued"}
