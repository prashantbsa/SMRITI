export function reportsToGeoJSON(reports) {

    return {

        type: "FeatureCollection",

        features: reports.map(report => ({

            type: "Feature",

            geometry: {

                type: "Point",

                coordinates: [
                    report.longitude,
                    report.latitude
                ]

            },

            properties: {

                report_id: report.report_id,
                event_type: report.event_type || report.event,
                source_application: report.source_application || report.source,
                reported_by: report.reported_by,
                observation_time: report.observation_time || report.time,
                verification_status: report.verification_status || "UNVERIFIED",
                confidence_score: report.confidence_score ?? 0

            }

        }))

    };

}
