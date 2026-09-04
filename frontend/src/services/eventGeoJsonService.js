export function eventsToGeoJSON(events) {

    return {

        type: "FeatureCollection",

        features: events
            .filter(event =>
                event.latitude !== null &&
                event.longitude !== null
            )
            .map(event => ({

                type: "Feature",

                geometry: {

                    type: "Point",

                    coordinates: [
                        event.longitude,
                        event.latitude
                    ]

                },

                properties: {

                    id:
                        event.id,

                    event_name:
                        event.weather_type,

                    weather_type:
                        event.weather_type,

                    state:
                        event.state || "",

                    district:
                        event.district || "",

                    start_time:
                        event.start_time,

                    end_time:
                        event.end_time,

                    evidence_strength:
                        event.evidence_strength ?? 0,

                    observation_count:
                        event.observation_count ?? 0,

                    status:
                        event.status || "active"

                }

            }))

    };

}
