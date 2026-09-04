from collections import defaultdict
from datetime import timedelta
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.weather_observation import WeatherObservation
from app.models.weather_event import WeatherEvent
from app.models.weather_observation_event import WeatherObservationEvent

from app.services.geography_normalization_service import (
    normalize_state,
    normalize_district,
)


# --------------------------------------------------
# PHENOMENON NORMALIZATION
# --------------------------------------------------

PHENOMENON_ALIASES = {

    "RAIN":
        "RAIN",

    "DRIZZLE":
        "DRIZZLE",

    # Separate thunder when the source provides it.
    "THUNDER":
        "THUNDER",

    # Separate lightning when the source provides it.
    "LIGHTNING":
        "LIGHTNING",

    # Combined phenomenon.
    "THUNDER/LIGHTNING":
        "THUNDER_LIGHTNING",

    "THUNDER_LIGHTNING":
        "THUNDER_LIGHTNING",

    "THUNDERSTORM":
        "THUNDER_LIGHTNING",

    "THUNDERSTORM_LIGHTNING":
        "THUNDER_LIGHTNING",

    "HAIL":
        "HAIL",

    "HAILSTORM":
        "HAIL",

    "SNOW":
        "SNOW",

    "SNOWFALL":
        "SNOW",

    "FOG":
        "FOG",

    "HOT_HUMID":
        "HOT_HUMID",

    "HOT_AND_HUMID":
        "HOT_HUMID",

    "HOT_WEATHER":
        "HOT_WEATHER",

    "DUST_STORM":
        "DUST_STORM",

    "DUSTSTORM":
        "DUST_STORM",

    "GUSTY_WIND":
        "GUSTY_WIND",

    "STRONG_WIND":
        "GUSTY_WIND",

    "CYCLONE":
        "CYCLONE",
}


def normalize_phenomenon(value):

    if not value:
        return None

    value = (
        str(value)
        .strip()
        .upper()
        .replace(" ", "_")
        .replace("-", "_")
    )

    return PHENOMENON_ALIASES.get(
        value,
        value,
    )


def split_phenomena(value):

    if not value:
        return []

    result = []

    parts = str(value).split(",")

    for part in parts:

        phenomenon = (
            normalize_phenomenon(
                part
            )
        )

        if (
            phenomenon
            and phenomenon != "UNKNOWN"
            and phenomenon not in result
        ):

            result.append(
                phenomenon
            )

    return result


# --------------------------------------------------
# OBSERVATION GEOGRAPHY
# --------------------------------------------------

def get_observation_state(
    observation,
):

    """
    Prefer the normalized value stored in the
    weather_observations table.

    Fall back to the original source value only
    for older/problematic records where the
    normalized field is NULL.
    """

    normalized_value = (
        observation.normalized_state
        or ""
    ).strip()

    if normalized_value:

        return normalized_value

    return normalize_state(
        observation.state
    )


def get_observation_district(
    observation,
):

    """
    Prefer normalized_district from the database.

    Original district remains untouched and is
    used only as a fallback.
    """

    normalized_value = (
        observation.normalized_district
        or ""
    ).strip()

    if normalized_value:

        return normalized_value

    return normalize_district(
        observation.district
    )


def district_key(
    observation,
):

    district = (
        get_observation_district(
            observation
        )
    )

    if not district:

        return None

    return district.casefold()


# --------------------------------------------------
# FIXED IMD NOWCAST SLOT
# --------------------------------------------------

def get_nowcast_slot(
    observation_time,
):

    if not observation_time:
        return None

    """
    Fixed IMD nowcast periods:

    00:00 - 03:00
    03:00 - 06:00
    06:00 - 09:00
    09:00 - 12:00
    12:00 - 15:00
    15:00 - 18:00
    18:00 - 21:00
    21:00 - 24:00

    Examples:

    08:45 -> 06:00 - 09:00

    09:15 -> 09:00 - 12:00

    Therefore observations at 08:45 and 09:15
    belong to two different weather events.
    """

    slot_start_hour = (
        observation_time.hour // 3
    ) * 3

    slot_start = (
        observation_time.replace(
            hour=slot_start_hour,
            minute=0,
            second=0,
            microsecond=0,
        )
    )

    slot_end = (
        slot_start
        + timedelta(
            hours=3
        )
    )

    return (
        slot_start,
        slot_end,
    )


# --------------------------------------------------
# CONTRIBUTOR IDENTITY
# --------------------------------------------------

