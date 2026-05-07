import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal
from models import ActivityEvent, UBIDRecord
from datetime import datetime, timedelta

# In-memory queue to simulate Kafka stream
activity_queue = asyncio.Queue()

async def process_activity_queue():
    while True:
        event_data = await activity_queue.get()
        db = SessionLocal()
        try:
            # 1. Store the event
            new_event = ActivityEvent(
                ubid=event_data["ubid"],
                event_type=event_data["event_type"],
                source_system=event_data["source_system"],
                description=event_data["description"]
            )
            db.add(new_event)
            db.commit()
            
            # 2. Re-evaluate UBID status
            evaluate_business_status(db, event_data["ubid"])
            
        except Exception as e:
            print(f"Error processing event: {e}")
        finally:
            db.close()
            activity_queue.task_done()

def evaluate_business_status(db: Session, ubid_id: str):
    ubid_record = db.query(UBIDRecord).filter(UBIDRecord.id == ubid_id).first()
    if not ubid_record:
        return
        
    # Logic for status inference:
    # If no activity in last 18 months -> Dormant
    # If explicitly "Closure" event -> Closed
    # Else -> Active
    
    events = db.query(ActivityEvent).filter(ActivityEvent.ubid == ubid_id).order_by(ActivityEvent.timestamp.desc()).all()
    
    if any(e.event_type.lower() == "closure" for e in events):
        ubid_record.status = "Closed"
    elif events:
        latest_event = events[0]
        if datetime.utcnow() - latest_event.timestamp > timedelta(days=18*30):
            ubid_record.status = "Dormant"
        else:
            ubid_record.status = "Active"
    else:
        # Default Active if newly registered (or if only registration event exists)
        if datetime.utcnow() - ubid_record.created_at > timedelta(days=18*30):
            ubid_record.status = "Dormant"
        else:
            ubid_record.status = "Active"
            
    db.commit()
