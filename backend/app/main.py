from fastapi import FastAPI
from app.api.weather_events import router as weather_events_router
from app.api.shared_observations import (
    router as shared_observations_router,
)
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.api.observations import (
    router as observations_router,
)

from app.api.admin import (
    router as admin_router,
)

from app.api.leaderboard import (
    router as leaderboard_router,
)

from app.api.auth import (
    router as auth_router,
)

from app.scheduler.meghdoot_scheduler import (
    start_scheduler,
)

from app.scheduler.mausam_scheduler import (
    start_mausam_scheduler,
)


app = FastAPI(
    title="SMRITI API",
    version="0.1.0",
    description=(
        "Smart Meteorological Reporting "
        "& Information Tracking Initiative"
    ),
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


# --------------------------------------------------
# ROUTERS
# --------------------------------------------------

app.include_router(
    observations_router
)

app.include_router(
    admin_router
)

app.include_router(
    leaderboard_router
)

app.include_router(
    auth_router
)

app.include_router(weather_events_router)

app.include_router(
    shared_observations_router
)

# --------------------------------------------------
# HEALTH
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok"
    }


# --------------------------------------------------
# STARTUP
# --------------------------------------------------

@app.on_event("startup")
def startup():

    start_scheduler()

    start_mausam_scheduler()
