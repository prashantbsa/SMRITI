import {
    Box,
    Button,
    Drawer,
    useMediaQuery,
    useTheme
} from "@mui/material";

import FilterAltOutlinedIcon
    from "@mui/icons-material/FilterAltOutlined";

import InsightsOutlinedIcon
    from "@mui/icons-material/InsightsOutlined";

import {
    useEffect,
    useState
} from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MapView from "../components/Map/MapView";
import ContextPanel from "../components/ContextPanel/ContextPanel";
import Timeline from "../components/Timeline/Timeline";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import UserManagement from "../components/Admin/UserManagement";
import ObservationService
    from "../services/observationService";

export default function MainLayout({
    currentUser,
    onLogout
}) {

    const theme = useTheme();

    /*
     * Desktop:
     *   Sidebar | Main Area | Context Panel
     *
     * Tablet / Mobile:
     *   Main Area occupies the screen.
     *   Sidebar and Context Panel are opened
     *   as temporary drawers.
     */
    const compactLayout =
        useMediaQuery(
            theme.breakpoints.down("lg")
        );

    const mobileLayout =
        useMediaQuery(
            theme.breakpoints.down("sm")
        );


    const [viewMode, setViewMode] =
        useState("reports");

    const [adminView, setAdminView] =
        useState(false);

    const [filtersOpen, setFiltersOpen] =
        useState(false);

    const [summaryOpen, setSummaryOpen] =
        useState(false);

    const [timeWindow, setTimeWindow] =
        useState("1y");

    const [
        selectedSources,
        setSelectedSources
    ] = useState([
        "MEGHDOOT",
        "MAUSAM"
    ]);

    const [
        selectedEvents,
        setSelectedEvents
    ] = useState([
        "RAIN",
        "DRIZZLE",
        "THUNDER_LIGHTNING",
        "HAIL",
        "SNOW",
        "FOG",
        "HOT_HUMID",
        "DUST_STORM",
        "STRONG_WIND",
        "GUSTY_WIND",
        "CYCLONE"
    ]);

    /*
     * ==========================================================
     * SHARED OBSERVATION DATA
     * ==========================================================
     *
     * Observations are loaded once at dashboard level and
     * shared with Sidebar and ContextPanel.
     *
     * This prevents those components from independently
     * requesting the same dataset.
     */

    const [
        observations,
        setObservations
    ] = useState([]);

    const [
        observationsLoading,
        setObservationsLoading
    ] = useState(true);


    useEffect(() => {

        let active = true;

        setObservationsLoading(true);


        ObservationService
            .getAllReports()

            .then(data => {

                if (!active) {
                    return;
                }

                setObservations(
                    data || []
                );

            })

            .catch(error => {

                console.error(
                    "Unable to load dashboard observations:",
                    error
                );

                if (active) {
                    setObservations([]);
                }

            })

            .finally(() => {

                if (active) {
                    setObservationsLoading(false);
                }

            });


        return () => {
            active = false;
        };

    }, []);


    const sidebarContent = (

        <Sidebar
            observations={observations}
            observationsLoading={
                observationsLoading
            }

            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}

            selectedEvents={selectedEvents}
            setSelectedEvents={setSelectedEvents}

            selectedSources={selectedSources}
            setSelectedSources={setSelectedSources}
        />

    );

    const contextContent = (

        <ContextPanel
            observations={observations}

            timeWindow={timeWindow}
            selectedEvents={selectedEvents}
            selectedSources={selectedSources}
        />

    );

    return (

        <Box
            sx={{
                height: "100dvh",
                width: "100%",

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
                minHeight: 0
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
                sx={{
                    flexShrink: 0
                }}
            >

                <Header
                    currentUser={currentUser}

                    onUserManagement={() =>
                        setAdminView(true)
                    }

                    onLogout={onLogout}
                />

            </Box>


            {/* ==================================================
                MAIN DASHBOARD AREA
            ================================================== */}

            {adminView ? (

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "hidden"
                    }}
                >

                    <UserManagement
                        onClose={() =>
                            setAdminView(false)
                        }
                    />

                </Box>

            ) : (

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        display: "flex",

                        overflow: "hidden"
                    }}
                >

                    {/* ==========================================
                        DESKTOP LEFT SIDEBAR
                    ========================================== */}

                    {!compactLayout && (

                        <Box
                            sx={{
                                width: 290,
                                minWidth: 290,
                                maxWidth: 290,

                                height: "100%",

                                flexShrink: 0,
                                minHeight: 0,

                                display: "flex",
                                flexDirection: "column",

                                overflow: "hidden",

                                borderRight:
                                    "1px solid #ddd",

                                boxSizing:
                                    "border-box"
                            }}
                        >

                            {sidebarContent}

                        </Box>

                    )}


                    {/* ==========================================
                        CENTER AREA
                    ========================================== */}

                    <Box
                        sx={{
                            flex: 1,

                            minWidth: 0,
                            minHeight: 0,

                            display: "flex",
                            flexDirection: "column",

                            overflow: "hidden"
                        }}
                    >

                        {/* ======================================
                            TOP VIEW SELECTOR
                        ====================================== */}

                        <Box
                            sx={{
                                flexShrink: 0,

                                height: 48,

                                display: "flex",
                                alignItems: "center",

                                px: {
                                    xs: 1,
                                    sm: 1.5,
                                    lg: 2
                                },

                                backgroundColor:
                                    "#ffffff",

                                borderBottom:
                                    "1px solid #ddd",

                                gap: {
                                    xs: 1.25,
                                    sm: 2,
                                    lg: 3
                                },

                                boxSizing:
                                    "border-box",

                                overflowX: "auto",
                                overflowY: "hidden",

                                whiteSpace: "nowrap"
                            }}
                        >

                            {/* WEATHER REPORTS */}

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    cursor: "pointer",
                                    flexShrink: 0
                                }}
                            >

                                <input
                                    type="radio"

                                    checked={
                                        viewMode ===
                                        "reports"
                                    }

                                    onChange={() =>
                                        setViewMode(
                                            "reports"
                                        )
                                    }
                                />

                                <span>
                                    {mobileLayout
                                        ? "Reports"
                                        : "Weather Reports"}
                                </span>

                            </label>


                            {/* WEATHER EVENTS */}

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    cursor: "pointer",
                                    flexShrink: 0
                                }}
                            >

                                <input
                                    type="radio"

                                    checked={
                                        viewMode ===
                                        "events"
                                    }

                                    onChange={() =>
                                        setViewMode(
                                            "events"
                                        )
                                    }
                                />

                                <span>
                                    {mobileLayout
                                        ? "Events"
                                        : "Weather Events"}
                                </span>

                            </label>


                            {/* LEADERBOARD */}

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    cursor: "pointer",
                                    flexShrink: 0
                                }}
                            >

                                <input
                                    type="radio"

                                    checked={
                                        viewMode ===
                                        "leaderboard"
                                    }

                                    onChange={() =>
                                        setViewMode(
                                            "leaderboard"
                                        )
                                    }
                                />

                                <span>
                                    Leaderboard
                                </span>

                            </label>


                            {/* ==================================
                                TABLET / MOBILE CONTROLS
                            ================================== */}

                            {compactLayout &&
                                viewMode !==
                                    "leaderboard" && (

                                <Box
                                    sx={{
                                        ml: "auto",

                                        display: "flex",
                                        alignItems: "center",

                                        gap: 0.5,

                                        flexShrink: 0
                                    }}
                                >

                                    <Button
                                        size="small"

                                        startIcon={
                                            <FilterAltOutlinedIcon />
                                        }

                                        onClick={() =>
                                            setFiltersOpen(
                                                true
                                            )
                                        }

                                        sx={{
                                            minWidth: {
                                                xs: 36,
                                                sm: "auto"
                                            },

                                            px: {
                                                xs: 0.5,
                                                sm: 1
                                            }
                                        }}
                                    >

                                        {!mobileLayout &&
                                            "Filters"}

                                    </Button>


                                    <Button
                                        size="small"

                                        startIcon={
                                            <InsightsOutlinedIcon />
                                        }

                                        onClick={() =>
                                            setSummaryOpen(
                                                true
                                            )
                                        }

                                        sx={{
                                            minWidth: {
                                                xs: 36,
                                                sm: "auto"
                                            },

                                            px: {
                                                xs: 0.5,
                                                sm: 1
                                            }
                                        }}
                                    >

                                        {!mobileLayout &&
                                            "Summary"}

                                    </Button>

                                </Box>

                            )}

                        </Box>


                        {/* ======================================
                            LEADERBOARD MODE
                        ====================================== */}

                        {viewMode === "leaderboard" ? (

                            <Box
                                sx={{
                                    flex: 1,

                                    minHeight: 0,

                                    overflow: "hidden"
                                }}
                            >

                                <Leaderboard />

                            </Box>

                        ) : (

                            /* ==================================
                                MAP MODES
                            ================================== */

                            <Box
                                sx={{
                                    flex: 1,

                                    minHeight: 0,

                                    display: "flex",
                                    flexDirection:
                                        "column",

                                    overflow: "hidden"
                                }}
                            >

                                {/* MAP */}

                                <Box
                                    sx={{
                                        flex: 1,

                                        minHeight: 0,

                                        overflow:
                                            "hidden"
                                    }}
                                >

                                    <MapView
					observations={observations}

                                        viewMode={
                                            viewMode
                                        }

                                        timeWindow={
                                            timeWindow
                                        }

                                        selectedEvents={
                                            selectedEvents
                                        }

                                        selectedSources={
                                            selectedSources
                                        }

                                    />

                                </Box>


                                {/* TIMELINE */}

                                <Box
                                    sx={{
                                        flexShrink: 0,

                                        height: {
                                            xs: 70,
                                            sm: 80,
                                            lg: 90
                                        },

                                        minHeight: {
                                            xs: 70,
                                            sm: 80,
                                            lg: 90
                                        },

                                        overflow:
                                            "hidden",

                                        borderTop:
                                            "1px solid #ddd"
                                    }}
                                >

                                    <Timeline
					observations={observations}

                                        selectedEvents={
                                            selectedEvents
                                        }

                                        selectedSources={
                                            selectedSources
                                        }
                                    />

                                </Box>

                            </Box>

                        )}

                    </Box>


                    {/* ==========================================
                        DESKTOP RIGHT CONTEXT PANEL
                    ========================================== */}

                    {!compactLayout && (

                        <Box
                            sx={{
                                width: 320,
                                minWidth: 320,
                                maxWidth: 320,

                                height: "100%",

                                flexShrink: 0,
                                minHeight: 0,

                                overflow: "hidden",

                                borderLeft:
                                    "1px solid #ddd",

                                boxSizing:
                                    "border-box"
                            }}
                        >

                            {contextContent}

                        </Box>

                    )}

                </Box>

            )}


            {/* ==================================================
                TABLET / MOBILE FILTER DRAWER
            ================================================== */}

            <Drawer
                anchor="left"

                open={
                    compactLayout &&
                    filtersOpen
                }

                onClose={() =>
                    setFiltersOpen(false)
                }

                ModalProps={{
                    keepMounted: true
                }}

                PaperProps={{
                    sx: {
                        width: 290,
                        maxWidth: "88vw",

                        overflow: "hidden"
                    }
                }}
            >

                {sidebarContent}

            </Drawer>


            {/* ==================================================
                TABLET / MOBILE SUMMARY DRAWER
            ================================================== */}

            <Drawer
                anchor="right"

                open={
                    compactLayout &&
                    summaryOpen
                }

                onClose={() =>
                    setSummaryOpen(false)
                }

                ModalProps={{
                    keepMounted: true
                }}

                PaperProps={{
                    sx: {
                        width: 320,
                        maxWidth: "92vw",

                        overflow: "hidden"
                    }
                }}
            >

                {contextContent}

            </Drawer>

        </Box>

    );

}
