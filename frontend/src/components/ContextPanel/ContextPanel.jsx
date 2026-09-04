import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider
} from "@mui/material";

import ObservationService from "../../services/observationService";

export default function ContextPanel({
    timeWindow,
    selectedEvents,
    selectedSources
}) {

    const [observations, setObservations] = useState([]);

    useEffect(() => {

        ObservationService
            .getAllReports()
            .then(data => {
                setObservations(data || []);
            })
            .catch(error => {

                console.error(
                    "Unable to load observations for India Summary:",
                    error
                );

                setObservations([]);

            });

    }, []);


    // --------------------------------------------------
    // Filter observations
    // --------------------------------------------------

    let filtered = [...observations];


    // --------------------------------------------------
    // Source filter
    // --------------------------------------------------

    if (
        selectedSources &&
        selectedSources.length > 0
    ) {

        filtered = filtered.filter(report =>
            selectedSources.includes(report.source)
        );

    }


    // --------------------------------------------------
    // Event filter
    // --------------------------------------------------

// --------------------------------------------------
// Event filter
// --------------------------------------------------

if (
    selectedEvents &&
    selectedEvents.length > 0
) {

    filtered = filtered.filter(report => {

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
                .map(event =>
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

    });

}
else {

    filtered = [];

}

// --------------------------------------------------
// Time filter
// --------------------------------------------------

const now = new Date();

filtered = filtered.filter(report => {

    const rawTime =
        report.observation_time ||
        report.time ||
        report.created_at ||
        report.timestamp;

    if (!rawTime) {
        return false;
    }

    const reportTime = new Date(
        typeof rawTime === "string"
            ? rawTime.replace(" ", "T")
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

});


    // --------------------------------------------------
    // State statistics
    // --------------------------------------------------

    const stateCounts = {};

    filtered.forEach(report => {

        const state =
            report.state || "Unknown";

        stateCounts[state] =
            (stateCounts[state] || 0) + 1;

    });

    const topStates =
        Object.entries(stateCounts)
            .sort((a, b) => b[1] - a[1]);


    // --------------------------------------------------
    // District statistics
    // --------------------------------------------------

    const districtCounts = {};

    filtered.forEach(report => {

        const district =
            report.district || "Unknown";

        districtCounts[district] =
            (districtCounts[district] || 0) + 1;

    });

    const topDistricts =
        Object.entries(districtCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);


    // --------------------------------------------------
    // Observation event summary
    // --------------------------------------------------

    const eventCounts = {};

    filtered.forEach(report => {

        const event = (
            report.event_code ||
            report.event_name ||
            "UNKNOWN"
        )
            .trim()
            .toUpperCase();

        eventCounts[event] =
            (eventCounts[event] || 0) + 1;

    });

    const eventSummary =
        Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1]);


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

const timeWindowLabels = {

    "30m": "Last 30 minutes",
    "1h": "Last 1 hour",
    "3h": "Last 3 hours",
    "6h": "Last 6 hours",
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "1y": "Last 1 year"

};

const timeWindowLabel =
    timeWindowLabels[timeWindow] ||
    "Selected period";

    return (

        <Box
            sx={{
                width: 320,
                minWidth: 320,
                maxWidth: 320,

                height: "100%",
                minHeight: 0,

                flexShrink: 0,

                boxSizing: "border-box",

                bgcolor: "#f5f5f5",

                borderLeft: "1px solid #ddd",

                p: 1.5,

                display: "flex",
                flexDirection: "column",

                gap: 1.5,

                overflow: "hidden"
            }}
        >

            {/* =====================================================
                1. OBSERVATIONS SUMMARY
            ====================================================== */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

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

                    <Divider sx={{ my: 1.5 }} />

                    {eventSummary.length === 0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No observations for the selected filters.
                        </Typography>

                    )}

                    {eventSummary.map(
                        ([event, count]) => (

                            <Box
                                key={event}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",

                                    py: 0.75
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize: "1.1rem",
                                            mr: 1
                                        }}
                                    >
                                        {event === "RAIN"
                                            ? "🌧️"
                                            : event === "THUNDER_LIGHTNING"
                                                ? "⚡"
                                                : event === "HAIL"
                                                    ? "🌨️"
                                                    : event === "SNOW"
                                                        ? "❄️"
                                                        : "🌦️"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {event.replaceAll("_", " ")}
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


            {/* =====================================================
                2. STATE LEADERBOARD
            ====================================================== */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

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
                 States with most observations — {timeWindowLabel}
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    {topStates.length === 0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No state data available.
                        </Typography>

                    )}

                    {topStates.map(
                        ([state, count], index) => (

                            <Box
                                key={state}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",

                                    justifyContent:
                                        "space-between",

                                    py: 0.6
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            width: 28,
                                            fontWeight: 600,
                                            flexShrink: 0
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
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


            {/* =====================================================
                3. DISTRICT LEADERBOARD
            ====================================================== */}

            <Card
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

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
Top 50 districts by observations — {timeWindowLabel}
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    {topDistricts.length === 0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No district data available.
                        </Typography>

                    )}

                    {topDistricts.map(
                        ([district, count], index) => (

                            <Box
                                key={district}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",

                                    justifyContent:
                                        "space-between",

                                    py: 0.6
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            width: 28,
                                            fontWeight: 600,
                                            flexShrink: 0
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
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