def contributor_key(
    observation,
):

    """
    Evidence Strength should count independent
    contributors rather than simply counting
    observations.

    Preferred identity:
        mobile number

    Fallback:
        source + reporter_id

    Last fallback:
        observation id
    """

    mobile = (
        observation.reporter_mobile
        or ""
    ).strip()

    if mobile:

        digits = "".join(
            character
            for character in mobile
            if character.isdigit()
        )

        if (
            10
            <= len(digits)
            <= 15
        ):

            # Last 10 digits allow:
            #
            # 919650627675
            #
            # and:
            #
            # 9650627675
            #
            # to resolve to the same contributor.

            return (
                "mobile",
                digits[-10:],
            )

    reporter_id = (
        observation.reporter_id
        or ""
    ).strip()

    if reporter_id:

        source = (
            observation.source
            or "UNKNOWN"
        ).strip().upper()

        # Reporter IDs are source-specific.
        #
        # MAUSAM:12345
        #
        # must not automatically equal:
        #
        # MEGHDOOT:12345

        return (
            "reporter",
            source,
            reporter_id,
        )

    return (
        "observation",
        observation.id,
    )


# --------------------------------------------------
# EVIDENCE STRENGTH
# --------------------------------------------------

def calculate_evidence_strength(
    unique_contributor_count,
):

    if (
        unique_contributor_count
        <= 0
    ):

        return 0

    """
    Current SMRITI Evidence Strength:

    1 contributor  -> 20
    2 contributors -> 40
    3 contributors -> 60
    4 contributors -> 80
    5+ contributors -> 100

    This is decision-support evidence only.

    It must NOT automatically verify an event.
    """

    return min(
        unique_contributor_count
        * 20,
        100,
    )


# --------------------------------------------------
# EVENT CENTRE
# --------------------------------------------------

def calculate_event_location(
    observations,
):

    """
    Event location is the mean location of
    supporting observations having usable
    coordinates.

    (0, 0) observations are deliberately ignored.
    """

    valid = [

        observation

        for observation in observations

        if (
            observation.latitude
            is not None

            and observation.longitude
            is not None

            and not (
                observation.latitude == 0
                and
                observation.longitude == 0
            )
        )
    ]

    if not valid:

        return (
            None,
            None,
        )

    latitude = (
        sum(
            observation.latitude
            for observation in valid
        )
        /
        len(valid)
    )

    longitude = (
        sum(
            observation.longitude
            for observation in valid
        )
        /
        len(valid)
    )

    return (
        latitude,
        longitude,
    )


# --------------------------------------------------
# EVENT GROUPING
# --------------------------------------------------

def build_event_groups(
    observations,
):

    groups = defaultdict(
        list
    )

    for observation in observations:

        # ----------------------------------------------
        # CANONICAL GEOGRAPHY
        # ----------------------------------------------

        district = (
            get_observation_district(
                observation
            )
        )

        normalized_district_key = (
            district_key(
                observation
            )
        )

        if (
            not district
            or not normalized_district_key
        ):

            continue


        state = (
            get_observation_state(
                observation
            )
        )


        # ----------------------------------------------
        # FIXED 3-HOUR NOWCAST SLOT
        # ----------------------------------------------

        slot = (
            get_nowcast_slot(
                observation.observation_time
            )
        )

        if not slot:

            continue

        slot_start, slot_end = (
            slot
        )


        # ----------------------------------------------
        # WEATHER PHENOMENA
        # ----------------------------------------------

        phenomena = (
            split_phenomena(
                observation.phenomenon
            )
        )


        for phenomenon in phenomena:

            # ------------------------------------------
            # EVENT IDENTITY
            # ------------------------------------------
            #
            # Same canonical district
            #
            # +
            #
            # Same weather phenomenon
            #
            # +
            #
            # Same fixed 3-hour IMD nowcast slot
            #
            # =
            #
            # ONE WEATHER EVENT
            # ------------------------------------------

            key = (
                normalized_district_key,
                phenomenon,
                slot_start,
            )


            groups[key].append({

                "observation":
                    observation,

                "state":
                    state,

                "district":
                    district,

                "slot_start":
                    slot_start,

                "slot_end":
                    slot_end,

                "phenomenon":
                    phenomenon,
            })

    return groups


# --------------------------------------------------
# CREATE OR UPDATE ONE EVENT
# --------------------------------------------------

