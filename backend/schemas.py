from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class DepartmentRecordBase(BaseModel):
    source_system: str
    source_record_id: str
    business_name: str
    address: str
    pincode: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    raw_data: Optional[Dict[str, Any]] = None

class DepartmentRecordCreate(DepartmentRecordBase):
    pass

class DepartmentRecordResponse(DepartmentRecordBase):
    id: int
    ubid: Optional[str] = None
    confidence_score: Optional[float] = None
    
    class Config:
        from_attributes = True

class ActivityEventBase(BaseModel):
    event_type: str
    source_system: str
    description: str

class ActivityEventCreate(ActivityEventBase):
    department_record_id: Optional[str] = None 
    ubid: Optional[str] = None

class UBIDRecordResponse(BaseModel):
    id: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    primary_name: str
    primary_address: str
    pincode: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ReviewTaskResponse(BaseModel):
    id: int
    department_record_id: int
    suggested_ubid: Optional[str] = None
    confidence_score: float
    status: str
    reasoning: str
    created_at: datetime
    
    class Config:
        from_attributes = True
