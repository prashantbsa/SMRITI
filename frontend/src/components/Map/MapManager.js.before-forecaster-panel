import EventService from "../../services/EventService";

import {
    addIndiaBoundaryLayer
} from "./layers/IndiaBoundaryLayer";

import {
    reportsToGeoJSON
} from "../../services/geoJsonService";

import {
    eventsToGeoJSON
} from "../../services/eventGeoJsonService";

import {
    addReportLayer
} from "./layers/ReportLayer";

import {
    addEventLayer,
    hideEvidenceLegend
} from "./layers/EventLayer";

export async function initializeLayers(
    map,
    viewMode,
    timeWindow,
    selectedEvents,
    selectedSources,
    observations = []
) {

    // --------------------------------------------------
    // INDIA BOUNDARY
    // --------------------------------------------------

    addIndiaBoundaryLayer(map);


    // ==================================================
    // WEATHER REPORTS MODE
    // ==================================================

    if (viewMode === "reports") {
        hideEvidenceLegend(map);
        let reports =
            observations;


        // --------------------------------------------------
        // SOURCE FILTER
        // --------------------------------------------------

        if (
            selectedSources &&
            selectedSources.length > 0
        ) {

            reports = reports.filter(
                report =>
                    selectedSources.includes(
                        report.source
                    )
            );

        }
        else {

            reports = [];

        }


        console.log(
            "Reports before time filter:",
            reports.length
        );


        // --------------------------------------------------
        // TIME FILTER
        // --------------------------------------------------

        const now = new Date();

        reports = reports.filter(
            report => {

                const rawTime =
                    report.observation_time ||
                    report.time ||
                    report.created_at ||
                    report.timestamp;


                if (!rawTime) {

                    return false;

                }


                const t = new Date(

                    typeof rawTime === "string"

                        ? rawTime.replace(
                            " ",
                            "T"
                        )

                        : rawTime
                );


                if (
                    Number.isNaN(
                        t.getTime()
                    )
                ) {

                    return false;

                }


                const diff =
                    (
                        now.getTime() -
                        t.getTime()
                    )
                    /
                    (
                        1000 *
                        60 *
                        60
                    );


                switch (
                    timeWindow
                ) {

                    case "30m":
                        return diff <= 0.5;

                    case "1h":
                        return diff <= 1;

                    case "3h":
                        return diff <= 3;

                    case "6h":
                        return diff <= 6;

                    case "24h":
                        return diff <= 24;

                    case "7d":
                        return diff <= 24 * 7;

                    case "30d":
                        return diff <= 24 * 30;

                    case "1y":
                        return diff <= 24 * 365;

                    default:
                        return true;

                }

            }
        );


        console.log(
            "Reports after time filter:",
            reports.length
        );


        // --------------------------------------------------
        // PHENOMENON FILTER
        // --------------------------------------------------

        if (
            selectedEvents &&
            selectedEvents.length > 0
        ) {

            reports = reports.filter(
                report => {

                    const rawEvent = (

                        report.event_code ||
                        report.event_name ||
                        report.phenomenon ||
                        ""

                    )
                    .trim()
                    .toUpperCase();


                    const reportEvents =
                        rawEvent
                            .split(",")
                            .map(
                                event =>
                                    event
                                        .trim()
                                        .replace(
                                            "/",
                                            "_"
                                        )
                            );


                    return reportEvents.some(
                        event =>
                            selectedEvents.includes(
                                event
                            )
                    );

                }
            );

        }
        else {

            reports = [];

        }


        console.log(
            "Reports after event filter:",
            reports.length
        );


        // --------------------------------------------------
        // DRAW REPORTS
        // --------------------------------------------------

        addReportLayer(

            map,

            reportsToGeoJSON(
                reports
            )

        );


        return;

    }


    // ==================================================
    // WEATHER EVENTS MODE
    // ==================================================

    if (viewMode === "events") {

        let events =
            await EventService.getAllEvents();


        console.log(
            "Weather events from backend:",
            events.length
        );


        // --------------------------------------------------
        // TIME FILTER
        // --------------------------------------------------

        const now = new Date();

        events = events.filter(
            event => {

                const rawTime =
                    event.start_time;


                if (!rawTime) {

                    return false;

                }


                const t =
                    new Date(
                        rawTime
                    );


                if (
                    Number.isNaN(
                        t.getTime()
                    )
                ) {

                    return false;

                }


                const diff =
                    (
                        now.getTime() -
                        t.getTime()
                    )
                    /
                    (
                        1000 *
                        60 *
                        60
                    );


                switch (
                    timeWindow
                ) {

                    case "30m":
                        return diff <= 0.5;

                    case "1h":
                        return diff <= 1;

                    case "3h":
                        return diff <= 3;

                    case "6h":
                        return diff <= 6;

                    case "24h":
                        return diff <= 24;

                    case "7d":
                        return diff <= 24 * 7;

                    case "30d":
                        return diff <= 24 * 30;

                    case "1y":
                        return diff <= 24 * 365;

                    default:
                        return true;

                }

            }
        );


        // --------------------------------------------------
        // PHENOMENON FILTER
        // --------------------------------------------------

        if (
            selectedEvents &&
            selectedEvents.length > 0
        ) {

            events = events.filter(
                event => {

                    const weatherType = (
                        event.weather_type ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                    return selectedEvents.includes(
                        weatherType
                    );

                }
            );

        }
        else {

            events = [];

        }


        console.log(
            "Weather events after filtering:",
            events.length
        );


        // --------------------------------------------------
        // CONVERT TO GEOJSON
        // --------------------------------------------------

        const geoJson =
            eventsToGeoJSON(
                events
            );


        // --------------------------------------------------
        // DRAW EVENTS
        // --------------------------------------------------

        addEventLayer(

            map,

            geoJson

        );


        return;

    }

}