def create_or_update_event(
    db,
    grouped_items,
):

    first = (
        grouped_items[0]
    )

    district = (
        first[
            "district"
        ]
    )

    phenomenon = (
        first[
            "phenomenon"
        ]
    )

    slot_start = (
        first[
            "slot_start"
        ]
    )

    slot_end = (
        first[
            "slot_end"
        ]
    )


    observations = [

        item[
            "observation"
        ]

        for item
        in grouped_items
    ]


    # --------------------------------------------------
    # CANONICAL STATE
    # --------------------------------------------------

    states = [

        item[
            "state"
        ]

        for item
        in grouped_items

        if item.get(
            "state"
        )
    ]


    # Remove duplicates while preserving order.

    states = list(
        dict.fromkeys(
            states
        )
    )


    state = (
        states[0]
        if states
        else None
    )


    # --------------------------------------------------
    # EVENT LOCATION
    # --------------------------------------------------

    latitude, longitude = (
        calculate_event_location(
            observations
        )
    )


    # --------------------------------------------------
    # UNIQUE CONTRIBUTORS
    # --------------------------------------------------

    contributor_ids = {

        contributor_key(
            observation
        )

        for observation
        in observations
    }


    contributor_count = (
        len(
            contributor_ids
        )
    )


    # --------------------------------------------------
    # EVIDENCE STRENGTH
    # --------------------------------------------------

    evidence_strength = (
        calculate_evidence_strength(
            contributor_count
        )
    )


    # --------------------------------------------------
    # FIND EXISTING EVENT
    # --------------------------------------------------

    event = (

        db.query(
            WeatherEvent
        )

        .filter(

            WeatherEvent.weather_type
            == phenomenon,

            WeatherEvent.district
            == district,

            WeatherEvent.start_time
            == slot_start,
        )

        .first()
    )


    # --------------------------------------------------
    # CREATE EVENT
    # --------------------------------------------------

    if not event:

        event = WeatherEvent(

            weather_type=
                phenomenon,

            description=(
                f"{phenomenon.replace('_', ' ').title()} "
                f"event in {district} "
                f"for nowcast period "
                f"{slot_start.strftime('%H:%M')}–"
                f"{slot_end.strftime('%H:%M')}"
            ),

            state=
                state,

            district=
                district,

            latitude=
                latitude,

            longitude=
                longitude,

            start_time=
                slot_start,

            end_time=
                slot_end,

            evidence_strength=
                evidence_strength,

            # Event verification remains manual.
            #
            # Evidence Strength must never set
            # verification automatically.

            status=
                "active",
        )

        db.add(
            event
        )

        db.flush()


    # --------------------------------------------------
    # UPDATE EXISTING EVENT
    # --------------------------------------------------

    else:

        event.state = (
            state
        )

        event.district = (
            district
        )

        event.latitude = (
            latitude
        )

        event.longitude = (
            longitude
        )

        event.end_time = (
            slot_end
        )

        event.evidence_strength = (
            evidence_strength
        )


    # --------------------------------------------------
    # EXISTING OBSERVATION LINKS
    # --------------------------------------------------

    existing_observation_ids = {

        row.observation_id

        for row in (

            db.query(
                WeatherObservationEvent
            )

            .filter(

                WeatherObservationEvent
                .weather_event_id
                == event.id
            )

            .all()
        )
    }


    # --------------------------------------------------
    # LINK SUPPORTING OBSERVATIONS
    # --------------------------------------------------

    for observation in observations:

        if (
            observation.id
            in existing_observation_ids
        ):

            continue


        link = (
            WeatherObservationEvent(

                observation_id=
                    observation.id,

                weather_event_id=
                    event.id,
            )
        )

        db.add(
            link
        )


        existing_observation_ids.add(
            observation.id
        )


    return event

# --------------------------------------------------
# INCREMENTAL EVENT GENERATION
# --------------------------------------------------

