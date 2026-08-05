from fastapi import FastAPI

from app.api.observations import router as observations_router

app = FastAPI(
    title="SMRITI API",
    version="0.1.0",
    description="Smart Meteorological Reporting & Information Tracking Initiative",
)

app.include_router(observations_router)


@app.get("/health")
def health():
    return {"status": "ok"}
