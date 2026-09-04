export function reportsToGeoJSON(reports){

    return{

        type:"FeatureCollection",

        features:reports.map(report=>({

            type:"Feature",

            geometry:{

                type:"Point",

                coordinates:[
                    report.longitude,
                    report.latitude
                ]

            },

properties: {

    report_id: report.report_id,

    event_name: report.event_name,

    event_code: report.event_code,

    reported_by: report.reported_by,

    source: report.source,

    observation_time: report.time,

    remarks: report.remarks,

    state: report.state,

    district: report.district,

    verification_status: report.verification_status,

    confidence_score: report.confidence_score

}


        }))

    };

}
