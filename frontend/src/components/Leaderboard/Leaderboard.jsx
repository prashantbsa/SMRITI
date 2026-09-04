import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    CircularProgress,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import LeaderboardService
    from "../../services/leaderboardService";


export default function Leaderboard() {

    const [data, setData] = useState({
        top_reporters: [],
        regular_contributors: [],
        criteria: null,
    });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // --------------------------------------------------
    // LOAD LEADERBOARD
    // --------------------------------------------------

    useEffect(() => {

        async function loadLeaderboard() {

            try {

                setLoading(true);
                setError(null);

                const result =
                    await LeaderboardService
                        .getLeaderboard(50);

                setData({
                    top_reporters:
                        result.top_reporters || [],

                    regular_contributors:
                        result.regular_contributors || [],

                    criteria:
                        result.criteria || null,
                });

            }
            catch (err) {

                console.error(
                    "Unable to load leaderboard:",
                    err
                );

                setError(
                    "Unable to load leaderboard."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadLeaderboard();

    }, []);


    // --------------------------------------------------
    // LEADERBOARD LIST
    // --------------------------------------------------

    function LeaderboardList({
        title,
        subtitle,
        rows,
    }) {

        return (

            <Card
                sx={{
                    flex: "1 1 0",
                    minWidth: 0,

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",
                }}
            >

                <CardContent
                    sx={{
                        flex: 1,
                        minHeight: 0,

                        display: "flex",
                        flexDirection: "column",

                        p: 2,

                        "&:last-child": {
                            pb: 2,
                        },
                    }}
                >

                    {/* TITLE */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        {title}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                        }}
                    >
                        {subtitle}
                    </Typography>


                    <Divider sx={{ mb: 1 }} />


                    {/* ------------------------------------------
                        COLUMN HEADINGS
                    ------------------------------------------ */}

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns:
                                "52px minmax(150px, 1fr) 110px 95px 70px",

                            gap: 1,

                            alignItems: "center",

                            px: 1,
                            py: 1,

                            bgcolor: "#f5f5f5",

                            borderRadius: 1,

                            flexShrink: 0,
                        }}
                    >

                        <Typography
                            variant="caption"
                            fontWeight="bold"
                        >
                            S. No.
                        </Typography>


                        <Typography
                            variant="caption"
                            fontWeight="bold"
                        >
                            Name
                        </Typography>


                        <Typography
                            variant="caption"
                            fontWeight="bold"
                        >
                            Mobile Number
                        </Typography>


                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            Observations
                        </Typography>


                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            Points
                        </Typography>

                    </Box>


                    {/* ------------------------------------------
                        SCROLLABLE ROWS
                    ------------------------------------------ */}

                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,

                            overflowY: "auto",
                            overflowX: "hidden",

                            mt: 0.5,
                        }}
                    >

                        {rows.map(row => (

                            <Box
                                key={
                                    `${row.rank}-${row.mobile}`
                                }
                                sx={{
                                    display: "grid",

                                    gridTemplateColumns:
                                        "52px minmax(150px, 1fr) 110px 95px 70px",

                                    gap: 1,

                                    alignItems: "center",

                                    px: 1,
                                    py: 0.9,

                                    borderBottom:
                                        "1px solid #eeeeee",
                                }}
                            >

                                {/* S. NO. */}

                                <Typography
                                    fontWeight={
                                        row.rank <= 3
                                            ? 700
                                            : 400
                                    }
                                >
                                    {row.rank}
                                </Typography>


                                {/* NAME */}

                                <Typography
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                    title={row.name}
                                >
                                    {row.name}
                                </Typography>


                                {/* MOBILE */}

                                <Typography
                                    sx={{
                                        fontFamily:
                                            "monospace",

                                        whiteSpace:
                                            "nowrap",

                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {row.mobile}
                                </Typography>


                                {/* OBSERVATIONS */}

                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: 600,
                                    }}
                                >
                                    {row.observations ?? 0}
                                </Typography>


                                {/* POINTS */}

                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: 700,
                                    }}
                                >
                                    {row.points ?? 0}
                                </Typography>

                            </Box>

                        ))}


                        {rows.length === 0 && (

                            <Typography
                                color="text.secondary"
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                }}
                            >
                                No contributors available.
                            </Typography>

                        )}

                    </Box>

                </CardContent>

            </Card>

        );

    }


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (

            <Box
                sx={{
                    height: "100%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // --------------------------------------------------
    // ERROR
    // --------------------------------------------------

    if (error) {

        return (

            <Box
                sx={{
                    height: "100%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <Typography color="error">
                    {error}
                </Typography>

            </Box>

        );

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <Box
            sx={{
                height: "100%",
                minHeight: 0,

                display: "flex",
                flexDirection: "column",

                bgcolor: "#f5f5f5",

                p: 2,
                gap: 1.5,

                boxSizing: "border-box",

                overflow: "hidden",
            }}
        >

            {/* ==================================================
                TITLE
            ================================================== */}

            <Box
                sx={{
                    flexShrink: 0,
                    textAlign: "center",
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Contributor Leaderboard
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Recognising active and regular
                    contributors to SMRITI
                </Typography>

            </Box>


            {/* ==================================================
                TWO LEADERBOARDS
            ================================================== */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,

                    display: "flex",

                    gap: 1.5,

                    overflow: "hidden",
                }}
            >

                <LeaderboardList
                    title="Top Reporters"
                    subtitle={
                        "Contributors with the highest number of weather observations"
                    }
                    rows={
                        data.top_reporters
                    }
                />


                <LeaderboardList
                    title="Regular Contributors"
                    subtitle={
                        "Contributors reporting regularly across IMD nowcast periods"
                    }
                    rows={
                        data.regular_contributors
                    }
                />

            </Box>


            {/* ==================================================
                HOW POINTS ARE EARNED
            ================================================== */}

            <Card
                sx={{
                    flexShrink: 0,
                }}
            >

                <CardContent
                    sx={{
                        py: 1.25,

                        "&:last-child": {
                            pb: 1.25,
                        },
                    }}
                >

                    <Typography
                        fontWeight="bold"
                        sx={{
                            mb: 0.5,
                        }}
                    >
                        How points are earned
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Every valid weather observation
                        earns 1 point. A contributor earns
                        1 additional freshness point when
                        reporting in a new 3-hour IMD
                        nowcast period. These periods begin
                        at 00:00, 03:00, 06:00, 09:00,
                        12:00, 15:00, 18:00 and 21:00
                        hours. Multiple observations may
                        still be useful, but the freshness
                        bonus is awarded only once to a
                        contributor in each nowcast period.
                    </Typography>

                </CardContent>

            </Card>

        </Box>

    );

}
