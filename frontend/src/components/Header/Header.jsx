import {
    AppBar,
    Box,
    Button,
    Chip,
    Toolbar,
    Typography
} from "@mui/material";


export default function Header({
    currentUser,
    onUserManagement,
    onLogout
}) {

    const isAdmin =
        currentUser?.role === "ADMIN";


    return (

        <AppBar
            position="static"
            elevation={2}
        >

            <Toolbar
                sx={{
                    position: "relative",
                    justifyContent: "center",
                    minHeight: 64
                }}
            >

                {/* LOGGED-IN USER */}

                <Box
                    sx={{
                        position: "absolute",
                        left: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600
                        }}
                    >
                        {currentUser?.name}
                    </Typography>


                    {isAdmin && (

                        <Chip
                            label="ADMIN"
                            size="small"
                            sx={{
                                backgroundColor:
                                    "rgba(255,255,255,0.18)",
                                color: "inherit"
                            }}
                        />

                    )}

                </Box>


                {/* CENTERED SMRITI TITLE */}

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        textAlign: "center"
                    }}
                >
                    SMRITI (Smart Meteorological Reporting
                    &amp; Information Tracking Initiative)
                </Typography>


                {/* RIGHT CONTROLS */}

                <Box
                    sx={{
                        position: "absolute",
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    {isAdmin && (

                        <Button
                            size="small"
                            variant="outlined"
                            onClick={
                                onUserManagement
                            }
                            sx={{
                                color: "inherit",
                                borderColor:
                                    "rgba(255,255,255,0.7)",
                                "&:hover": {
                                    borderColor:
                                        "#ffffff"
                                }
                            }}
                        >
                            Users
                        </Button>

                    )}


                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onLogout}
                        sx={{
                            color: "inherit",
                            borderColor:
                                "rgba(255,255,255,0.7)",
                            "&:hover": {
                                borderColor:
                                    "#ffffff"
                            }
                        }}
                    >
                        Logout
                    </Button>


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
