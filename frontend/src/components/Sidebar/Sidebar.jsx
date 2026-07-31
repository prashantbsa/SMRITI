import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaceIcon from "@mui/icons-material/Place";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 220,
        bgcolor: "#ffffff",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          p: 2,
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        NAVIGATION
      </Typography>

      <List>

        <ListItemButton selected>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Observations" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

      </List>
    </Box>
  );
}
