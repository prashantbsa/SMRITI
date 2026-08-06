class TimelineService {

    buildTimeline(reports) {

        const timeline = {};

        reports.forEach(report => {

            const day = report.time.substring(0, 10);

            if (!timeline[day])
                timeline[day] = 0;

            timeline[day]++;

        });

        return Object.entries(timeline)

            .sort((a, b) => a[0].localeCompare(b[0]))

            .map(([date, count]) => ({

                date,

                count

            }));

    }

}

export default new TimelineService();
