import ObservationService from "../../services/observationService";
import EventService from "../../services/EventService";

import { reportsToGeoJSON } from "../../services/geoJsonService";
import { eventsToGeoJSON } from "../../services/eventGeoJsonService";

import { addReportLayer } from "./layers/ReportLayer";
import { addEventLayer } from "./layers/EventLayer";

export async function initializeLayers(map, viewMode, timeWindow) {

    console.log("Loading observations...");
    console.log("Current view:", viewMode);
    console.log("Time Window:", timeWindow);

    let reports = await ObservationService.getAllReports();

    const now = new Date();

    reports = reports.filter(report => {

        const t = new Date(report.time);

        const diffHours = (now - t) / (1000 * 60 * 60);

        switch (timeWindow) {

            case "30m":
                return diffHours <= 0.5;

            case "1h":
                return diffHours <= 1;

            case "3h":
                return diffHours <= 3;

            case "6h":
                return diffHours <= 6;

            case "24h":
                return diffHours <= 24;

            case "7d":
                return diffHours <= 24 * 7;

            case "30d":
                return diffHours <= 24 * 30;

            case "year":
                return diffHours <= 24 * 365;

            default:
                return true;

        }

    });

    console.log("Reports after filtering:", reports.length);

    if (viewMode === "reports") {

        const geojson = reportsToGeoJSON(reports);

        addReportLayer(map, geojson);

    } else {

        const events = EventService.buildEvents(reports);

        const geojson = eventsToGeoJSON(events);

        addEventLayer(map, geojson);

    }

}
