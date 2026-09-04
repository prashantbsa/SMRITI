import { Box } from "@mui/material";
import { useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MapView from "../components/Map/MapView";
import ContextPanel from "../components/ContextPanel/ContextPanel";
import Timeline from "../components/Timeline/Timeline";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import UserManagement from "../components/Admin/UserManagement";

export default function MainLayout({
    currentUser,
    onLogout
}) {
    const [viewMode, setViewMode] = useState("reports");

    const [adminView, setAdminView] = useState(false);

    const [timeWindow, setTimeWindow] = useState("1y");

    const [selectedSources, setSelectedSources] = useState([
        "MEGHDOOT",
        "MAUSAM"
    ]);

    const [selectedEvents, setSelectedEvents] = useState([
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


    return (

        <Box
            sx={{
                height: "100vh",
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

                {/* ==================================================
                    LEFT SIDEBAR
                ================================================== */}

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

                        borderRight: "1px solid #ddd",

                        boxSizing: "border-box"
                    }}
                >

                    <Sidebar
                        timeWindow={timeWindow}
                        setTimeWindow={setTimeWindow}

                        selectedEvents={selectedEvents}
                        setSelectedEvents={setSelectedEvents}

                        selectedSources={selectedSources}
                        setSelectedSources={setSelectedSources}
                    />

                </Box>


                {/* ==================================================
                    CENTER AREA
                ================================================== */}

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

                    {/* ==============================================
                        TOP VIEW SELECTOR
                    ============================================== */}

                    <Box
                        sx={{
                            flexShrink: 0,

                            height: 48,

                            display: "flex",
                            alignItems: "center",

                            px: 2,

                            backgroundColor: "#ffffff",

                            borderBottom: "1px solid #ddd",

                            gap: 3,

                            boxSizing: "border-box"
                        }}
                    >

                        {/* WEATHER REPORTS */}

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >

                            <input
                                type="radio"
                                checked={
                                    viewMode === "reports"
                                }
                                onChange={() =>
                                    setViewMode("reports")
                                }
                            />

                            <span>
                                Weather Reports
                            </span>

                        </label>


                        {/* WEATHER EVENTS */}

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >

                            <input
                                type="radio"
                                checked={
                                    viewMode === "events"
                                }
                                onChange={() =>
                                    setViewMode("events")
                                }
                            />

                            <span>
                                Weather Events
                            </span>

                        </label>


                        {/* LEADERBOARD */}

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >

                            <input
                                type="radio"
                                checked={
                                    viewMode === "leaderboard"
                                }
                                onChange={() =>
                                    setViewMode("leaderboard")
                                }
                            />

                            <span>
                                Leaderboard
                            </span>

                        </label>

                    </Box>


                    {/* ==================================================
                        LEADERBOARD MODE
                    ================================================== */}

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

                        /* ==================================================
                            MAP MODES
                        ================================================== */

                        <Box
                            sx={{
                                flex: 1,

                                minHeight: 0,

                                display: "flex",
                                flexDirection: "column",

                                overflow: "hidden"
                            }}
                        >

                            {/* MAP */}

                            <Box
                                sx={{
                                    flex: 1,

                                    minHeight: 0,

                                    overflow: "hidden"
                                }}
                            >

                                <MapView
                                    viewMode={viewMode}
                                    timeWindow={timeWindow}
                                    selectedEvents={selectedEvents}
                                    selectedSources={selectedSources}
                                />

                            </Box>


                            {/* TIMELINE */}

                            <Box
                                sx={{
                                    flexShrink: 0,

                                    height: 90,
                                    minHeight: 90,

                                    overflow: "hidden",

                                    borderTop:
                                        "1px solid #ddd"
                                }}
                            >

                                <Timeline
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


                {/* ==================================================
                    RIGHT CONTEXT PANEL
                ================================================== */}

                <Box
                    sx={{
                        width: 320,
                        minWidth: 320,
                        maxWidth: 320,

                        height: "100%",

                        flexShrink: 0,
                        minHeight: 0,

                        overflow: "hidden",

                        borderLeft: "1px solid #ddd",

                        boxSizing: "border-box"
                    }}
                >

                    <ContextPanel
                        timeWindow={timeWindow}
                        selectedEvents={selectedEvents}
                        selectedSources={selectedSources}
                    />

                </Box>

            </Box>

)}

        </Box>

    );

}
