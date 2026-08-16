import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";

export default function Header() {
    return (

        <AppBar position="static" elevation={2}>

            <Toolbar
                sx={{
                    position: "relative",
                    justifyContent: "center",
                }}
            >

                {/* Centered SMRITI title */}

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        textAlign: "center",
                    }}
                >
                    SMRITI (Smart Meteorological Reporting &amp; Information Tracking Initiative)
                </Typography>


                {/* LIVE indicator */}

                <Box
                    sx={{
                        position: "absolute",
                        right: 16,
                    }}
                >

                    <Chip
                        label="LIVE"
                        color="success"
                        size="small"
                    />

                </Box>

            </Toolbar>

        </AppBar>

    );
}
