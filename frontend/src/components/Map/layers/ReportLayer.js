export function addReportLayer(map, geojson) {

    console.log("=== Report Layer ===");
    console.log(geojson);

    map.addSource("reports", {
        type: "geojson",
        data: geojson
    });

    map.addLayer({
        id: "reports-circle",
        type: "circle",
        source: "reports",
        paint: {
            "circle-radius": 10,
            "circle-color": "#ff0000",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2
        }
    });

    // Force the source to refresh
    map.getSource("reports").setData(geojson);

    console.log("Source:", map.getSource("reports"));
    console.log("Layer:", map.getLayer("reports-circle"));
}
