import { Popup } from "maplibre-gl";

const LEGEND_ID =
    "smriti-evidence-strength-legend";


// --------------------------------------------------
// EVIDENCE LABEL
// --------------------------------------------------

function getEvidenceLabel(
    strength
) {

    const value =
        Number(strength) || 0;

    if (value >= 100) {
        return "Very Strong";
    }

    if (value >= 80) {
        return "Strong";
    }

    if (value >= 60) {
        return "Moderate";
    }

    if (value >= 40) {
        return "Low";
    }

    return "Limited";
}


// --------------------------------------------------
// FORMAT NOWCAST TIME
// --------------------------------------------------

function formatNowcastTime(
    value
) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC"
        }
    );

}


// --------------------------------------------------
// FORMAT DATE
// --------------------------------------------------

function formatNowcastDate(
    value
) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC"
        }
    );

}


// --------------------------------------------------
// POPUP CONTENT
// --------------------------------------------------

function buildPopupContent(
    properties
) {

    const container =
        document.createElement(
            "div"
        );

    container.style.minWidth =
        "235px";

    container.style.fontFamily =
        "Arial, sans-serif";

    container.style.fontSize =
        "13px";


    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    const title =
        document.createElement(
            "div"
        );

    title.textContent =
        (
            properties.weather_type ||
            properties.event_name ||
            "Weather Event"
        )
        .replaceAll(
            "_",
            " "
        );

    title.style.fontWeight =
        "700";

    title.style.fontSize =
        "15px";

    title.style.marginBottom =
        "8px";

    container.appendChild(
        title
    );


    // --------------------------------------------------
    // ROW HELPER
    // --------------------------------------------------

    function addRow(
        label,
        value
    ) {

        const row =
            document.createElement(
                "div"
            );

        row.style.marginBottom =
            "4px";


        const labelElement =
            document.createElement(
                "strong"
            );

        labelElement.textContent =
            `${label}: `;


        const valueElement =
            document.createElement(
                "span"
            );

        valueElement.textContent =
            value ?? "—";


        row.appendChild(
            labelElement
        );

        row.appendChild(
            valueElement
        );

        container.appendChild(
            row
        );

    }


    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    addRow(
        "State",
        properties.state || "—"
    );

    addRow(
        "District",
        properties.district || "—"
    );


    // --------------------------------------------------
    // NOWCAST PERIOD
    // --------------------------------------------------

    const startTime =
        formatNowcastTime(
            properties.start_time
        );

    const endTime =
        formatNowcastTime(
            properties.end_time
        );


    addRow(
        "Nowcast Date",
        formatNowcastDate(
            properties.start_time
        )
    );

    addRow(
        "Nowcast Period",
        `${startTime}–${endTime}`
    );


    // --------------------------------------------------
    // SUPPORTING OBSERVATIONS
    // --------------------------------------------------

    addRow(
        "Supporting Observations",
        properties.observation_count ?? 0
    );


    // --------------------------------------------------
    // EVIDENCE STRENGTH
    // --------------------------------------------------

    const strength =
        Number(
            properties.evidence_strength
        ) || 0;


    addRow(
        "Evidence Strength",
        `${strength} / 100`
    );

    addRow(
        "Evidence Level",
        getEvidenceLabel(
            strength
        )
    );


    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    addRow(
        "Status",
        properties.status || "active"
    );


    // --------------------------------------------------
    // EXPLANATION
    // --------------------------------------------------

    const divider =
        document.createElement(
            "div"
        );

    divider.style.borderTop =
        "1px solid #dddddd";

    divider.style.margin =
        "8px 0";

    container.appendChild(
        divider
    );


    const note =
        document.createElement(
            "div"
        );

    note.textContent =
        "Evidence Strength reflects independent supporting contributors. It does not mean that the event has been manually verified.";

    note.style.fontSize =
        "11px";

    note.style.color =
        "#666666";

    note.style.lineHeight =
        "1.35";

    container.appendChild(
        note
    );


    return container;
}


// --------------------------------------------------
// EVIDENCE LEGEND
// --------------------------------------------------

