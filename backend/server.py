from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Corporate Health API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

class ContactMessageResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None

# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "Corporate Health API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Contact form endpoint
@api_router.post("/contact", response_model=ContactMessageResponse)
async def create_contact_message(input: ContactMessageCreate):
    try:
        contact_obj = ContactMessage(**input.model_dump())
        
        doc = contact_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.contact_messages.insert_one(doc)
        
        return ContactMessageResponse(
            success=True,
            message="Thank you for your message. We will contact you soon!",
            id=contact_obj.id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    
    return messages

# Services endpoint
@api_router.get("/services")
async def get_services():
    services = [
        {
            "id": "1",
            "title": "Medical Evaluations",
            "description": "Occupational medical examinations to monitor the health of your workers.",
            "icon": "clipboard-check"
        },
        {
            "id": "2",
            "title": "Occupational Exams",
            "description": "Specialized tests to detect workplace risks and occupational diseases.",
            "icon": "stethoscope"
        },
        {
            "id": "3",
            "title": "Work Certificates",
            "description": "Issuance of work aptitude certificates to comply with regulations.",
            "icon": "file-check"
        },
        {
            "id": "4",
            "title": "Online Platform",
            "description": "Consult and download certificates from our web portal.",
            "icon": "monitor"
        },
        {
            "id": "5",
            "title": "Health Programs",
            "description": "Comprehensive health and wellness programs for your workforce.",
            "icon": "heart-pulse"
        },
        {
            "id": "6",
            "title": "Safety Training",
            "description": "Training and education on workplace safety and health protocols.",
            "icon": "graduation-cap"
        }
    ]
    return services

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
