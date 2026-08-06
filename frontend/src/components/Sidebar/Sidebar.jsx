import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaceIcon from "@mui/icons-material/Place";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Sidebar({
    timeWindow,
    setTimeWindow
}) {
    return (

<Box
sx={{
width:220,
bgcolor:"#fff",
borderRight:"1px solid #ddd"
}}
>

<Typography sx={{p:2,fontWeight:"bold"}}>
Navigation
</Typography>

<List>

<ListItemButton selected>
<ListItemIcon><DashboardIcon/></ListItemIcon>
<ListItemText primary="Dashboard"/>
</ListItemButton>

<ListItemButton>
<ListItemIcon><PlaceIcon/></ListItemIcon>
<ListItemText primary="Observations"/>
</ListItemButton>

<ListItemButton>
<ListItemIcon><BarChartIcon/></ListItemIcon>
<ListItemText primary="Analytics"/>
</ListItemButton>

<ListItemButton>
<ListItemIcon><SettingsIcon/></ListItemIcon>
<ListItemText primary="Settings"/>
</ListItemButton>

</List>

<Divider sx={{ mt: 2, mb: 2 }} />

<Typography
    variant="subtitle2"
    sx={{
        px: 2,
        mb: 1,
        color: "text.secondary",
        fontWeight: 600
    }}
>
    FILTERS
</Typography>

<FormControl
    fullWidth
    size="small"
    sx={{ px: 2 }}
>

    <InputLabel>

        Time Window

    </InputLabel>

    <Select

        value={timeWindow}

        label="Time Window"

        onChange={(e) =>
            setTimeWindow(e.target.value)
        }

    >

        <MenuItem value="30m">
            Last 30 Minutes
        </MenuItem>

        <MenuItem value="1h">
            Last 1 Hour
        </MenuItem>

        <MenuItem value="3h">
            Last 3 Hours
        </MenuItem>

        <MenuItem value="6h">
            Last 6 Hours
        </MenuItem>

        <MenuItem value="24h">
            Last 24 Hours
        </MenuItem>

        <MenuItem value="7d">
            Last 7 Days
        </MenuItem>

        <MenuItem value="30d">
            Last 30 Days
        </MenuItem>

        <MenuItem value="year">
            This Year
        </MenuItem>

        <MenuItem value="all">
            All Data
        </MenuItem>

    </Select>

</FormControl>
</Box>

    );

}
