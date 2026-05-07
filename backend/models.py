from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class UBIDRecord(Base):
    __tablename__ = "ubids"
    
    id = Column(String, primary_key=True, index=True) # The UBID string (e.g., UBID-12345)
    pan = Column(String, index=True, nullable=True)
    gstin = Column(String, index=True, nullable=True)
    primary_name = Column(String, index=True)
    primary_address = Column(String)
    pincode = Column(String, index=True)
    status = Column(String, default="Active") # Active, Dormant, Closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    linked_records = relationship("DepartmentRecord", back_populates="ubid_record")
    events = relationship("ActivityEvent", back_populates="ubid_record")

class DepartmentRecord(Base):
    __tablename__ = "department_records"
    
    id = Column(Integer, primary_key=True, index=True)
    source_system = Column(String, index=True) # Labour, KSPCB, BESCOM
    source_record_id = Column(String, index=True)
    business_name = Column(String)
    address = Column(String)
    pincode = Column(String)
    pan = Column(String, nullable=True)
    gstin = Column(String, nullable=True)
    raw_data = Column(JSON) # Store original payload
    
    ubid = Column(String, ForeignKey("ubids.id"), nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    ubid_record = relationship("UBIDRecord", back_populates="linked_records")

class ActivityEvent(Base):
    __tablename__ = "activity_events"
    
    id = Column(Integer, primary_key=True, index=True)
    ubid = Column(String, ForeignKey("ubids.id"))
    event_type = Column(String, index=True) # Inspection, Renewal, Compliance
    source_system = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    description = Column(String)
    
    ubid_record = relationship("UBIDRecord", back_populates="events")

class ReviewTask(Base):
    __tablename__ = "review_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    department_record_id = Column(Integer, ForeignKey("department_records.id"))
    suggested_ubid = Column(String, ForeignKey("ubids.id"), nullable=True)
    confidence_score = Column(Float)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    reasoning = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
