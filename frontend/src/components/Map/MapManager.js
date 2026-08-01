import ObservationService from "../../services/observationService";
import { reportsToGeoJSON } from "../../services/geoJsonService";
import { addReportLayer } from "./layers/ReportLayer";

export function initializeLayers(map) {

    console.log("=== initializeLayers ===");

    const reports = ObservationService.getAllReports();

    console.log("Reports:", reports);

    const geojson = reportsToGeoJSON(reports);

    console.log("GeoJSON:", geojson);

    addReportLayer(map, geojson);

    console.log("ReportLayer finished");

}