function addEvidenceLegend(
    map
) {

    const mapContainer =
        map.getContainer();


    const existing =
        mapContainer.querySelector(
            `#${LEGEND_ID}`
        );


    if (existing) {

        existing.style.display =
            "block";

        return;

    }


    const legend =
        document.createElement(
            "div"
        );

    legend.id =
        LEGEND_ID;


    Object.assign(
        legend.style,
        {

            position:
                "absolute",

            right:
                "10px",

            bottom:
                "28px",

            zIndex:
                "15",

            background:
                "rgba(255,255,255,0.96)",

            padding:
                "9px 11px",

            borderRadius:
                "4px",

            boxShadow:
                "0 1px 5px rgba(0,0,0,0.25)",

            fontFamily:
                "Arial, sans-serif",

            fontSize:
                "11px",

            lineHeight:
                "20px"

        }
    );


    // --------------------------------------------------
    // LEGEND TITLE
    // --------------------------------------------------

    const heading =
        document.createElement(
            "div"
        );

    heading.textContent =
        "Evidence Strength";

    heading.style.fontWeight =
        "700";

    heading.style.marginBottom =
        "5px";

    legend.appendChild(
        heading
    );


    // --------------------------------------------------
    // LEVELS
    // --------------------------------------------------

    const levels = [

        {
            strength: 20,
            label: "Limited",
            color: "#9E9E9E"
        },

        {
            strength: 40,
            label: "Low",
            color: "#42A5F5"
        },

        {
            strength: 60,
            label: "Moderate",
            color: "#FBC02D"
        },

        {
            strength: 80,
            label: "Strong",
            color: "#F57C00"
        },

        {
            strength: 100,
            label: "Very Strong",
            color: "#D32F2F"
        }

    ];


    levels.forEach(
        level => {

            const row =
                document.createElement(
                    "div"
                );

            row.style.display =
                "flex";

            row.style.alignItems =
                "center";

            row.style.gap =
                "7px";


            const marker =
                document.createElement(
                    "span"
                );


            Object.assign(
                marker.style,
                {

                    width:
                        "15px",

                    height:
                        "15px",

                    borderRadius:
                        "50%",

                    background:
                        level.color,

                    border:
                        "2px solid white",

                    boxShadow:
                        "0 0 0 1px #555",

                    boxSizing:
                        "border-box",

                    display:
                        "inline-block",

                    flexShrink:
                        "0"

                }
            );


            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                `${level.strength} — ${level.label}`;


            row.appendChild(
                marker
            );

            row.appendChild(
                text
            );

            legend.appendChild(
                row
            );

        }
    );


    mapContainer.appendChild(
        legend
    );

}


// --------------------------------------------------
// HIDE EVIDENCE LEGEND
// --------------------------------------------------

export function hideEvidenceLegend(
    map
) {

    if (!map) {
        return;
    }


    const legend =
        map
            .getContainer()
            .querySelector(
                `#${LEGEND_ID}`
            );


    if (legend) {

        legend.style.display =
            "none";

    }

}


// --------------------------------------------------
// ADD EVENT LAYER
// --------------------------------------------------