def generate_weather_events_for_observation_ids(
    db: Session,
    observation_ids,
):
    """
    Incrementally create/update Weather Events only
    for groups affected by newly imported observations.

    No historical full-table scan is performed.
    """

    observation_ids = list(
        {
            int(observation_id)
            for observation_id in observation_ids
            if observation_id is not None
        }
    )

    if not observation_ids:

        return {
            "new_observation_count": 0,
            "affected_bucket_count": 0,
            "candidate_observation_count": 0,
            "events_processed": 0,
        }


    # --------------------------------------------------
    # FETCH ONLY NEW OBSERVATIONS
    # --------------------------------------------------

    new_observations = (

        db.query(
            WeatherObservation
        )

        .filter(
            WeatherObservation.id.in_(
                observation_ids
            )
        )

        .all()
    )


    # --------------------------------------------------
    # DETERMINE AFFECTED DISTRICT + SLOT BUCKETS
    # --------------------------------------------------

    affected_buckets = {}

    for observation in new_observations:

        district = (
            get_observation_district(
                observation
            )
        )

        if not district:
            continue


        slot = get_nowcast_slot(
            observation.observation_time
        )

        if not slot:
            continue


        slot_start, slot_end = slot


        bucket_key = (
            district.casefold(),
            slot_start,
        )


        bucket = (
            affected_buckets.setdefault(
                bucket_key,
                {
                    "district":
                        district,

                    "slot_start":
                        slot_start,

                    "slot_end":
                        slot_end,

                    "phenomena":
                        set(),
                },
            )
        )


        for phenomenon in split_phenomena(
            observation.phenomenon
        ):

            bucket[
                "phenomena"
            ].add(
                phenomenon
            )


    if not affected_buckets:

        return {
            "new_observation_count":
                len(new_observations),

            "affected_bucket_count": 0,

            "candidate_observation_count": 0,

            "events_processed": 0,
        }


    # --------------------------------------------------
    # BUILD ONE BOUNDED QUERY
    #
    # Each condition uses:
    #
    # normalized_district
    # +
    # observation_time range
    #
    # rather than reading the entire observation table.
    # --------------------------------------------------

    bucket_conditions = []

    for bucket in (
        affected_buckets.values()
    ):

        bucket_conditions.append(

            and_(

                WeatherObservation
                .normalized_district
                == bucket["district"],

                WeatherObservation
                .observation_time
                >= bucket["slot_start"],

                WeatherObservation
                .observation_time
                < bucket["slot_end"],
            )
        )


    candidate_observations = (

        db.query(
            WeatherObservation
        )

        .filter(
            or_(
                *bucket_conditions
            )
        )

        .order_by(
            WeatherObservation
            .observation_time
            .asc(),

            WeatherObservation
            .id
            .asc(),
        )

        .all()
    )


    # --------------------------------------------------
    # ORGANIZE CANDIDATES BY DISTRICT + SLOT
    # --------------------------------------------------

    candidates_by_bucket = (
        defaultdict(list)
    )


    for observation in (
        candidate_observations
    ):

        district = (
            get_observation_district(
                observation
            )
        )

        if not district:
            continue


        slot = get_nowcast_slot(
            observation.observation_time
        )

        if not slot:
            continue


        slot_start, slot_end = slot


        bucket_key = (
            district.casefold(),
            slot_start,
        )


        if (
            bucket_key
            not in affected_buckets
        ):

            continue


        candidates_by_bucket[
            bucket_key
        ].append(
            observation
        )


    # --------------------------------------------------
    # UPDATE ONLY AFFECTED WEATHER EVENTS
    # --------------------------------------------------

    events_processed = 0


    for (
        bucket_key,
        bucket
    ) in affected_buckets.items():

        observations = (
            candidates_by_bucket.get(
                bucket_key,
                []
            )
        )


        for phenomenon in (
            bucket["phenomena"]
        ):

            grouped_items = []


            for observation in observations:

                observation_phenomena = (
                    split_phenomena(
                        observation.phenomenon
                    )
                )


                if (
                    phenomenon
                    not in observation_phenomena
                ):

                    continue


                grouped_items.append({

                    "observation":
                        observation,

                    "state":
                        get_observation_state(
                            observation
                        ),

                    "district":
                        bucket[
                            "district"
                        ],

                    "slot_start":
                        bucket[
                            "slot_start"
                        ],

                    "slot_end":
                        bucket[
                            "slot_end"
                        ],

                    "phenomenon":
                        phenomenon,
                })


            if not grouped_items:

                continue


            create_or_update_event(
                db,
                grouped_items,
            )


            events_processed += 1


    db.commit()


    return {

        "new_observation_count":
            len(new_observations),

        "affected_bucket_count":
            len(
                affected_buckets
            ),

        "candidate_observation_count":
            len(
                candidate_observations
            ),

        "events_processed":
            events_processed,
    }



# --------------------------------------------------
# GENERATE EVENTS
# --------------------------------------------------

def generate_weather_events(
    db: Session,
):

    observations = (

        db.query(
            WeatherObservation
        )

        .filter(

            # Keep original-district fallback available.
            #
            # An observation can participate when either
            # normalized_district or original district
            # is available.

            (
                WeatherObservation
                .normalized_district
                .isnot(None)
            )
            |
            (
                WeatherObservation
                .district
                .isnot(None)
            ),

            WeatherObservation
            .observation_time
            .isnot(None),
        )

        .order_by(

            WeatherObservation
            .observation_time
            .asc(),

            WeatherObservation
            .id
            .asc(),
        )

        .all()
    )


    groups = (
        build_event_groups(
            observations
        )
    )


    processed = 0


    for grouped_items in (
        groups.values()
    ):

        create_or_update_event(
            db,
            grouped_items,
        )

        processed += 1


    db.commit()


    return {

        "observation_count":
            len(
                observations
            ),

        "event_group_count":
            len(
                groups
            ),

        "events_processed":
            processed,
    }
