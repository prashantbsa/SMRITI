from apscheduler.schedulers.background import BackgroundScheduler

from app.db.database import SessionLocal
from app.services.meghdoot_import_service import import_from_meghdoot


scheduler = BackgroundScheduler()


def sync_meghdoot():

    db = SessionLocal()

    try:

        result = import_from_meghdoot(
            db=db,
            limit=100,
            offset=0,
        )

        print("Meghdoot Sync:", result)

    except Exception as e:

        print("Scheduler Error:", e)

    finally:

        db.close()


def start_scheduler():

    scheduler.add_job(
        sync_meghdoot,
        trigger="interval",
        minutes=15,
        id="meghdoot_sync",
        replace_existing=True,
    )

    scheduler.start()

    print("Meghdoot scheduler started.")
