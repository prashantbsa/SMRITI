from apscheduler.schedulers.background import BackgroundScheduler

from app.db.database import SessionLocal

from app.services.meghdoot_import_service import (
    import_from_meghdoot
)

from app.services.weather_event_generation_service import (
    generate_weather_events_for_observation_ids
)

scheduler = BackgroundScheduler()


def sync_meghdoot():

    db = SessionLocal()

    try:

        # --------------------------------------------------
        # IMPORT NEW MEGHDOOT OBSERVATIONS
        # --------------------------------------------------

        result = import_from_meghdoot(
            db=db,
            limit=100,
            offset=0,
        )

        print(
            "Meghdoot Sync:",
            result
        )


        # --------------------------------------------------
        # GENERATE / UPDATE WEATHER EVENTS
        # --------------------------------------------------
        #
        # Do this only when at least one new observation
        # was actually imported.
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
                "Weather Events after Meghdoot Sync:",
                event_result
            )

        else:

            print(
                "Meghdoot Sync: "
                "no new observations; "
                "weather event generation skipped."
            )


    except Exception as e:

        db.rollback()

        print(
            "Meghdoot Scheduler Error:",
            e
        )


    finally:

        db.close()


def start_scheduler():

    scheduler.add_job(

        sync_meghdoot,

        trigger="interval",

        minutes=15,

        id="meghdoot_sync",

        replace_existing=True,

        # Prevent another copy of the same sync
        # from starting if the previous run is
        # still executing.
        max_instances=1,

        coalesce=True,
    )


    scheduler.start()


    print(
        "Meghdoot scheduler started."
    )
