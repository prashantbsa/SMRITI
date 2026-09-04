import { showReportPopup } from "../popups/ReportPopup";


// --------------------------------------------------
// Add Weather Report Layer
// --------------------------------------------------

export function addReportLayer(map, geojson) {

    /*
     * Remove old event circle layer if it exists.
     */

if (
    map.getLayer(
        "events-symbol"
    )
) {

    map.removeLayer(
        "events-symbol"
    );

}


if (
    map.getLayer(
        "events-evidence-circle"
    )
) {

    map.removeLayer(
        "events-evidence-circle"
    );

}


/*
 * Compatibility with older event layer.
 */

if (
    map.getLayer(
        "events-circle"
    )
) {

    map.removeLayer(
        "events-circle"
    );

}

    /*
     * Remove old event source if it exists.
     */

    if (map.getSource("events")) {

        map.removeSource("events");

    }


    /*
     * Update existing reports source.
     */

    if (map.getSource("reports")) {

        map.getSource("reports").setData(geojson);

    }

    else {

        /*
         * Create reports source.
         */

        map.addSource("reports", {

            type: "geojson",

            data: geojson

        });

    }


    /*
     * Debug:
     * Show the event codes actually reaching MapLibre.
     */

    console.log(
        "EVENT CODES GOING TO MAP:",
        geojson.features.map(
            feature =>
                feature.properties?.event_code
        )
    );


    /*
     * Remove existing report layer before
     * recreating it.
     */

    if (map.getLayer("reports-symbol")) {

        map.removeLayer("reports-symbol");

    }


    /*
     * --------------------------------------------------
     * WEATHER ICON LAYER
     * --------------------------------------------------
     */

    map.addLayer({

        id: "reports-symbol",

        type: "symbol",

        source: "reports",

        layout: {

            /*
             * Select icon according to event code.
             */

"icon-image": [

    "match",

    ["get", "event_code"],

    "RAIN",
    "RAIN",

    "DRIZZLE",
    "DRIZZLE",

    "THUNDER",
    "THUNDER",

    "LIGHTNING",
    "LIGHTNING",

    "THUNDER_LIGHTNING",
    "THUNDER_LIGHTNING",

    "HAIL",
    "HAIL",

    "SNOW",
    "SNOW",

    "FOG",
    "FOG",

    "HOT_HUMID",
    "HOT_HUMID",

    "DUST_STORM",
    "DUST_STORM",

    "GUSTY_WIND",
    "GUSTY_WIND",

    "CYCLONE",
    "CYCLONE",

    "DEFAULT_DOT"

],


            /*
             * Size of weather icon.
             */

"icon-size": [

    "match",

    ["get", "event_code"],

    "RAIN", 0.65,

    "DRIZZLE", 0.22,

    "THUNDER", 0.18,

    "LIGHTNING", 0.22,

    "THUNDER_LIGHTNING", 0.18,

    "HAIL", 0.22,

    "SNOW", 0.22,

    "FOG", 0.12,

    "HOT_HUMID", 0.18,

    "DUST_STORM", 0.18,

    "GUSTY_WIND", 0.18,

    "CYCLONE", 0.18,

    "DEFAULT_DOT", 0.65,

    0.18

],


            /*
             * Allow icons to overlap.
             *
             * Important because many observations
             * can occur close to each other.
             */

            "icon-allow-overlap": true,

            "icon-ignore-placement": true

        }

    });


    /*
     * --------------------------------------------------
     * CLICK POPUP
     * --------------------------------------------------
     */

    map.on(
        "click",
        "reports-symbol",
        (e) => {

            if (!e.features?.length) {

                return;

            }


            showReportPopup(
                map,
                e.features[0]
            );

        }
    );


    /*
     * Change cursor when hovering over
     * an observation.
     */

    map.on(
        "mouseenter",
        "reports-symbol",
        () => {

            map.getCanvas().style.cursor =
                "pointer";

        }
    );


    map.on(
        "mouseleave",
        "reports-symbol",
        () => {

            map.getCanvas().style.cursor =
                "";

        }
    );

}
