import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import UBIDRecord, DepartmentRecord, ActivityEvent, ReviewTask
from routers import ubid, ingest, analytics, review
from services.activity_engine import process_activity_queue

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="UBID Platform API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ubid.router, prefix="/api/ubid", tags=["UBID"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingestion"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(review.router, prefix="/api/review", tags=["Review"])

@app.on_event("startup")
async def startup_event():
    # Start the background task to process events
    asyncio.create_task(process_activity_queue())

@app.get("/")
def read_root():
    return {"message": "UBID Platform API is running"}
