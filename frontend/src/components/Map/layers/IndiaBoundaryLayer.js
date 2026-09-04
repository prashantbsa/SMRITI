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
                        "#202020",

                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],

                        4,
                        1.5,

                        7,
                        2.5,

                        10,
                        3
                    ],

                    "line-opacity":
                        0.9,
                },
            }
        );

    }

}
