from fastapi import FastAPI

from app.api.observations import router as observations_router
from app.api.admin import router as admin_router
from app.scheduler.meghdoot_scheduler import start_scheduler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SMRITI API",
    version="0.1.0",
    description="Smart Meteorological Reporting & Information Tracking Initiative",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.12.160:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(observations_router)
app.include_router(admin_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.on_event("startup")
def startup():

    start_scheduler()
