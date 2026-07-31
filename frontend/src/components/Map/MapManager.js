import ObservationService from "../../services/observationService";
import { reportsToGeoJSON } from "../../services/geoJsonService";
import { addReportLayer } from "./layers/ReportLayer";

export function initializeLayers(map) {

    console.log("A. initializeLayers");

    const reports = ObservationService.getAllReports();
    console.log("B. Reports:", reports);

    const geojson = reportsToGeoJSON(reports);
    console.log("C. GeoJSON:", geojson);

    addReportLayer(map, geojson);

    console.log("D. Report layer added");
}
