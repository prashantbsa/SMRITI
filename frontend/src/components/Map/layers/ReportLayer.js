export function addReportLayer(map, geojson) {

    console.log("=== Report Layer ===");
    console.log(geojson);

    if (map.getSource("reports")) {
        console.log("Source already exists");
        return;
    }

    map.addSource("reports", {
        type: "geojson",
        data: geojson
    });

    console.log("Source Added");

    map.addLayer({
        id: "reports-circle",
        type: "circle",
        source: "reports",
        paint: {
            "circle-radius": 10,
            "circle-color": "#ff0000",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
        }
    });

    console.log("Layer Added");

    console.log(map.getStyle().layers);
}
