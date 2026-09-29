import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    LinearProgress,
    Chip
} from "@mui/material";


// --------------------------------------------------
// FORMAT WEATHER TYPE
// --------------------------------------------------

function formatWeatherType(value) {

    return (
        value ||
        "Weather Event"
    )
        .replaceAll(
            "_",
            " "
        );

}


// --------------------------------------------------
// FORMAT EVENT DATE
// --------------------------------------------------

function formatEventDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC"
        }
    );

}


// --------------------------------------------------
// FORMAT EVENT TIME
// --------------------------------------------------

function formatEventTime(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC"
        }
    );

}


// --------------------------------------------------
// OBSERVATION SPAN
// --------------------------------------------------

function getObservationSpan(
    firstValue,
    latestValue
) {

    if (
        !firstValue ||
        !latestValue
    ) {
        return "—";
    }

    const first =
        new Date(firstValue);

    const latest =
        new Date(latestValue);

    if (
        Number.isNaN(
            first.getTime()
        ) ||
        Number.isNaN(
            latest.getTime()
        )
    ) {
        return "—";
    }

    const minutes =
        Math.max(
            0,
            Math.round(
                (
                    latest.getTime() -
                    first.getTime()
                )
                /
                60000
            )
        );

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const remainingMinutes =
        minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} hr`;
    }

    return (
        `${hours} hr ${remainingMinutes} min`
    );

}


// --------------------------------------------------
// EVIDENCE LABEL
// --------------------------------------------------

function getEvidenceLabel(strength) {

    const value =
        Number(strength) || 0;

    if (value >= 100) {
        return "Very Strong";
    }

    if (value >= 80) {
        return "Strong";
    }

    if (value >= 60) {
        return "Moderate";
    }

    if (value >= 40) {
        return "Low";
    }

    return "Limited";

}


// --------------------------------------------------
// DETAIL ROW
// --------------------------------------------------

function DetailRow({
    label,
    value
}) {

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems:
                    "flex-start",
                gap: 1,
                py: 0.55
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                textAlign="right"
                sx={{
                    wordBreak:
                        "break-word"
                }}
            >
                {value ?? "—"}
            </Typography>

        </Box>

    );

}


// ==================================================
// WEATHER EVENT PANEL
// ==================================================

function WeatherEventPanel({
    selectedWeatherEvent
}) {

    if (!selectedWeatherEvent) {

        return (

            <Box
                sx={{
                    width: {
                        xs: "92vw",
                        sm: 320
                    },

                    minWidth: {
                        xs: 0,
                        sm: 320
                    },

                    maxWidth: 320,
                    height: "100%",
                    minHeight: 0,
                    flexShrink: 0,
                    boxSizing:
                        "border-box",

                    bgcolor: "#f5f5f5",
                    borderLeft:
                        "1px solid #ddd",

                    p: 1.5
                }}
            >

                <Card
                    sx={{
                        height: "100%"
                    }}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Weather Event
                        </Typography>

                        <Divider
                            sx={{
                                my: 1.5
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Select a Weather Event
                            on the map to view its
                            forecaster summary.
                        </Typography>

                    </CardContent>

                </Card>

            </Box>

        );

    }


    const event =
        selectedWeatherEvent;

    const evidenceStrength =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    event.evidence_strength
                ) || 0
            )
        );

    const observationCount =
        Number(
            event.observation_count
        ) || 0;

    const contributorCount =
        Number(
            event.contributor_count
        ) || 0;

    const location =
        [
            event.district,
            event.state
        ]
            .filter(Boolean)
            .join(", ") || "—";

    const eventStatus =
        (
            event.status ||
            "active"
        )
            .replaceAll(
                "_",
                " "
            )
            .toUpperCase();


    return (

        <Box
            sx={{
                width: {
                    xs: "92vw",
                    sm: 320
                },

                minWidth: {
                    xs: 0,
                    sm: 320
                },

                maxWidth: 320,

                height: "100%",
                minHeight: 0,

                flexShrink: 0,

                boxSizing:
                    "border-box",

                bgcolor: "#f5f5f5",

                borderLeft:
                    "1px solid #ddd",

                p: 1.5,

                overflow: "hidden"
            }}
        >

            <Card
                sx={{
                    height: "100%",

                    display: "flex",
                    flexDirection:
                        "column",

                    overflow: "hidden"
                }}
            >

                <CardContent
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >

                    {/* EVENT HEADER */}

                    <Typography
                        variant="overline"
                        color="text.secondary"
                        fontWeight={700}
                    >
                        Weather Event
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                            lineHeight: 1.15
                        }}
                    >
                        {formatWeatherType(
                            event.weather_type ||
                            event.event_name
                        )}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        {location}
                    </Typography>

                    <Box
                        sx={{
                            mt: 1.25
                        }}
                    >

                        <Chip
                            size="small"
                            label={
                                `Event status: ${eventStatus}`
                            }
                            variant="outlined"
                        />

                    </Box>


                    {/* EVIDENCE */}

                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />

                    <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                    >
                        Evidence Strength
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            mt: 0.75,
                            mb: 0.75
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {evidenceStrength} / 100
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {getEvidenceLabel(
                                evidenceStrength
                            )}
                        </Typography>

                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={
                            evidenceStrength
                        }
                        sx={{
                            height: 7,
                            borderRadius: 4,
                            mb: 1.25
                        }}
                    />

                    <DetailRow
                        label={
                            "Independent contributors"
                        }
                        value={
                            contributorCount
                        }
                    />

                    <DetailRow
                        label={
                            "Supporting observations"
                        }
                        value={
                            observationCount
                        }
                    />


                    {/* ACTUAL OBSERVATIONS */}

                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />

                    <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                            mb: 0.5
                        }}
                    >
                        Actual Observations
                    </Typography>

                    <DetailRow
                        label="First reported"
                        value={
                            formatEventTime(
                                event.first_observation_time
                            )
                        }
                    />

                    <DetailRow
                        label="Latest reported"
                        value={
                            formatEventTime(
                                event.latest_observation_time
                            )
                        }
                    />

                    <DetailRow
                        label="Observed span"
                        value={
                            getObservationSpan(
                                event.first_observation_time,
                                event.latest_observation_time
                            )
                        }
                    />


                    {/* NOWCAST PERIOD */}

                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />

                    <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                            mb: 0.5
                        }}
                    >
                        Nowcast Period
                    </Typography>

                    <DetailRow
                        label="Date"
                        value={
                            formatEventDate(
                                event.start_time
                            )
                        }
                    />

                    <DetailRow
                        label="Period"
                        value={
                            `${
                                formatEventTime(
                                    event.start_time
                                )
                            }–${
                                formatEventTime(
                                    event.end_time
                                )
                            }`
                        }
                    />


                    {/* EXPLANATION */}

                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            lineHeight: 1.45
                        }}
                    >
                        Evidence Strength reflects
                        independent supporting
                        contributors. It is
                        decision-support information
                        and does not mean that the
                        event has been manually
                        verified.
                    </Typography>

                </CardContent>

            </Card>

        </Box>

    );

}


// ==================================================
// CONTEXT PANEL
// ==================================================

export default function ContextPanel({
    observations,
    timeWindow,
    selectedEvents,
    selectedSources,
    viewMode,
    selectedWeatherEvent
}) {


    // ==================================================
    // WEATHER EVENTS MODE
    // ==================================================

    if (viewMode === "events") {

        return (

            <WeatherEventPanel
                selectedWeatherEvent={
                    selectedWeatherEvent
                }
            />

        );

    }


    // ==================================================
    // WEATHER REPORTS MODE
    // ==================================================

    let filtered = [
        ...observations
    ];


    // --------------------------------------------------
    // SOURCE FILTER
    // --------------------------------------------------

    if (
        selectedSources &&
        selectedSources.length > 0
    ) {

        filtered =
            filtered.filter(
                report =>
                    selectedSources.includes(
                        report.source
                    )
            );

    }
    else {

        filtered = [];

    }


    // --------------------------------------------------
    // EVENT FILTER
    // --------------------------------------------------

    if (
        selectedEvents &&
        selectedEvents.length > 0
    ) {

        filtered =
            filtered.filter(
                report => {

                    const rawEvent = (
                        report.event_code ||
                        report.event_name ||
                        report.phenomenon ||
                        ""
                    )
                        .trim()
                        .toUpperCase();

                    const reportEvents =
                        rawEvent
                            .split(",")
                            .map(
                                event =>
                                    event
                                        .trim()
                                        .replace(
                                            "/",
                                            "_"
                                        )
                            );

                    return reportEvents.some(
                        event =>
                            selectedEvents.includes(
                                event
                            )
                    );

                }
            );

    }
    else {

        filtered = [];

    }


    // --------------------------------------------------
    // TIME FILTER
    // --------------------------------------------------

    const now =
        new Date();

    filtered =
        filtered.filter(
            report => {

                const rawTime =
                    report.observation_time ||
                    report.time ||
                    report.created_at ||
                    report.timestamp;

                if (!rawTime) {
                    return false;
                }

                const reportTime =
                    new Date(
                        typeof rawTime ===
                        "string"
                            ? rawTime.replace(
                                " ",
                                "T"
                            )
                            : rawTime
                    );

                if (
                    Number.isNaN(
                        reportTime.getTime()
                    )
                ) {
                    return false;
                }

                const diffHours =
                    (
                        now.getTime() -
                        reportTime.getTime()
                    )
                    /
                    (
                        1000 *
                        60 *
                        60
                    );

                switch (timeWindow) {

                    case "30m":
                        return diffHours <= 0.5;

                    case "1h":
                        return diffHours <= 1;

                    case "3h":
                        return diffHours <= 3;

                    case "6h":
                        return diffHours <= 6;

                    case "24h":
                        return diffHours <= 24;

                    case "7d":
                        return diffHours <= 24 * 7;

                    case "30d":
                        return diffHours <= 24 * 30;

                    case "1y":
                        return diffHours <= 24 * 365;

                    default:
                        return true;

                }

            }
        );


    // --------------------------------------------------
    // STATE STATISTICS
    // --------------------------------------------------

    const stateCounts = {};

    filtered.forEach(
        report => {

            const state =
                report.state ||
                "Unknown";

            stateCounts[state] =
                (
                    stateCounts[state] ||
                    0
                ) + 1;

        }
    );

    const topStates =
        Object.entries(
            stateCounts
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    // --------------------------------------------------
    // DISTRICT STATISTICS
    // --------------------------------------------------

    const districtCounts = {};

    filtered.forEach(
        report => {

            const district =
                report.district ||
                "Unknown";

            districtCounts[district] =
                (
                    districtCounts[district] ||
                    0
                ) + 1;

        }
    );

    const topDistricts =
        Object.entries(
            districtCounts
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(
                0,
                50
            );


    // --------------------------------------------------
    // OBSERVATION EVENT SUMMARY
    // --------------------------------------------------

    const eventCounts = {};

    filtered.forEach(
        report => {

            const event = (
                report.event_code ||
                report.event_name ||
                "UNKNOWN"
            )
                .trim()
                .toUpperCase();

            eventCounts[event] =
                (
                    eventCounts[event] ||
                    0
                ) + 1;

        }
    );

    const eventSummary =
        Object.entries(
            eventCounts
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    // --------------------------------------------------
    // TIME WINDOW LABEL
    // --------------------------------------------------

    const timeWindowLabels = {

        "30m":
            "Last 30 minutes",

        "1h":
            "Last 1 hour",

        "3h":
            "Last 3 hours",

        "6h":
            "Last 6 hours",

        "24h":
            "Last 24 hours",

        "7d":
            "Last 7 days",

        "30d":
            "Last 30 days",

        "1y":
            "Last 1 year"

    };

    const timeWindowLabel =
        timeWindowLabels[
            timeWindow
        ] ||
        "Selected period";


    // ==================================================
    // WEATHER REPORTS UI
    // ==================================================

    return (

        <Box
            sx={{
                width: {
                    xs: "92vw",
                    sm: 320
                },

                minWidth: {
                    xs: 0,
                    sm: 320
                },

                maxWidth: 320,

                height: "100%",
                minHeight: 0,

                flexShrink: 0,

                boxSizing:
                    "border-box",

                bgcolor: "#f5f5f5",

                borderLeft:
                    "1px solid #ddd",

                p: 1.5,

                display: "flex",
                flexDirection: "column",

                gap: 1.5,

                overflow: "hidden"
            }}
        >

            {/* OBSERVATIONS SUMMARY */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection:
                        "column",

                    overflow: "hidden"
                }}
            >

                <CardContent
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Observations Summary
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {timeWindowLabel}
                    </Typography>

                    <Divider
                        sx={{
                            my: 1.5
                        }}
                    />

                    {eventSummary.length ===
                        0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No observations for
                            the selected filters.
                        </Typography>

                    )}

                    {eventSummary.map(
                        ([event, count]) => (

                            <Box
                                key={event}
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "space-between",

                                    py: 0.75
                                }}
                            >

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "1.1rem",

                                            mr: 1
                                        }}
                                    >
                                        {
                                            event ===
                                            "RAIN"
                                                ? "🌧️"

                                            : event ===
                                              "THUNDER_LIGHTNING"
                                                ? "⚡"

                                            : event ===
                                              "HAIL"
                                                ? "🌨️"

                                            : event ===
                                              "SNOW"
                                                ? "❄️"

                                            : "🌦️"
                                        }
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            event.replaceAll(
                                                "_",
                                                " "
                                            )
                                        }
                                    </Typography>

                                </Box>

                                <Typography
                                    fontWeight="bold"
                                    sx={{
                                        ml: 1
                                    }}
                                >
                                    {count}
                                </Typography>

                            </Box>

                        )
                    )}

                </CardContent>

            </Card>


            {/* STATE LEADERBOARD */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection:
                        "column",

                    overflow: "hidden"
                }}
            >

                <CardContent
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        State Leaderboard
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1
                        }}
                    >
                        States with most
                        observations — {
                            timeWindowLabel
                        }
                    </Typography>

                    <Divider
                        sx={{
                            mb: 1
                        }}
                    />

                    {topStates.length ===
                        0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No state data
                            available.
                        </Typography>

                    )}

                    {topStates.map(
                        (
                            [state, count],
                            index
                        ) => (

                            <Box
                                key={state}
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "space-between",

                                    py: 0.6
                                }}
                            >

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            width: 28,

                                            fontWeight:
                                                600,

                                            flexShrink:
                                                0
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {state}
                                    </Typography>

                                </Box>

                                <Typography
                                    fontWeight="bold"
                                    sx={{
                                        ml: 1
                                    }}
                                >
                                    {count}
                                </Typography>

                            </Box>

                        )
                    )}

                </CardContent>

            </Card>


            {/* DISTRICT LEADERBOARD */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection:
                        "column",

                    overflow: "hidden"
                }}
            >

                <CardContent
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        District Leaderboard
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1
                        }}
                    >
                        Top 50 districts by
                        observations — {
                            timeWindowLabel
                        }
                    </Typography>

                    <Divider
                        sx={{
                            mb: 1
                        }}
                    />

                    {topDistricts.length ===
                        0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No district data
                            available.
                        </Typography>

                    )}

                    {topDistricts.map(
                        (
                            [district, count],
                            index
                        ) => (

                            <Box
                                key={district}
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "space-between",

                                    py: 0.6
                                }}
                            >

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            width: 28,

                                            fontWeight:
                                                600,

                                            flexShrink:
                                                0
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",

                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {district}
                                    </Typography>

                                </Box>

                                <Typography
                                    fontWeight="bold"
                                    sx={{
                                        ml: 1
                                    }}
                                >
                                    {count}
                                </Typography>

                            </Box>

                        )
                    )}

                </CardContent>

            </Card>

        </Box>

    );

}
