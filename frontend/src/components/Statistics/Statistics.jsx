
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";
import * as echarts from "echarts";
import StatisticsService from "../../services/statisticsService";

const REPORTING_START_YEAR = 2026;

const SOURCE_OPTIONS = [
    { value: "ALL", label: "All Sources" },
    { value: "MAUSAM", label: "MAUSAM" },
    { value: "MEGHDOOT", label: "MEGHDOOT" }
];

function makeCountMap(rows = []) {
    return new Map(
        rows.map((row) => [row.period, Number(row.count) || 0])
    );
}

function formatDailyLabel(period) {
    const date = new Date(`${period}T00:00:00+05:30`);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: "Asia/Kolkata"
    });
}

function fillDailyRows(rows = [], range = {}) {
    const counts = makeCountMap(rows);
    const result = [];

    if (!range.start || !range.end) {
        return result;
    }

    const startDate =
        range.start < `${REPORTING_START_YEAR}-01-01`
            ? `${REPORTING_START_YEAR}-01-01`
            : range.start;

    const date = new Date(`${startDate}T00:00:00+05:30`);
    const end = new Date(`${range.end}T00:00:00+05:30`);

    while (date <= end) {
        const period = date.toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        result.push({
            period,
            label: formatDailyLabel(period),
            count: counts.get(period) ?? 0
        });

        date.setUTCDate(date.getUTCDate() + 1);
    }

    return result;
}

function fillMonthlyRows(rows = [], range = {}) {
    const counts = makeCountMap(rows);
    const result = [];

    if (!range.start || !range.end) {
        return result;
    }

    let [startYear, startMonth] = range.start.split("-").map(Number);
    const [endYear, endMonth] = range.end.split("-").map(Number);

    if (startYear < REPORTING_START_YEAR) {
        startYear = REPORTING_START_YEAR;
        startMonth = 1;
    }

    let year = startYear;
    let month = startMonth;

    while (
        year < endYear ||
        (year === endYear && month <= endMonth)
    ) {
        const period = `${year}-${String(month).padStart(2, "0")}`;

        result.push({
            period,
            label: new Date(`${period}-01T00:00:00+05:30`)
                .toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                    timeZone: "Asia/Kolkata"
                }),
            count: counts.get(period) ?? 0
        });

        month += 1;

        if (month > 12) {
            month = 1;
            year += 1;
        }
    }

    return result;
}


function parseQuarter(value) {
    if (typeof value !== "string") {
        return null;
    }

    // Accept quarterly labels such as "2026-Q3".
    const quarterMatch = value.match(/^(\d{4})-Q([1-4])$/);

    if (quarterMatch) {
        return {
            year: Number(quarterMatch[1]),
            quarter: Number(quarterMatch[2]),
        };
    }

    // Also accept dates such as "2026-01-01".
    const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateMatch) {
        const year = Number(dateMatch[1]);
        const month = Number(dateMatch[2]);

        if (month < 1 || month > 12) {
            return null;
        }

        return {
            year,
            quarter: Math.ceil(month / 3),
        };
    }

    return null;
}


function fillQuarterlyRows(rows = [], range = {}) {
    const counts = makeCountMap(rows);
    const result = [];

    let start = parseQuarter(range.start);
    const end = parseQuarter(range.end);

    if (!start || !end) {
        return result;
    }

    if (start.year < REPORTING_START_YEAR) {
        start = {
            year: REPORTING_START_YEAR,
            quarter: 1
        };
    }

    let year = start.year;
    let quarter = start.quarter;

    while (
        year < end.year ||
        (year === end.year && quarter <= end.quarter)
    ) {
        const period = `${year}-Q${quarter}`;

        result.push({
            period,
            label: `Q${quarter} ${year}`,
            count: counts.get(period) ?? 0
        });

        quarter += 1;

        if (quarter > 4) {
            quarter = 1;
            year += 1;
        }
    }

    return result;
}

function fillYearlyRows(rows = [], range = {}) {
    const counts = makeCountMap(rows);
    const result = [];
    const currentYear = new Date().getFullYear();

    const startYear = Math.max(
        REPORTING_START_YEAR,
        Number(range.start) || REPORTING_START_YEAR
    );

    const endYear = Number(range.end) || currentYear;

    for (let year = startYear; year <= endYear; year += 1) {
        const period = String(year);

        result.push({
            period,
            label: period,
            count: counts.get(period) ?? 0
        });
    }

    return result;
}

