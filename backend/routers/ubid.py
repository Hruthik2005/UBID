from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from models import UBIDRecord, DepartmentRecord, ActivityEvent

router = APIRouter()

@router.get("/", response_model=List[schemas.UBIDRecordResponse])
def get_all_ubids(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ubids = db.query(UBIDRecord).offset(skip).limit(limit).all()
    return ubids

@router.get("/{ubid_id}", response_model=schemas.UBIDRecordResponse)
def get_ubid(ubid_id: str, db: Session = Depends(get_db)):
    ubid = db.query(UBIDRecord).filter(UBIDRecord.id == ubid_id).first()
    if not ubid:
        raise HTTPException(status_code=404, detail="UBID not found")
    return ubid

@router.get("/{ubid_id}/records", response_model=List[schemas.DepartmentRecordResponse])
def get_linked_records(ubid_id: str, db: Session = Depends(get_db)):
    records = db.query(DepartmentRecord).filter(DepartmentRecord.ubid == ubid_id).all()
    return records

@router.get("/{ubid_id}/events")
def get_ubid_events(ubid_id: str, db: Session = Depends(get_db)):
    events = db.query(ActivityEvent).filter(ActivityEvent.ubid == ubid_id).order_by(ActivityEvent.timestamp.desc()).all()
    return events