export function addEventLayer(
    map,
    geojson
) {

    // --------------------------------------------------
    // REMOVE REPORT SYMBOL
    // --------------------------------------------------

    if (
        map.getLayer(
            "reports-symbol"
        )
    ) {

        map.removeLayer(
            "reports-symbol"
        );

    }


    // --------------------------------------------------
    // REMOVE OLD REPORT CIRCLE
    // --------------------------------------------------

    if (
        map.getLayer(
            "reports-circle"
        )
    ) {

        map.removeLayer(
            "reports-circle"
        );

    }


    // --------------------------------------------------
    // REMOVE REPORT SOURCE
    // --------------------------------------------------

    if (
        map.getSource(
            "reports"
        )
    ) {

        map.removeSource(
            "reports"
        );

    }


    // --------------------------------------------------
    // UPDATE EXISTING EVENT SOURCE
    // --------------------------------------------------

    if (
        map.getSource(
            "events"
        )
    ) {

        map
            .getSource(
                "events"
            )
            .setData(
                geojson
            );


        addEvidenceLegend(
            map
        );

        return;

    }


    // --------------------------------------------------
    // EVENT SOURCE
    // --------------------------------------------------

    map.addSource(
        "events",
        {

            type:
                "geojson",

            data:
                geojson

        }
    );


    // --------------------------------------------------
    // CONFIDENCE / EVIDENCE CIRCLE
    // --------------------------------------------------

    map.addLayer({

        id:
            "events-evidence-circle",

        type:
            "circle",

        source:
            "events",

        paint: {

            /*
             * Fixed halo size.
             *
             * Evidence Strength is represented
             * primarily by colour rather than
             * geographical size.
             */

            "circle-radius":
                15,


            /*
             * Confidence colour.
             */

            "circle-color": [

                "step",

                [
                    "coalesce",
                    [
                        "get",
                        "evidence_strength"
                    ],
                    20
                ],

                "#9E9E9E",

                40,
                "#42A5F5",

                60,
                "#FBC02D",

                80,
                "#F57C00",

                100,
                "#D32F2F"

            ],


            "circle-opacity":
                0.88,


            /*
             * White inner boundary helps
             * weather icons remain readable.
             */

            "circle-stroke-width":
                2,

            "circle-stroke-color":
                "#ffffff"

        }

    });


    // --------------------------------------------------
    // WEATHER EVENT ICON
    // --------------------------------------------------

    map.addLayer({

        id:
            "events-symbol",

        type:
            "symbol",

        source:
            "events",

        layout: {

            "icon-image": [

                "match",

                [
                    "get",
                    "weather_type"
                ],

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
             * Use the same weather-icon sizing
             * as the Weather Reports layer.
             */
            "icon-size": [
                "match",
                ["get", "weather_type"],

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

            "icon-allow-overlap":
                true,

            "icon-ignore-placement":
                true

        }

    });


    // --------------------------------------------------
    // LEGEND
    // --------------------------------------------------

    addEvidenceLegend(
        map
    );


    // --------------------------------------------------
    // CLICK POPUP
    // --------------------------------------------------

    if (
        !map.__smritiEventHandlersRegistered
    ) {

        map.__smritiEventHandlersRegistered =
            true;


        map.on(
            "click",
            "events-symbol",
            (e) => {

                if (
                    !e.features?.length
                ) {

                    return;

                }


                const properties =
                    e.features[0]
                        .properties;


                new Popup({

                    closeButton:
                        true,

                    closeOnClick:
                        true

                })

                    .setLngLat(
                        e.lngLat
                    )

                    .setDOMContent(
                        buildPopupContent(
                            properties
                        )
                    )

                    .addTo(
                        map
                    );

            }
        );


        // --------------------------------------------------
        // HALO IS ALSO CLICKABLE
        // --------------------------------------------------

        map.on(
            "click",
            "events-evidence-circle",
            (e) => {

                if (
                    !e.features?.length
                ) {

                    return;

                }


                const properties =
                    e.features[0]
                        .properties;


                new Popup({

                    closeButton:
                        true,

                    closeOnClick:
                        true

                })

                    .setLngLat(
                        e.lngLat
                    )

                    .setDOMContent(
                        buildPopupContent(
                            properties
                        )
                    )

                    .addTo(
                        map
                    );

            }
        );


        // --------------------------------------------------
        // POINTER
        // --------------------------------------------------

        map.on(
            "mouseenter",
            "events-symbol",
            () => {

                map.getCanvas()
                    .style.cursor =
                    "pointer";

            }
        );


        map.on(
            "mouseleave",
            "events-symbol",
            () => {

                map.getCanvas()
                    .style.cursor =
                    "";

            }
        );


        map.on(
            "mouseenter",
            "events-evidence-circle",
            () => {

                map.getCanvas()
                    .style.cursor =
                    "pointer";

            }
        );


        map.on(
            "mouseleave",
            "events-evidence-circle",
            () => {

                map.getCanvas()
                    .style.cursor =
                    "";

            }
        );

    }

}
