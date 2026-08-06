export function buildStatistics(reports) {

    const stateCounts = {};
    const eventCounts = {};

    reports.forEach(report => {

        // ---------- State statistics ----------
        const state = report.state || "Unknown";

        stateCounts[state] =
            (stateCounts[state] || 0) + 1;

        // ---------- Weather event statistics ----------
        report.event_name
            .split(",")
            .forEach(event => {

                const e = event.trim();

                eventCounts[e] =
                    (eventCounts[e] || 0) + 1;

            });

    });

    return {

        totalReports: reports.length,

        totalStates: Object.keys(stateCounts).length,

        states:
            Object.entries(stateCounts)
                .sort((a,b)=>b[1]-a[1]),

        events:
            Object.entries(eventCounts)
                .sort((a,b)=>b[1]-a[1])

    };

}
