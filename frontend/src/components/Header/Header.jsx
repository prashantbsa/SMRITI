import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
        >
          🌦 SMRITI
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Chip
          label="LIVE"
          color="success"
          size="small"
        />

      </Toolbar>
    </AppBar>
  );
}
