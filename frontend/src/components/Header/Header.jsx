import {
    AppBar,
    Box,
    Button,
    Chip,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";


export default function Header({
    currentUser,
    onUserManagement,
    onLogout
}) {

    const theme = useTheme();

    const isMobile =
        useMediaQuery(
            theme.breakpoints.down("sm")
        );

    const isTablet =
        useMediaQuery(
            theme.breakpoints.between("sm", "lg")
        );

    const isAdmin =
        currentUser?.role === "ADMIN";


    /*
     * ==========================================================
     * MOBILE HEADER
     * ==========================================================
     *
     * Two-row layout prevents the long SMRITI title,
     * username and controls from overlapping.
     */

    if (isMobile) {

        return (

            <AppBar
                position="static"
                elevation={2}
            >

                <Box
                    sx={{
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >

                    {/* ==========================================
                        MOBILE TITLE
                    ========================================== */}

                    <Box
                        sx={{
                            px: 1.5,
                            pt: 1,
                            pb: 0.75,

                            textAlign: "center"
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: "1.05rem",
                                fontWeight: 700,
                                lineHeight: 1.15
                            }}
                        >
                            SMRITI
                        </Typography>


                        <Typography
                            sx={{
                                mt: 0.25,

                                fontSize: "0.68rem",
                                fontWeight: 500,
                                lineHeight: 1.2,

                                opacity: 0.95
                            }}
                        >
                            Smart Meteorological Reporting
                            &amp; Information Tracking
                            Initiative
                        </Typography>

                    </Box>


                    {/* ==========================================
                        MOBILE USER / CONTROLS
                    ========================================== */}

                    <Box
                        sx={{
                            minHeight: 38,

                            px: 1,
                            pb: 0.75,

                            display: "flex",
                            alignItems: "center",

                            gap: 0.5
                        }}
                    >

                        {/* USER */}

                        <Typography
                            variant="caption"
                            noWrap
                            sx={{
                                fontWeight: 600,

                                minWidth: 0,
                                maxWidth: "34vw",

                                overflow: "hidden",
                                textOverflow:
                                    "ellipsis"
                            }}
                        >
                            {currentUser?.name}
                        </Typography>


                        {isAdmin && (

                            <Chip
                                label="ADMIN"
                                size="small"

                                sx={{
                                    height: 22,

                                    fontSize:
                                        "0.62rem",

                                    backgroundColor:
                                        "rgba(255,255,255,0.18)",

                                    color: "inherit",

                                    "& .MuiChip-label":
                                        {
                                            px: 0.75
                                        }
                                }}
                            />

                        )}


                        {/* PUSH CONTROLS RIGHT */}

                        <Box
                            sx={{
                                flex: 1
                            }}
                        />


                        {isAdmin && (

                            <Button
                                size="small"
                                variant="outlined"

                                onClick={
                                    onUserManagement
                                }

                                sx={{
                                    minWidth: 0,

                                    px: 0.75,
                                    py: 0.25,

                                    fontSize:
                                        "0.65rem",

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
                                minWidth: 0,

                                px: 0.75,
                                py: 0.25,

                                fontSize:
                                    "0.65rem",

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

                            sx={{
                                height: 22,

                                fontSize:
                                    "0.62rem",

                                "& .MuiChip-label":
                                    {
                                        px: 0.75
                                    }
                            }}
                        />

                    </Box>

                </Box>

            </AppBar>

        );

    }


    /*
     * ==========================================================
     * TABLET / DESKTOP HEADER
     * ==========================================================
     */

    return (

        <AppBar
            position="static"
            elevation={2}
        >

            <Toolbar
                sx={{
                    position: "relative",

                    justifyContent: "center",

                    minHeight: {
                        sm: 64,
                        lg: 64
                    },

                    px: {
                        sm: 2,
                        lg: 2
                    }
                }}
            >

                {/* ==============================================
                    LOGGED-IN USER
                ============================================== */}

                <Box
                    sx={{
                        position: "absolute",

                        left: {
                            sm: 12,
                            lg: 16
                        },

                        display: "flex",
                        alignItems: "center",

                        gap: {
                            sm: 0.5,
                            lg: 1
                        },

                        maxWidth: {
                            sm: 150,
                            md: 190,
                            lg: 230
                        }
                    }}
                >

                    <Typography
                        variant="body2"
                        noWrap
                        sx={{
                            fontWeight: 600,

                            overflow: "hidden",
                            textOverflow:
                                "ellipsis"
                        }}
                    >
                        {currentUser?.name}
                    </Typography>


                    {isAdmin && (

                        <Chip
                            label="ADMIN"
                            size="small"

                            sx={{
                                display: {
                                    sm: "none",
                                    md: "inline-flex"
                                },

                                backgroundColor:
                                    "rgba(255,255,255,0.18)",

                                color: "inherit"
                            }}
                        />

                    )}

                </Box>


                {/* ==============================================
                    CENTERED SMRITI TITLE
                ============================================== */}

                <Typography
                    sx={{
                        fontWeight: "bold",

                        lineHeight: 1.1,

                        textAlign: "center",

                        fontSize: {
                            sm: "1rem",
                            md: "1.15rem",
                            lg: "1.5rem"
                        },

                        maxWidth: {
                            sm: "46%",
                            md: "52%",
                            lg: "60%"
                        }
                    }}
                >

                    {isTablet
                        ? (
                            <>
                                SMRITI
                                <Box
                                    component="span"
                                    sx={{
                                        display: {
                                            sm: "none",
                                            md: "inline"
                                        }
                                    }}
                                >
                                    {" "}
                                    (Smart Meteorological
                                    Reporting &amp;
                                    Information Tracking
                                    Initiative)
                                </Box>
                            </>
                        )
                        : (
                            <>
                                SMRITI (Smart
                                Meteorological Reporting
                                &amp; Information Tracking
                                Initiative)
                            </>
                        )
                    }

                </Typography>


                {/* ==============================================
                    RIGHT CONTROLS
                ============================================== */}

                <Box
                    sx={{
                        position: "absolute",

                        right: {
                            sm: 12,
                            lg: 16
                        },

                        display: "flex",
                        alignItems: "center",

                        gap: {
                            sm: 0.5,
                            lg: 1
                        }
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

                                fontSize: {
                                    sm: "0.65rem",
                                    lg: "0.8125rem"
                                },

                                px: {
                                    sm: 0.75,
                                    lg: 1.25
                                },

                                minWidth: 0,

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

                            fontSize: {
                                sm: "0.65rem",
                                lg: "0.8125rem"
                            },

                            px: {
                                sm: 0.75,
                                lg: 1.25
                            },

                            minWidth: 0,

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
