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
            "circle-color": "#E53935",
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
