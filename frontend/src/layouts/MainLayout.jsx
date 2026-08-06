import { Box } from "@mui/material";
import { useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MapView from "../components/Map/MapView";
import ContextPanel from "../components/ContextPanel/ContextPanel";
import Timeline from "../components/Timeline/Timeline";

export default function MainLayout() {

    const [viewMode, setViewMode] = useState("reports");
const [timeWindow, setTimeWindow] = useState("all");

    return (

        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

            <Header />

            <Box sx={{ flex: 1, display: "flex" }}>

<Sidebar
    timeWindow={timeWindow}
    setTimeWindow={setTimeWindow}
/>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

                    <div
                        style={{
                            padding: "10px",
                            background: "#fff",
                            borderBottom: "1px solid #ddd"
                        }}
                    >

                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                checked={viewMode === "reports"}
                                onChange={() => setViewMode("reports")}
                            />
                            Weather Reports
                        </label>

                        <label>
                            <input
                                type="radio"
                                checked={viewMode === "events"}
                                onChange={() => setViewMode("events")}
                            />
                            Weather Events
                        </label>

                    </div>

<MapView
    viewMode={viewMode}
    timeWindow={timeWindow}
/>

                </Box>

<ContextPanel
    timeWindow={timeWindow}
/>

            </Box>

            <Timeline />

        </Box>

    );

}
