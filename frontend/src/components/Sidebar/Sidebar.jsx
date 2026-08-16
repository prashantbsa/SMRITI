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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const SOURCES = [
    "MEGHDOOT",
    "MAUSAM",
];


const WEATHER_EVENTS = [
    "RAIN",
    "DRIZZLE",
    "THUNDER_LIGHTNING",
    "HAIL",
    "SNOW",
    "FOG",
    "HOT_HUMID",
    "DUST_STORM",
    "GUSTY_WIND",
    "CYCLONE",
];


const VERIFICATION_STATUSES = [
    "ALL",
    "VERIFIED",
    "UNVERIFIED",
];


export default function Sidebar({
    timeWindow,
    setTimeWindow,

    selectedEvents,
    setSelectedEvents,

    selectedSources,
    setSelectedSources,
}) {

    const selectedVerificationStatus = "ALL";


    // --------------------------------------------------
    // EVENT FILTER
    // --------------------------------------------------

    function toggleEvent(event) {

        if (selectedEvents.includes(event)) {

            setSelectedEvents(
                selectedEvents.filter(
                    e => e !== event
                )
            );

        } else {

            setSelectedEvents([
                ...selectedEvents,
                event
            ]);

        }

    }


    // --------------------------------------------------
    // SOURCE FILTER
    // --------------------------------------------------

    function toggleSource(source) {

        if (selectedSources.includes(source)) {

            setSelectedSources(
                selectedSources.filter(
                    s => s !== source
                )
            );

        } else {

            setSelectedSources([
                ...selectedSources,
                source
            ]);

        }

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <Box
            sx={{
                width: 290,
                minWidth: 290,
                maxWidth: 290,

                height: "100%",
                minHeight: 0,

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",

                boxSizing: "border-box",

                bgcolor: "#ffffff",

                borderRight: "1px solid #e0e0e0",

                flexShrink: 0,
            }}
        >

            {/* ==================================================
                TIME
            ================================================== */}

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
                        boxShadow: "none",

                        "&:before": {
                            display: "none",
                        },
                    }}
                >

                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: 48,

                            "&.Mui-expanded": {
                                minHeight: 48,
                            },

                            "& .MuiAccordionSummary-content": {
                                margin: "12px 0",
                            },

                            "& .MuiAccordionSummary-content.Mui-expanded": {
                                margin: "12px 0",
                            },
                        }}
                    >

                        <Typography fontWeight={600}>
                            Time
                        </Typography>

                    </AccordionSummary>


                    <AccordionDetails>

                        <Select
                            fullWidth
                            size="small"
                            value={timeWindow}
                            onChange={(e) =>
                                setTimeWindow(e.target.value)
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


            {/* ==================================================
                OBSERVATION TYPE
                40% OF SIDEBAR
                SAME SCROLL BEHAVIOUR AS CONTEXT PANEL
            ================================================== */}


<Box
    sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,

        overflowY: "auto",
        overflowX: "hidden",

        boxSizing: "border-box",

        // IMPORTANT:
        // Do not put horizontal padding on the scroll container.
        // Put it inside instead.
    }}
>
    <Box
        sx={{
            px: 1.5,
            py: 1,
        }}
    >
        <FormGroup>

            {WEATHER_EVENTS.map(event => (

                <FormControlLabel
                    key={event}

                    control={
                        <Checkbox
                            checked={selectedEvents.includes(event)}
                            onChange={() => toggleEvent(event)}
                            size="small"
                        />
                    }

                    label={event.replaceAll("_", " ")}

                    sx={{
                        margin: 0,
                        minHeight: 38,
                    }}
                />

            ))}

        </FormGroup>
    </Box>
</Box>


            {/* ==================================================
                INFORMATION SOURCES
                20% OF SIDEBAR
                SAME SCROLL BEHAVIOUR AS CONTEXT PANEL
            ================================================== */}

            <Box
                sx={{
                    flex: "0 0 20%",
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        flexShrink: 0,

                        px: 2,
                        py: 1.5,

                        borderBottom: "1px solid #e0e0e0",
                    }}
                >

                    <Typography fontWeight={600}>
                        Information Sources
                    </Typography>

                </Box>


                {/* SCROLLING AREA */}

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden",

                        px: 1.5,
                        py: 1,

                        boxSizing: "border-box",
                    }}
                >

                    <FormGroup>

                        {SOURCES.map(source => (

                            <FormControlLabel
                                key={source}

                                control={
                                    <Checkbox
                                        checked={
                                            selectedSources.includes(source)
                                        }

                                        onChange={() =>
                                            toggleSource(source)
                                        }

                                        size="small"
                                    />
                                }

                                label={
                                    source === "MEGHDOOT"
                                        ? "Meghdoot"
                                        : "Mausam"
                                }

                                sx={{
                                    margin: 0,
                                    minHeight: 38,
                                }}
                            />

                        ))}

                    </FormGroup>

                </Box>

            </Box>


            {/* ==================================================
                VERIFICATION STATUS
                REMAINING SPACE
            ================================================== */}

            <Box
                sx={{
                    flex: "1 1 25%",
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        flexShrink: 0,

                        px: 2,
                        py: 1.5,

                        borderTop: "1px solid #e0e0e0",
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >

                    <Typography fontWeight={600}>
                        Verification Status
                    </Typography>

                </Box>


                {/* Content */}

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        px: 1.5,
                        py: 1,

                        overflow: "hidden",
                    }}
                >

                    <RadioGroup
                        value={selectedVerificationStatus}
                    >

                        {VERIFICATION_STATUSES.map(status => (

                            <FormControlLabel
                                key={status}

                                value={status}

                                control={
                                    <Radio size="small" />
                                }

                                label={
                                    status === "ALL"
                                        ? "All"
                                        : status === "VERIFIED"
                                            ? "Verified"
                                            : "Unverified"
                                }

                                sx={{
                                    margin: 0,
                                    minHeight: 38,
                                }}
                            />

                        ))}

                    </RadioGroup>

                </Box>

            </Box>

        </Box>

    );

}
