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

    event_code: report.event_code,

    event_name: report.event_name,

    source: report.source,

    reported_by: report.reported_by,

    observation_time: report.time,

    verification_status: report.verification_status,

    confidence_score: report.confidence_score

}


        }))

    };

}
