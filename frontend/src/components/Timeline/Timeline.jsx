import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import ObservationService from "../../services/observationService";
import TimelineService from "../../services/TimelineService";

export default function Timeline() {

    const [timeline, setTimeline] = useState([]);

    useEffect(() => {

        async function loadTimeline() {

            const reports =
                await ObservationService.getAllReports();

            const data =
                TimelineService.buildTimeline(reports);

            setTimeline(data);
        }

        loadTimeline();

    }, []);

return (

<Box
    sx={{
        height: 90,
        bgcolor: "#0D47A1",
        color: "white",
        display: "flex",
        alignItems: "flex-end",
        overflowX: "auto",
        px: 2,
        gap: 2
    }}
>

{timeline.map(item => (

<Box
    key={item.date}
    sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 50
    }}
>

<Box
    sx={{
        width: 22,
        height: item.count * 4,
        bgcolor: "#4FC3F7",
        borderRadius: 1
    }}
/>

<Typography
    variant="caption"
    sx={{
        mt: 1,
        color: "#BBDEFB",
        fontSize: 10
    }}
>
{item.date.substring(5)}
</Typography>

<Typography
    variant="caption"
    sx={{ fontSize: 10 }}
>
{item.count}
</Typography>

</Box>

))}

</Box>

);
}
