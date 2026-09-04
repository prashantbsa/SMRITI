from collections import defaultdict
from datetime import timezone, timedelta

from sqlalchemy.orm import Session

from app.models.weather_observation import WeatherObservation


# --------------------------------------------------
# INDIA STANDARD TIME
# --------------------------------------------------

IST = timezone(
    timedelta(
        hours=5,
        minutes=30,
    )
)


# --------------------------------------------------
# MOBILE NORMALIZATION
# --------------------------------------------------

def normalize_mobile(value):

    if not value:
        return None

    value = str(value).strip()

    digits = "".join(
        character
        for character in value
        if character.isdigit()
    )

    # Only keep reasonable phone-number lengths.
    if not (
        10 <= len(digits) <= 15
    ):
        return None

    return digits


# --------------------------------------------------
# MASK MOBILE NUMBER
# --------------------------------------------------

def mask_mobile(value):

    mobile = normalize_mobile(value)

    if not mobile:
        return "—"

    # Example:
    # 8690940874 -> 8690****74

    if len(mobile) <= 6:
        return "*" * len(mobile)

    return (
        mobile[:4]
        + "*" * (len(mobile) - 6)
        + mobile[-2:]
    )


# --------------------------------------------------
# NAME NORMALIZATION
# --------------------------------------------------

def normalize_name(value):

    if not value:
        return "Anonymous"

    name = str(value).strip()

    if not name:
        return "Anonymous"

    return name


# --------------------------------------------------
# IMD 3-HOUR SLOT
# --------------------------------------------------

def get_nowcast_slot(
    observation_time,
):

    if not observation_time:
        return None

    # observation_time is stored as timestamptz.
    # Leaderboard slot calculation must follow IST.

    if observation_time.tzinfo is None:

        local_time = observation_time.replace(
            tzinfo=timezone.utc
        ).astimezone(IST)

    else:

        local_time = (
            observation_time
            .astimezone(IST)
        )

    slot_start_hour = (
        local_time.hour // 3
    ) * 3

    # A slot is uniquely identified by:
    #
    # date + starting hour
    #
    # Example:
    # 2026-08-19 08:45 -> (2026-08-19, 6)
    # 2026-08-19 09:15 -> (2026-08-19, 9)

    return (
        local_time.date(),
        slot_start_hour,
    )


# --------------------------------------------------
# LOCAL REPORTING DAY
# --------------------------------------------------

def get_reporting_day(
    observation_time,
):

    if not observation_time:
        return None

    if observation_time.tzinfo is None:

        local_time = observation_time.replace(
            tzinfo=timezone.utc
        ).astimezone(IST)

    else:

        local_time = (
            observation_time
            .astimezone(IST)
        )

    return local_time.date()


# --------------------------------------------------
# BUILD CONTRIBUTOR STATISTICS
# --------------------------------------------------

def build_contributor_statistics(
    db: Session,
):

    observations = (
        db.query(
            WeatherObservation.id,
            WeatherObservation.reporter_name,
            WeatherObservation.reporter_mobile,
            WeatherObservation.observation_time,
        )
        .filter(
            WeatherObservation.reporter_mobile
            .isnot(None)
        )
        .order_by(
            WeatherObservation.observation_time.asc(),
            WeatherObservation.id.asc(),
        )
        .all()
    )

    contributors = defaultdict(
        lambda: {
            "name": "Anonymous",
            "mobile": None,
            "report_count": 0,
            "active_days": set(),
            "nowcast_slots": set(),
        }
    )

    for observation in observations:

        mobile = normalize_mobile(
            observation.reporter_mobile
        )

        if not mobile:
            continue

        contributor = contributors[
            mobile
        ]

        contributor["mobile"] = mobile

        # ------------------------------------------
        # NAME
        # ------------------------------------------

        candidate_name = normalize_name(
            observation.reporter_name
        )

        # Prefer a real name over Anonymous.
        #
        # Since observations are ordered by time,
        # a later valid name can also replace an
        # older one.

        if candidate_name != "Anonymous":

            contributor["name"] = (
                candidate_name
            )

        # ------------------------------------------
        # REPORT COUNT
        # ------------------------------------------

        contributor["report_count"] += 1

        # ------------------------------------------
        # ACTIVE DAY
        # ------------------------------------------

        reporting_day = get_reporting_day(
            observation.observation_time
        )

        if reporting_day:

            contributor[
                "active_days"
            ].add(
                reporting_day
            )

        # ------------------------------------------
        # IMD 3-HOUR NOWCAST SLOT
        # ------------------------------------------

        slot = get_nowcast_slot(
            observation.observation_time
        )

        if slot:

            contributor[
                "nowcast_slots"
            ].add(
                slot
            )

    return contributors


