import { Box } from "@mui/material";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MapView from "../components/Map/MapView";
import ContextPanel from "../components/ContextPanel/ContextPanel";
import Timeline from "../components/Timeline/Timeline";

export default function MainLayout() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <Header />

      <Box sx={{ flex: 1, display: "flex" }}>

        <Sidebar />

        <MapView />

        <ContextPanel />

      </Box>

      <Timeline />

    </Box>
  );
}
