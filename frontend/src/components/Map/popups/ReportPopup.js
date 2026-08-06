import { Popup } from "maplibre-gl";

export function showReportPopup(map, feature) {

   console.log("Clicked feature:", feature);
    console.log("Feature properties:", feature.properties);


    const p = feature.properties;

const html = `
<div style="min-width:250px">

<h3>${p.event_name}</h3>

<hr>

<b>Report ID</b><br>
${p.report_id}<br><br>

<b>Source</b><br>
${p.source}<br><br>

<b>Reported By</b><br>
${p.reported_by}<br><br>

<b>Observation Time</b><br>
${p.observation_time}<br><br>

<b>Status</b><br>
${p.verification_status}<br><br>

<b>Remarks</b><br>
${p.remarks}<br><br>

</div>
`;

    new Popup({
        closeButton: true,
        closeOnClick: true
    })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(html)
    .addTo(map);
}