# --------------------------------------------------
# POINTS
# --------------------------------------------------

def calculate_points(
    contributor,
):

    # Every valid observation:
    #
    # +1 point

    report_points = (
        contributor["report_count"]
    )

    # First contribution in each fixed
    # IMD 3-hour slot:
    #
    # +1 bonus point

    freshness_points = len(
        contributor["nowcast_slots"]
    )

    return (
        report_points
        + freshness_points
    )


# --------------------------------------------------
# PUBLIC LEADERBOARD ROW
# --------------------------------------------------

def public_row(
    rank,
    contributor,
):

    return {
        "rank": rank,
        "name": contributor["name"],

        "mobile": mask_mobile(
            contributor["mobile"]
        ),

        "observations":
            contributor["report_count"],

        "points":
            contributor["points"],
    }

# --------------------------------------------------
# MAIN LEADERBOARD
# --------------------------------------------------

def get_leaderboard(
    db: Session,
    limit=50,
):

    contributors = (
        build_contributor_statistics(
            db
        )
    )

    contributor_list = []

    for contributor in (
        contributors.values()
    ):

        contributor_list.append({
            **contributor,

            "active_day_count": len(
                contributor[
                    "active_days"
                ]
            ),

            "nowcast_slot_count": len(
                contributor[
                    "nowcast_slots"
                ]
            ),

            "points": calculate_points(
                contributor
            ),
        })

    # --------------------------------------------------
    # TOP REPORTERS
    #
    # Primary:
    # total observations
    #
    # Tie-break:
    # points
    # active days
    # --------------------------------------------------

    top_reporters_sorted = sorted(
        contributor_list,
        key=lambda item: (
            -item["report_count"],
            -item["points"],
            -item["active_day_count"],
            item["name"].lower(),
        ),
    )

    # --------------------------------------------------
    # REGULAR CONTRIBUTORS
    #
    # Primary:
    # distinct fixed 3-hour nowcast slots
    #
    # Tie-break:
    # active days
    # report count
    # points
    # --------------------------------------------------

    regular_sorted = sorted(
        contributor_list,
        key=lambda item: (
            -item["nowcast_slot_count"],
            -item["active_day_count"],
            -item["report_count"],
            -item["points"],
            item["name"].lower(),
        ),
    )

    top_reporters = []

    for index, contributor in enumerate(
        top_reporters_sorted[:limit],
        start=1,
    ):

        top_reporters.append(
            public_row(
                index,
                contributor,
            )
        )

    regular_contributors = []

    for index, contributor in enumerate(
        regular_sorted[:limit],
        start=1,
    ):

        regular_contributors.append(
            public_row(
                index,
                contributor,
            )
        )

    return {
        "top_reporters": top_reporters,
        "regular_contributors":
            regular_contributors,

        "criteria": {
            "base_report_points": 1,
            "nowcast_slot_bonus": 1,
            "nowcast_slots": [
                "00:00-02:59",
                "03:00-05:59",
                "06:00-08:59",
                "09:00-11:59",
                "12:00-14:59",
                "15:00-17:59",
                "18:00-20:59",
                "21:00-23:59",
            ],
        },
    }
