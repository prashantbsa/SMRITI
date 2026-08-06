export function reportsToGeoJSON(reports) {
console.log("Reports received:", reports);
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

    event_name: report.event_name,

    source: report.source || "Crowdsourced",

    reported_by: report.reported_by,

    observation_time: report.time,

    verification_status: report.verification_status,

    confidence_score: report.confidence_score,

    remarks: report.remarks || ""

}

        }))

    };

}
