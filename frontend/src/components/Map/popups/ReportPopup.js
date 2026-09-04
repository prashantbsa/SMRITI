import { Popup } from "maplibre-gl";

export function showReportPopup(map, feature) {

   console.log("Clicked feature:", feature);
    console.log("Feature properties:", feature.properties);


    const p = feature.properties;

const html = `
<div style="min-width:280px">

<h3>${p.event_name ?? "Unknown Event"}</h3>

<hr>

<table style="width:100%;font-size:13px">

<tr><td><b>Report ID</b></td><td>${p.report_id}</td></tr>

<tr>
    <td><b>Report ID</b></td>
    <td>${p.report_id ?? "-"}</td>
</tr>

<tr>
    <td><b>Source</b></td>
    <td><b>${p.source ?? "-"}</b></td>
</tr>

<tr>
    <td><b>Reported By</b></td>
    <td>${p.reported_by ?? "-"}</td>
</tr>

<tr><td><b>Reported By</b></td><td>${p.reported_by ?? "-"}</td></tr>

<tr><td><b>State</b></td><td>${p.state ?? "-"}</td></tr>

<tr><td><b>District</b></td><td>${p.district ?? "-"}</td></tr>

<tr><td><b>Observation</b></td><td>${p.observation_time ?? "-"}</td></tr>

<tr><td><b>Status</b></td><td>${p.verification_status}</td></tr>

<tr><td><b>Confidence</b></td><td>${p.confidence_score ?? "N/A"}</td></tr>

<tr><td><b>Remarks</b></td><td>${p.remarks || "-"}</td></tr>

</table>

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
