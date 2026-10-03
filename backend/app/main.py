import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.db.seed_data import seed_database
from app.api.routes import auth, hospitals, search, doctors, inventory, insights, redistribution

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aarogya_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and Seed data
    logger.info("Initializing database tables and checking seed data...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    logger.info("AarogyaResilience Platform Backend Ready.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Healthcare Resource & Supply Chain Resilience Platform. Features Smart Healthcare Search, Inventory Tracking, Deterministic Stockout Prediction, and Inter-Hospital Redistribution Opportunities.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all in local development for smooth frontend integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(hospitals.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(doctors.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(redistribution.router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "online",
        "demo_mode": "Simulated Hospital Network Data",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
