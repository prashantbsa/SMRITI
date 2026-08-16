import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import ObservationService from "../../services/observationService";


export default function Timeline({
    selectedEvents,
    selectedSources,
}) {

    const [reports, setReports] = useState([]);


    // --------------------------------------------------
    // LOAD OBSERVATIONS
    // --------------------------------------------------

    useEffect(() => {

        async function loadReports() {

            try {

                const data =
                    await ObservationService.getAllReports();

                setReports(data || []);

            } catch (error) {

                console.error(
                    "Unable to load observations for timeline:",
                    error
                );

                setReports([]);

            }

        }

        loadReports();

    }, []);


    // --------------------------------------------------
    // BUILD 24 HOURLY COUNTS FOR TODAY
    // --------------------------------------------------

    const hourlyCounts = useMemo(() => {

        const hours = Array.from(
            { length: 24 },
            (_, hour) => ({
                hour,
                count: 0,
            })
        );


        const now = new Date();


        const todayYear =
            now.getFullYear();

        const todayMonth =
            now.getMonth();

        const todayDate =
            now.getDate();


        reports.forEach(report => {

            if (!report.observation_time && !report.time) {
                return;
            }


            const observationDate =
                new Date(
                    report.observation_time ||
                    report.time
                );


            if (Number.isNaN(
                observationDate.getTime()
            )) {
                return;
            }


            // ------------------------------------------
            // CURRENT DATE ONLY
            // ------------------------------------------

            if (
                observationDate.getFullYear() !== todayYear ||
                observationDate.getMonth() !== todayMonth ||
                observationDate.getDate() !== todayDate
            ) {
                return;
            }


            // ------------------------------------------
            // SOURCE FILTER
            // ------------------------------------------

            if (
                selectedSources &&
                selectedSources.length > 0 &&
                !selectedSources.includes(
                    report.source
                )
            ) {
                return;
            }


            // ------------------------------------------
            // EVENT FILTER
            // ------------------------------------------

            if (
                selectedEvents &&
                selectedEvents.length > 0
            ) {

                const event = (
                    report.event_code ||
                    report.event_name ||
                    ""
                )
                    .trim()
                    .toUpperCase();


                if (
                    !selectedEvents.includes(event)
                ) {
                    return;
                }

            }


            // ------------------------------------------
            // ROUND DOWN TO HOUR
            // ------------------------------------------

            const hour =
                observationDate.getHours();


            hours[hour].count += 1;

        });


        return hours;

    }, [
        reports,
        selectedEvents,
        selectedSources,
    ]);


    // --------------------------------------------------
    // MAX VALUE FOR BAR HEIGHT
    // --------------------------------------------------

    const maxCount =
        Math.max(
            ...hourlyCounts.map(
                item => item.count
            ),
            1
        );


    // --------------------------------------------------
    // CURRENT HOUR
    // --------------------------------------------------

    const currentHour =
        new Date().getHours();


    // --------------------------------------------------
    // FORMAT HOUR
    // --------------------------------------------------

    function formatHour(hour) {

        if (hour === 0) {
            return "00";
        }

        return String(hour).padStart(2, "0");

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <Box
            sx={{
                height: "100%",
                width: "100%",

                bgcolor: "#ffffff",

                borderTop:
                    "1px solid #ddd",

                display: "flex",
                flexDirection: "column",

                boxSizing: "border-box",

                overflow: "hidden",

                px: 1,
                py: 0.5,
            }}
        >

            {/* ==========================================
                TITLE
            ========================================== */}

            <Box
                sx={{
                    height: 20,
                    flexShrink: 0,

                    display: "flex",
                    alignItems: "center",

                    px: 1,
                }}
            >

                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#555",
                    }}
                >
                    Today's Observations — Hourly
                </Typography>

            </Box>


            {/* ==========================================
                24 HOUR CHART
            ========================================== */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,

                    display: "flex",
                    alignItems: "stretch",

                    gap: 0.5,

                    overflow: "hidden",

                    px: 1,
                }}
            >

                {hourlyCounts.map(item => {

                    const barHeight =
                        item.count === 0
                            ? 2
                            : Math.max(
                                4,
                                (
                                    item.count /
                                    maxCount
                                ) * 42
                            );


                    const isCurrentHour =
                        item.hour === currentHour;


                    return (

                        <Box
                            key={item.hour}
                            sx={{
                                flex: 1,
                                minWidth: 0,

                                display: "flex",
                                flexDirection: "column",

                                alignItems: "center",

                                justifyContent:
                                    "flex-end",
                            }}
                        >

                            {/* COUNT */}

                            <Typography
                                sx={{
                                    fontSize: 9,
                                    lineHeight: 1,

                                    color:
                                        item.count > 0
                                            ? "#333"
                                            : "#aaa",

                                    mb: 0.3,
                                }}
                            >
                                {item.count}
                            </Typography>


                            {/* BAR */}

                            <Box
                                sx={{
                                    width: "65%",
                                    maxWidth: 22,
                                    minWidth: 6,

                                    height: barHeight,

                                    bgcolor:
                                        isCurrentHour
                                            ? "#1976D2"
                                            : "#64B5F6",

                                    borderRadius:
                                        "3px 3px 0 0",

                                    transition:
                                        "height 0.2s ease",
                                }}
                            />


                            {/* HOUR */}

                            <Typography
                                sx={{
                                    fontSize: 8,
                                    lineHeight: 1,

                                    mt: 0.4,

                                    color:
                                        isCurrentHour
                                            ? "#1976D2"
                                            : "#777",

                                    fontWeight:
                                        isCurrentHour
                                            ? 700
                                            : 400,
                                }}
                            >
                                {formatHour(item.hour)}
                            </Typography>

                        </Box>

                    );

                })}

            </Box>


            {/* ==========================================
                TIME LABEL
            ========================================== */}

            <Box
                sx={{
                    height: 13,
                    flexShrink: 0,

                    display: "flex",
                    justifyContent: "space-between",

                    px: 1,
                }}
            >

                <Typography
                    sx={{
                        fontSize: 8,
                        color: "#999",
                    }}
                >
                    00:00
                </Typography>


                <Typography
                    sx={{
                        fontSize: 8,
                        color: "#999",
                    }}
                >
                    12:00
                </Typography>


                <Typography
                    sx={{
                        fontSize: 8,
                        color: "#999",
                    }}
                >
                    23:00
                </Typography>

            </Box>

        </Box>

    );

}
