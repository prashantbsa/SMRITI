import {
    useMemo
} from "react";

import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
} from "@mui/material";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import rainIcon
    from "../../assets/weather-icons/rain.svg";

import lightningIcon
    from "../../assets/weather-icons/lightning.svg";

import snowIcon
    from "../../assets/weather-icons/snow.svg";

import hailIcon
    from "../../assets/weather-icons/hail.svg";

import fogIcon
    from "../../assets/weather-icons/fog.svg";

import drizzleIcon
    from "../../assets/weather-icons/drizzle.svg";

import thunderIcon
    from "../../assets/weather-icons/thunder.svg";

import thunderLightningIcon
    from "../../assets/weather-icons/thunder_lightning.svg";

import hotHumidIcon
    from "../../assets/weather-icons/hot_humid.svg";

import dustStormIcon
    from "../../assets/weather-icons/dust_storm.svg";

import gustyWindIcon
    from "../../assets/weather-icons/gusty_wind.svg";

import cycloneIcon
    from "../../assets/weather-icons/cyclone.svg";

// --------------------------------------------------
// SOURCES
// --------------------------------------------------

const SOURCES = [
    "MEGHDOOT",
    "MAUSAM",
];


// --------------------------------------------------
// WEATHER TYPES
// --------------------------------------------------

const WEATHER_EVENTS = [
    "RAIN",
    "DRIZZLE",
    "THUNDER",
    "LIGHTNING",
    "THUNDER_LIGHTNING",
    "HAIL",
    "SNOW",
    "FOG",
    "HOT_HUMID",
    "DUST_STORM",
    "GUSTY_WIND",
    "CYCLONE",
];

// --------------------------------------------------
// WEATHER DISPLAY INFORMATION
// --------------------------------------------------

const WEATHER_DISPLAY = {

    RAIN: {
        label: "Rain",
        icon: rainIcon
    },

    DRIZZLE: {
        label: "Drizzle",
        icon: drizzleIcon
    },

    THUNDER: {
        label: "Thunder",
        icon: thunderIcon
    },

    LIGHTNING: {
        label: "Lightning",
        icon: lightningIcon
    },

    THUNDER_LIGHTNING: {
        label: "Thunder & Lightning",
        icon: thunderLightningIcon
    },

    HAIL: {
        label: "Hail",
        icon: hailIcon
    },

    SNOW: {
        label: "Snow",
        icon: snowIcon
    },

    FOG: {
        label: "Fog",
        icon: fogIcon
    },

    HOT_HUMID: {
        label: "Hot & Humid",
        icon: hotHumidIcon
    },

    DUST_STORM: {
        label: "Dust Storm",
        icon: dustStormIcon
    },

    GUSTY_WIND: {
        label: "Gusty Wind",
        icon: gustyWindIcon
    },

    CYCLONE: {
        label: "Cyclone",
        icon: cycloneIcon
    }

};



// --------------------------------------------------
// VERIFICATION
// --------------------------------------------------

const VERIFICATION_STATUSES = [
    "ALL",
    "VERIFIED",
    "UNVERIFIED",
];


// --------------------------------------------------
// NORMALIZE PHENOMENON
// --------------------------------------------------

function normalizePhenomenon(
    value
) {

    if (!value) {
        return "";
    }

    let normalized = String(value)
        .trim()
        .toUpperCase()
        .replaceAll(" ", "_")
        .replaceAll("-", "_");


    const aliases = {

        "THUNDER/LIGHTNING":
            "THUNDER_LIGHTNING",

        "THUNDERSTORM":
            "THUNDER_LIGHTNING",

        "THUNDERSTORM_LIGHTNING":
            "THUNDER_LIGHTNING",

"THUNDER/LIGHTNING":
    "THUNDER_LIGHTNING",

"THUNDERSTORM":
    "THUNDER_LIGHTNING",

"THUNDERSTORM_LIGHTNING":
    "THUNDER_LIGHTNING",

        "HAILSTORM":
            "HAIL",

        "SNOWFALL":
            "SNOW",

        "HOT_AND_HUMID":
            "HOT_HUMID",

        "DUSTSTORM":
            "DUST_STORM",

        "STRONG_WIND":
            "GUSTY_WIND",

    };


    return (
        aliases[normalized] ||
        normalized
    );

}


// --------------------------------------------------
// SPLIT MULTIPLE PHENOMENA
// --------------------------------------------------

