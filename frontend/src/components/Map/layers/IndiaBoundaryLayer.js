export function addIndiaBoundaryLayer(map) {

    const sourceId = "india-boundary";

    const lineLayerId =
        "india-boundary-line";


    // --------------------------------------------------
    // SOURCE
    // --------------------------------------------------

    if (!map.getSource(sourceId)) {

        map.addSource(
            sourceId,
            {
                type: "geojson",

                data:
                    "/data/indiaboundary.geojson",
            }
        );

    }


    // --------------------------------------------------
    // BOUNDARY LINE
    // --------------------------------------------------

    if (!map.getLayer(lineLayerId)) {

        map.addLayer(
            {
                id: lineLayerId,

                type: "line",

                source: sourceId,

                paint: {

"line-color":
    "#111111",

"line-width": [
    "interpolate",
    ["linear"],
    ["zoom"],

    4,
    2.0,

    6,
    2.5,

    8,
    3.0,

    10,
    3.5
],

"line-opacity":
    0.95,

                },
            }
        );

    }

}
