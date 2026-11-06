
from datetime import datetime, time, timedelta, timezone
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.weather_observation import WeatherObservation


router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"],
)

IST = timezone(timedelta(hours=5, minutes=30))
UTC = timezone.utc
VALID_SOURCES = {"ALL", "MAUSAM", "MEGHDOOT"}
REPORTING_START_YEAR = 2026


def _month_start(year: int, month: int) -> datetime:
    """Return midnight on the first day of a month in IST."""
    return datetime(year, month, 1, tzinfo=IST)


def _quarter_start(year: int, month: int) -> datetime:
    """Return the first day of the quarter containing the month."""
    quarter_month = ((month - 1) // 3) * 3 + 1
    return _month_start(year, quarter_month)


def _format_period(value: datetime, interval: str) -> str:
    """Format a PostgreSQL aggregation period for the frontend."""
    if interval == "day":
        return value.date().isoformat()

    if interval == "month":
        return value.strftime("%Y-%m")

    if interval == "quarter":
        quarter = ((value.month - 1) // 3) + 1
        return f"{value.year}-Q{quarter}"

    return str(value.year)


def _aggregate(
    db: Session,
    source: str,
    interval: str,
    start_utc: Optional[datetime],
    end_utc: Optional[datetime],
) -> List[Dict]:
    """Count observations by period, using IST calendar boundaries."""

    local_time = func.timezone(
        "Asia/Kolkata",
        WeatherObservation.observation_time,
    )

    period = func.date_trunc(
        interval,
        local_time,
    ).label("period")

    query = db.query(
        period,
        func.count(WeatherObservation.id).label("report_count"),
    )

    if source != "ALL":
        query = query.filter(
            WeatherObservation.source == source,
        )

    if start_utc is not None:
        query = query.filter(
            WeatherObservation.observation_time >= start_utc,
        )

    if end_utc is not None:
        query = query.filter(
            WeatherObservation.observation_time < end_utc,
        )

    rows = (
        query
        .group_by(period)
        .order_by(period)
        .all()
    )

    return [
        {
            "period": _format_period(row.period, interval),
            "count": int(row.report_count),
        }
        for row in rows
    ]


@router.get("/")
def get_statistics(
    source: str = Query(default="ALL", max_length=50),
    db: Session = Depends(get_db),
):
    """
    Return observation statistics from 1 January 2026.

    Daily: 1 January 2026 through today.
    Monthly: January 2026 through the current month.
    Quarterly: Q1 2026 through the current quarter.
    Yearly: 2026 through the current year.

    All reporting boundaries use Indian Standard Time.
    Empty periods are filled with zero by the frontend.
    """

    source = source.strip().upper()

    if source not in VALID_SOURCES:
        raise HTTPException(
            status_code=400,
            detail="Invalid source. Use ALL, MAUSAM, or MEGHDOOT.",
        )

    now_ist = datetime.now(IST)
    today = now_ist.date()

    reporting_start = datetime(
        REPORTING_START_YEAR, 1, 1, tzinfo=IST
    )

    # Exclusive end boundaries prevent double-counting.
    daily_end = datetime.combine(
        today + timedelta(days=1),
        time.min,
        tzinfo=IST,
    )

    monthly_end = _month_start(
        now_ist.year,
        now_ist.month,
    )

    if now_ist.month == 12:
        monthly_end = _month_start(now_ist.year + 1, 1)
    else:
        monthly_end = _month_start(
            now_ist.year,
            now_ist.month + 1,
        )

    current_quarter_start = _quarter_start(
        now_ist.year,
        now_ist.month,
    )

    if current_quarter_start.month == 10:
        quarterly_end = _month_start(
            current_quarter_start.year + 1, 1
        )
    else:
        quarterly_end = _month_start(
            current_quarter_start.year,
            current_quarter_start.month + 3,
        )

    yearly_end = datetime(
        now_ist.year + 1, 1, 1, tzinfo=IST
    )

    daily = _aggregate(
        db,
        source,
        "day",
        reporting_start.astimezone(UTC),
        daily_end.astimezone(UTC),
    )

    monthly = _aggregate(
        db,
        source,
        "month",
        reporting_start.astimezone(UTC),
        monthly_end.astimezone(UTC),
    )

    quarterly = _aggregate(
        db,
        source,
        "quarter",
        reporting_start.astimezone(UTC),
        quarterly_end.astimezone(UTC),
    )

    yearly = _aggregate(
        db,
        source,
        "year",
        reporting_start.astimezone(UTC),
        yearly_end.astimezone(UTC),
    )

    current_quarter = (
        f"{now_ist.year}-Q{((now_ist.month - 1) // 3) + 1}"
    )

    return {
        "source": source,
        "timezone": "Asia/Kolkata",
        "ranges": {
            "daily": {
                "start": "2026-01-01",
                "end": today.isoformat(),
            },
            "monthly": {
                "start": "2026-01-01",
                "end": now_ist.strftime("%Y-%m"),
            },
            "quarterly": {
                "start": "2026-01-01",
                "end": current_quarter,
            },
            "yearly": {
                "start": "2026",
                "end": str(now_ist.year),
            },
        },
        "daily": daily,
        "monthly": monthly,
        "quarterly": quarterly,
        "yearly": yearly,
    }
