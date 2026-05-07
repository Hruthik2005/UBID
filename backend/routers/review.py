from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from models import ReviewTask, DepartmentRecord, UBIDRecord
import uuid

router = APIRouter()

@router.get("/", response_model=List[schemas.ReviewTaskResponse])
def get_pending_tasks(db: Session = Depends(get_db)):
    tasks = db.query(ReviewTask).filter(ReviewTask.status == "Pending").all()
    return tasks

@router.post("/{task_id}/approve")
def approve_match(task_id: int, db: Session = Depends(get_db)):
    task = db.query(ReviewTask).filter(ReviewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task.status != "Pending":
        raise HTTPException(status_code=400, detail="Task already processed")
        
    record = db.query(DepartmentRecord).filter(DepartmentRecord.id == task.department_record_id).first()
    record.ubid = task.suggested_ubid
    task.status = "Approved"
    db.commit()
    return {"status": "Approved"}

@router.post("/{task_id}/reject")
def reject_match(task_id: int, db: Session = Depends(get_db)):
    task = db.query(ReviewTask).filter(ReviewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task.status != "Pending":
        raise HTTPException(status_code=400, detail="Task already processed")
        
    # Create new UBID
    record = db.query(DepartmentRecord).filter(DepartmentRecord.id == task.department_record_id).first()
    
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
    task.status = "Rejected" # Meaning the suggestion was rejected
    db.commit()
    
    return {"status": "Rejected, New UBID created", "new_ubid": new_ubid.id}
