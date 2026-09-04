from app.db.database import SessionLocal
from app.models.weather_observation import WeatherObservation
from app.services.geography_normalization_service import (
    normalize_state,
    normalize_district,
)


def main():

    db = SessionLocal()

    try:

        observations = (
            db.query(WeatherObservation)
            .all()
        )

        updated = 0

        for observation in observations:

            normalized_state = (
                normalize_state(
                    observation.state
                )
            )

            normalized_district = (
                normalize_district(
                    observation.district
                )
            )

            changed = False

            if (
                observation.normalized_state
                != normalized_state
            ):

                observation.normalized_state = (
                    normalized_state
                )

                changed = True

            if (
                observation.normalized_district
                != normalized_district
            ):

                observation.normalized_district = (
                    normalized_district
                )

                changed = True

            if changed:
                updated += 1

        db.commit()

        print(
            f"Normalized geography backfill complete | "
            f"total={len(observations)} | "
            f"updated={updated}"
        )

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


if __name__ == "__main__":
    main()
