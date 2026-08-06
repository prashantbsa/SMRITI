export function eventsToGeoJSON(events) {

    return {

        type: "FeatureCollection",

        features: events.map(event => ({

            type: "Feature",

            geometry: {

                type: "Point",

                coordinates: [

                    event.longitude,

                    event.latitude

                ]

            },

            properties: {

                event_name: event.event_name,

                report_count: event.reports.length

            }

        }))

    };

}
