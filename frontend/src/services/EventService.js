class EventService {

    buildEvents(reports) {

        const events = {};

        reports.forEach(report => {

            const phenomena = report.event_name.split(",");

            phenomena.forEach(type => {

                const key = type.trim();

                if (!events[key]) {

                    events[key] = {
                        event_name: key,
                        latitude: 0,
                        longitude: 0,
                        report_count: 0,
                        reports: []
                    };

                }

                events[key].reports.push(report);
                events[key].latitude += report.latitude;
                events[key].longitude += report.longitude;
                events[key].report_count++;

            });

        });

        Object.values(events).forEach(event => {

            event.latitude /= event.report_count;
            event.longitude /= event.report_count;

        });

        return Object.values(events);

    }

}

export default new EventService();
