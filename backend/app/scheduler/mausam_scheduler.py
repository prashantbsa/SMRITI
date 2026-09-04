from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from app.db.database import SessionLocal

from app.services.mausam_import_service import (
    import_from_mausam
)

from app.services.weather_event_generation_service import (
    generate_weather_events_for_observation_ids
)

scheduler = BackgroundScheduler()


def sync_mausam():

    db = SessionLocal()

    try:

        # --------------------------------------------------
        # IMPORT NEW MAUSAM OBSERVATIONS
        # --------------------------------------------------

        result = import_from_mausam(
            db=db,
            days=1,
        )


        print(
            "Mausam Sync:",
            result
        )


        # --------------------------------------------------
        # GENERATE / UPDATE WEATHER EVENTS
        # --------------------------------------------------
        #
        # Only run event generation when new observations
        # were inserted.
        #

        imported = 0

        if isinstance(
            result,
            dict
        ):

            imported = int(
                result.get(
                    "imported",
                    0
                )
                or 0
            )


        if imported > 0:

            imported_ids = (
                result.get(
                    "imported_ids",
                    []
                )
                or []
            )

            event_result = (
                generate_weather_events_for_observation_ids(
                    db,
                    imported_ids,
                )
            )
            print(
                "Weather Events after Mausam Sync:",
                event_result
            )

        else:

            print(
                "Mausam Sync: "
                "no new observations; "
                "weather event generation skipped."
            )


    except Exception as e:

        db.rollback()

        print(
            "Mausam Scheduler Error:",
            e
        )


    finally:

        db.close()


def start_mausam_scheduler():

    scheduler.add_job(

        sync_mausam,

        trigger="interval",

        minutes=15,

        id="mausam_sync",

        replace_existing=True,

        max_instances=1,

        coalesce=True,
    )


    scheduler.start()


    print(
        "Mausam scheduler started."
    )
