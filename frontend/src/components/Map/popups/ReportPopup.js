import { Popup } from "maplibre-gl";

export function showReportPopup(map, feature) {

    const p = feature.properties;

    new Popup()

        .setLngLat(feature.geometry.coordinates)

        .setHTML(`

            <b>${p.event_type}</b>

            <hr>

            <b>Report ID</b> : ${p.report_id}<br>

            <b>Source</b> : ${p.source_application}<br>

            <b>Reported By</b> : ${p.reported_by}<br>

            <b>Confidence</b> : ${p.confidence_score}%<br>

            <b>Status</b> : ${p.verification_status}<br>

            <b>Time</b> : ${p.observation_time}

        `)

        .addTo(map);

}
