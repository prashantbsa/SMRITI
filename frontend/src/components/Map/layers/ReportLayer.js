import { showReportPopup } from "../popups/ReportPopup";

export function addReportLayer(map, geojson) {

    console.log("=== addReportLayer ===");

    console.log("Existing source:", map.getSource("reports"));

    map.addSource("reports", {
        type: "geojson",
        data: geojson
    });

    console.log("Source added");

    map.addLayer({
        id: "reports-circle",
        type: "circle",
        source: "reports",
paint: {

    "circle-radius": 8,

    "circle-color": [

        "match",

        ["get", "event_name"],

        "RAIN", "#1E88E5",

        "DRIZZLE", "#4FC3F7",

        "THUNDER_LIGHTNING", "#8E24AA",

        "HAILSTORM", "#FB8C00",

        "GUSTY_WIND", "#43A047",

        "HOT_WEATHER", "#E53935",

        "HOT_HUMID", "#8D6E63",

        "FOG", "#90A4AE",

        "SNOW", "#FFFFFF",

        "#E53935"

    ],

    "circle-stroke-width": 2,

    "circle-stroke-color": "#FFFFFF"

}
    });

    console.log("Layer added");

    console.log("Layer exists:", map.getLayer("reports-circle"));

    map.on("click", "reports-circle", (e) => {

        console.log("Circle clicked", e);

        if (!e.features || e.features.length === 0)
            return;

        showReportPopup(map, e.features[0]);

    });

}
