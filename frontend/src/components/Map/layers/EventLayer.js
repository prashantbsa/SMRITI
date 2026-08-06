import { Popup } from "maplibre-gl";

export function addEventLayer(map, geojson) {

    console.log("=== addEventLayer ===");

    map.addSource("events", {

        type: "geojson",

        data: geojson

    });

    map.addLayer({

        id: "events-circle",

        type: "circle",

        source: "events",

        paint: {

            "circle-radius": 14,

            "circle-color": "#1565C0",

            "circle-stroke-width": 3,

            "circle-stroke-color": "#FFFFFF"

        }

    });

    map.on("click", "events-circle", (e) => {

        if (!e.features || e.features.length === 0)
            return;

        const p = e.features[0].properties;

        new Popup()

            .setLngLat(e.features[0].geometry.coordinates)

            .setHTML(`
                <b>${p.event_name}</b><br><br>
                Reports: ${p.report_count}
            `)

            .addTo(map);

    });

    console.log("Event layer added");

}