function StatisticsChart({ title, rows, chartType = "bar" }) {
    const chartId = useMemo(
        () => `statistics-${Math.random().toString(36).slice(2)}`,
        []
    );

    useEffect(() => {
        const element = document.getElementById(chartId);

        if (!element || !rows.length) {
            return undefined;
        }

        const chart = echarts.init(element);

        chart.setOption({
            animation: true,
            grid: {
                left: 55,
                right: 20,
                top: 35,
                bottom: 65,
                containLabel: true
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                }
            },
            xAxis: {
                type: "category",
                data: rows.map((row) => row.label),
                axisLabel: {
                    interval: "auto",
                    rotate: rows.length > 12 ? 35 : 0
                }
            },
            yAxis: {
                type: "value",
                minInterval: 1,
                name: "Observations"
            },
            series: [
                {
                    name: "Observations",
                    type: chartType,
                    data: rows.map((row) => row.count),
                    smooth: chartType === "line",
                    showSymbol: chartType === "line",
                    barMaxWidth: 32,
                    itemStyle: {
                        color: "#1976d2"
                    },
                    areaStyle:
                        chartType === "line"
                            ? { opacity: 0.12 }
                            : undefined
                }
            ]
        });

        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
            chart.dispose();
        };
    }, [chartId, rows, chartType]);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                minWidth: 0,
                height: 350
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>

            {rows.length ? (
                <Box
                    id={chartId}
                    role="img"
                    aria-label={`${title} chart`}
                    sx={{
                        width: "100%",
                        height: 285
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: 285,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Typography color="text.secondary">
                        No observations available for this period.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

export default function Statistics() {
    const [source, setSource] = useState("ALL");
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadStatistics() {
            setLoading(true);
            setError("");

            try {
                const result =
                    await StatisticsService.getStatistics(source);

                if (!cancelled) {
                    setStatistics(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to load statistics."
                    );
                    setStatistics(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadStatistics();

        return () => {
            cancelled = true;
        };
    }, [source]);

    const ranges = statistics?.ranges;

    const dailyRows = useMemo(
        () => fillDailyRows(statistics?.daily, ranges?.daily),
        [statistics, ranges]
    );

    const monthlyRows = useMemo(
        () => fillMonthlyRows(statistics?.monthly, ranges?.monthly),
        [statistics, ranges]
    );

    const quarterlyRows = useMemo(
        () => fillQuarterlyRows(
            statistics?.quarterly,
            ranges?.quarterly
        ),
        [statistics, ranges]
    );

    const yearlyRows = useMemo(
        () => fillYearlyRows(statistics?.yearly, ranges?.yearly),
        [statistics, ranges]
    );

    const total = (rows) =>
        rows.reduce((sum, row) => sum + row.count, 0);

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                p: { xs: 1.5, md: 2 },
                boxSizing: "border-box"
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Weather Observation Statistics
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Daily, monthly, quarterly and yearly totals.
                        Dates and reporting periods use Indian Standard Time.
                    </Typography>
                </Box>

                <FormControl
                    size="small"
                    sx={{ minWidth: 180, flexShrink: 0 }}
                >
                    <InputLabel id="statistics-source-label">
                        Data Source
                    </InputLabel>

                    <Select
                        labelId="statistics-source-label"
                        id="statistics-source"
                        value={source}
                        label="Data Source"
                        onChange={(event) => setSource(event.target.value)}
                    >
                        {SOURCE_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading observation statistics…
                    </Typography>
                </Box>
            ) : statistics ? (
                <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        These charts count weather observations, not
                        separate weather-event categories. Missing
                        periods are displayed as zero.
                    </Alert>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                xl: "repeat(2, minmax(0, 1fr))"
                            },
                            gap: 2,
                            mt: 2,
                            pb: 2
                        }}
                    >
                        <StatisticsChart
                            title="Daily Observations — 2026 to Date"
                            rows={dailyRows}
                            chartType="line"
                        />

                        <StatisticsChart
                            title="Monthly Observations — 2026"
                            rows={monthlyRows}
                        />

                        <StatisticsChart
                            title="Quarterly Observations — 2026"
                            rows={quarterlyRows}
                        />

                        <StatisticsChart
                            title="Yearly Observations"
                            rows={yearlyRows}
                        />
                    </Box>
                </>
            ) : null}
        </Box>
    );
}