function getReportPhenomena(
    report
) {

    const rawValue = (

        report.event_code ||
        report.event_name ||
        report.phenomenon ||
        ""

    );


    return String(rawValue)
        .split(",")
        .map(
            item =>
                normalizePhenomenon(
                    item
                )
        )
        .filter(Boolean);

}


// --------------------------------------------------
// TIME FILTER
// --------------------------------------------------

function reportInsideTimeWindow(
    report,
    timeWindow,
    now
) {

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

            typeof rawTime === "string"

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


// ==================================================
// SIDEBAR
// ==================================================

export default function Sidebar({

    observations,
    observationsLoading,

    timeWindow,
    setTimeWindow,

    selectedEvents,
    setSelectedEvents,

    selectedSources,
    setSelectedSources,

}) {

    const selectedVerificationStatus =
        "ALL";


    // --------------------------------------------------
    // OBSERVATIONS WITHIN SELECTED TIME
    // --------------------------------------------------

    const timeFilteredObservations =
        useMemo(() => {

            const now =
                new Date();


            return observations.filter(
                report =>
                    reportInsideTimeWindow(
                        report,
                        timeWindow,
                        now
                    )
            );

        }, [
            observations,
            timeWindow
        ]);


    // --------------------------------------------------
    // SOURCE COUNTS
    //
    // Deliberately independent of selectedSources.
    // This lets the operator see how many observations
    // exist even when a source is currently unchecked.
    // --------------------------------------------------

    const sourceCounts =
        useMemo(() => {

            const counts = {

                MEGHDOOT: 0,
                MAUSAM: 0,

            };


            timeFilteredObservations
                .forEach(report => {

                    const source =
                        String(
                            report.source || ""
                        )
                        .trim()
                        .toUpperCase();


                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                counts,
                                source
                            )
                    ) {

                        counts[source] += 1;

                    }

                });


            return counts;

        }, [
            timeFilteredObservations
        ]);


    // --------------------------------------------------
    // OBSERVATIONS AFTER SOURCE SELECTION
    // --------------------------------------------------

    const sourceFilteredObservations =
        useMemo(() => {

            if (
                !selectedSources ||
                selectedSources.length === 0
            ) {

                return [];

            }


            return (
                timeFilteredObservations
                    .filter(report => {

                        const source =
                            String(
                                report.source || ""
                            )
                            .trim()
                            .toUpperCase();


                        return (
                            selectedSources.includes(
                                source
                            )
                        );

                    })
            );

        }, [
            timeFilteredObservations,
            selectedSources
        ]);


    // --------------------------------------------------
    // WEATHER COUNTS
    // --------------------------------------------------

    const weatherCounts =
        useMemo(() => {

            const counts = {};


            WEATHER_EVENTS.forEach(
                event => {

                    counts[event] = 0;

                }
            );


            sourceFilteredObservations
                .forEach(report => {

                    const phenomena =
                        new Set(
                            getReportPhenomena(
                                report
                            )
                        );


                    phenomena.forEach(
                        phenomenon => {

                            if (
                                Object.prototype
                                    .hasOwnProperty
                                    .call(
                                        counts,
                                        phenomenon
                                    )
                            ) {

                                counts[
                                    phenomenon
                                ] += 1;

                            }

                        }
                    );

                });


            return counts;

        }, [
            sourceFilteredObservations
        ]);


    // --------------------------------------------------
    // EVENT FILTER
    // --------------------------------------------------

    function toggleEvent(
        event
    ) {

        if (
            selectedEvents.includes(
                event
            )
        ) {

            setSelectedEvents(

                selectedEvents.filter(
                    e =>
                        e !== event
                )

            );

        }
        else {

            setSelectedEvents([
                ...selectedEvents,
                event
            ]);

        }

    }


    // --------------------------------------------------
    // SOURCE FILTER
    // --------------------------------------------------

    function toggleSource(
        source
    ) {

        if (
            selectedSources.includes(
                source
            )
        ) {

            setSelectedSources(

                selectedSources.filter(
                    s =>
                        s !== source
                )

            );

        }
        else {

            setSelectedSources([
                ...selectedSources,
                source
            ]);

        }

    }


    // --------------------------------------------------
    // COUNT BADGE
    // --------------------------------------------------

    function CountBadge({
        value
    }) {

        return (

            <Box
                sx={{
                    minWidth: 32,

                    px: 0.75,
                    py: 0.2,

                    ml: 1,

                    borderRadius: 4,

                    bgcolor:
                        "#eeeeee",

                    textAlign:
                        "center",

                    fontSize:
                        "0.75rem",

                    fontWeight:
                        700,

                    lineHeight:
                        1.6,

                    flexShrink:
                        0,
                }}
            >

                {
observationsLoading
    ? "…"
    : value
                }

            </Box>

        );

    }


    // --------------------------------------------------
    // WEATHER ICON
    // --------------------------------------------------

    function WeatherIcon({
        event
    }) {

        const display =
            WEATHER_DISPLAY[
                event
            ];


        if (
            display?.icon
        ) {

            return (

                <Box
                    component="img"

                    src={
                        display.icon
                    }

                    alt=""

                    sx={{
                        width: 23,
                        height: 23,

                        objectFit:
                            "contain",

                        flexShrink:
                            0,
                    }}
                />

            );

        }


        return (

            <Box
                sx={{
                    width: 23,
                    height: 23,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    fontSize:
                        "1rem",

                    flexShrink:
                        0,
                }}
            >
                {
                    display?.emoji ||
                    "•"
                }
            </Box>

        );

    }


    // ==================================================
    // UI
    // ==================================================

    return (

        <Box
            sx={{
		width: {
		    xs: "88vw",
		    sm: 290
		},
		minWidth: {
		    xs: 0,
		    sm: 290
		},
		maxWidth: 290,

                height: "100%",
                minHeight: 0,

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",

                boxSizing:
                    "border-box",

                bgcolor:
                    "#ffffff",

                borderRight:
                    "1px solid #e0e0e0",

                flexShrink: 0,
            }}
        >


            {/* ==========================================
                TIME
            ========================================== */}

            <Box
                sx={{
                    flex: "0 0 15%",
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >

                <Accordion
                    defaultExpanded
                    disableGutters

                    sx={{
                        height: "100%",

                        boxShadow:
                            "none",

                        "&:before": {
                            display:
                                "none",
                        },
                    }}
                >

                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }

                        sx={{
                            minHeight: 48,

                            "&.Mui-expanded": {
                                minHeight: 48,
                            },

                            "& .MuiAccordionSummary-content": {
                                margin:
                                    "12px 0",
                            },

                            "& .MuiAccordionSummary-content.Mui-expanded": {
                                margin:
                                    "12px 0",
                            },
                        }}
                    >

                        <Typography
                            fontWeight={600}
                        >
                            Time
                        </Typography>

                    </AccordionSummary>


                    <AccordionDetails>

                        <Select
                            fullWidth
                            size="small"

                            value={
                                timeWindow
                            }

                            onChange={
                                e =>
                                    setTimeWindow(
                                        e.target.value
                                    )
                            }
                        >

                            <MenuItem value="30m">
                                Past 30 Minutes
                            </MenuItem>

                            <MenuItem value="1h">
                                Past 1 Hour
                            </MenuItem>

                            <MenuItem value="3h">
                                Past 3 Hours
                            </MenuItem>

                            <MenuItem value="6h">
                                Past 6 Hours
                            </MenuItem>

                            <MenuItem value="24h">
                                Past 24 Hours
                            </MenuItem>

                            <MenuItem value="7d">
                                Past 7 Days
                            </MenuItem>

                            <MenuItem value="30d">
                                Past Month
                            </MenuItem>

                            <MenuItem value="1y">
                                This Year
                            </MenuItem>

                        </Select>

                    </AccordionDetails>

                </Accordion>

            </Box>


            {/* ==========================================
                WEATHER PHENOMENA
            ========================================== */}

            <Box
                sx={{
                    flex: 1,

                    minHeight: 0,
                    minWidth: 0,

                    overflowY:
                        "auto",

                    overflowX:
                        "hidden",

                    boxSizing:
                        "border-box",
                }}
            >

                <Box
                    sx={{
                        px: 1.5,
                        py: 1,
                    }}
                >

                    <Typography
                        variant="body2"

                        fontWeight={600}

                        sx={{
                            px: 0.5,
                            mb: 0.5,
                        }}
                    >
                        Weather Phenomena
                    </Typography>


                    <FormGroup>

                        {
                            WEATHER_EVENTS.map(
                                event => {

                                    const display =
                                        WEATHER_DISPLAY[
                                            event
                                        ];


                                    return (

                                        <Box
                                            key={
                                                event
                                            }

                                            sx={{
                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                minHeight:
                                                    38,

                                                width:
                                                    "100%",
                                            }}
                                        >

                                            <Checkbox
                                                checked={
                                                    selectedEvents
                                                        .includes(
                                                            event
                                                        )
                                                }

                                                onChange={
                                                    () =>
                                                        toggleEvent(
                                                            event
                                                        )
                                                }

                                                size="small"
                                            />


                                            <WeatherIcon
                                                event={
                                                    event
                                                }
                                            />


                                            <Typography
                                                sx={{
                                                    ml: 1,

                                                    flex: 1,

                                                    minWidth:
                                                        0,

                                                    fontSize:
                                                        "0.875rem",

                                                    overflow:
                                                        "hidden",

                                                    textOverflow:
                                                        "ellipsis",

                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {
                                                    display
                                                        ?.label ||
                                                    event
                                                        .replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                }
                                            </Typography>


                                            <CountBadge
                                                value={
                                                    weatherCounts[
                                                        event
                                                    ] || 0
                                                }
                                            />

                                        </Box>

                                    );

                                }
                            )
                        }

                    </FormGroup>

                </Box>

            </Box>


            {/* ==========================================
                INFORMATION SOURCES
            ========================================== */}

            <Box
                sx={{
                    flex:
                        "0 0 20%",

                    minHeight: 0,

                    display: "flex",

                    flexDirection:
                        "column",

                    overflow:
                        "hidden",
                }}
            >

                <Box
                    sx={{
                        flexShrink: 0,

                        px: 2,
                        py: 1.5,

                        borderTop:
                            "1px solid #e0e0e0",

                        borderBottom:
                            "1px solid #e0e0e0",
                    }}
                >

                    <Typography
                        fontWeight={600}
                    >
                        Information Sources
                    </Typography>

                </Box>


                <Box
                    sx={{
                        flex: 1,

                        minHeight: 0,

                        overflowY:
                            "auto",

                        overflowX:
                            "hidden",

                        px: 1.5,
                        py: 1,

                        boxSizing:
                            "border-box",
                    }}
                >

                    <FormGroup>

                        {
                            SOURCES.map(
                                source => (

                                    <Box
                                        key={
                                            source
                                        }

                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            minHeight:
                                                38,

                                            width:
                                                "100%",
                                        }}
                                    >

                                        <Checkbox
                                            checked={
                                                selectedSources
                                                    .includes(
                                                        source
                                                    )
                                            }

                                            onChange={
                                                () =>
                                                    toggleSource(
                                                        source
                                                    )
                                            }

                                            size="small"
                                        />


                                        <Typography
                                            sx={{
                                                flex: 1,

                                                fontSize:
                                                    "0.875rem",
                                            }}
                                        >

                                            {
                                                source ===
                                                "MEGHDOOT"

                                                    ? "Meghdoot"

                                                    : "Mausam"
                                            }

                                        </Typography>


                                        <CountBadge
                                            value={
                                                sourceCounts[
                                                    source
                                                ] || 0
                                            }
                                        />

                                    </Box>

                                )
                            )
                        }

                    </FormGroup>

                </Box>

            </Box>


            {/* ==========================================
                VERIFICATION STATUS
            ========================================== */}

            <Box
                sx={{
                    flex:
                        "1 1 25%",

                    minHeight: 0,

                    display: "flex",

                    flexDirection:
                        "column",

                    overflow:
                        "hidden",
                }}
            >

                <Box
                    sx={{
                        flexShrink: 0,

                        px: 2,
                        py: 1.5,

                        borderTop:
                            "1px solid #e0e0e0",

                        borderBottom:
                            "1px solid #e0e0e0",
                    }}
                >

                    <Typography
                        fontWeight={600}
                    >
                        Verification Status
                    </Typography>

                </Box>


                <Box
                    sx={{
                        flex: 1,

                        minHeight: 0,

                        px: 1.5,
                        py: 1,

                        overflow:
                            "hidden",
                    }}
                >

                    <RadioGroup
                        value={
                            selectedVerificationStatus
                        }
                    >

                        {
                            VERIFICATION_STATUSES
                                .map(
                                    status => (

                                        <FormControlLabel
                                            key={
                                                status
                                            }

                                            value={
                                                status
                                            }

                                            control={
                                                <Radio
                                                    size="small"
                                                />
                                            }

                                            label={
                                                status ===
                                                "ALL"

                                                    ? "All"

                                                    : status ===
                                                      "VERIFIED"

                                                        ? "Verified"

                                                        : "Unverified"
                                            }

                                            sx={{
                                                margin: 0,

                                                minHeight:
                                                    38,
                                            }}
                                        />

                                    )
                                )
                        }

                    </RadioGroup>

                </Box>

            </Box>

        </Box>

    );

}
