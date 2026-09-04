class MausamService {

    async getReports(fromDate, toDate) {

        const allRecords = [];

        let page = 1;
        let totalPages = 1;

        do {

            const url =
                `https://api.imd.gov.in/api/mausamapp_crowdsource_api.php` +
                `?from_date=${fromDate}` +
                `&to_date=${toDate}` +
                `&page=${page}`;

            console.log("Fetching Mausam:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Mausam API failed: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.status) {
                throw new Error(
                    result.message || "Mausam API returned an error"
                );
            }

            totalPages = result.total_pages || 1;

            allRecords.push(...(result.data || []));

            page++;

        } while (page <= totalPages);

        console.log(
            "Total Mausam records:",
            allRecords.length
        );

        return allRecords

            // Do not put invalid coordinates on the map
            .filter(item =>
                Number(item.latitude) !== 0 &&
                Number(item.longitude) !== 0
            )

            .flatMap(item => {

                const weatherEvents =
                    item.weather_events || [];

                if (weatherEvents.length === 0) {

                    return [{
                        report_id: item.id,

                        latitude: Number(item.latitude),
                        longitude: Number(item.longitude),

                        state: item.state,
                        district: item.district,

                        event_code: "UNKNOWN",
                        event_name: "UNKNOWN",

                        source: "MAUSAM",

                        reported_by: String(item.user_id),

                        time: item.created_at,

                        verification_status:
                            item.status === 1
                                ? "VERIFIED"
                                : "UNVERIFIED",

                        confidence_score: "N/A",

                        remarks: item.about_observation || ""
                    }];

                }

                return weatherEvents.map(event => ({

                    report_id: item.id,

                    latitude: Number(item.latitude),
                    longitude: Number(item.longitude),

                    state: item.state,
                    district: item.district,

                    event_code:
                        String(event.name || "UNKNOWN")
                            .trim()
                            .toUpperCase()
                            .replace(/\s+/g, "_"),

                    event_name:
                        String(event.name || "UNKNOWN")
                            .trim()
                            .toUpperCase()
                            .replace(/\s+/g, "_"),

                    source: "MAUSAM",

                    reported_by: String(item.user_id),

                    time: item.created_at,

                    verification_status:
                        item.status === 1
                            ? "VERIFIED"
                            : "UNVERIFIED",

                    confidence_score: "N/A",

                    remarks: item.about_observation || ""

                }));

            });

    }

}

export default new MausamService();
