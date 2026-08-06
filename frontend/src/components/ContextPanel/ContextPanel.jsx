import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider
} from "@mui/material";

import ObservationService from "../../services/observationService";

export default function ContextPanel() {

    const [observations, setObservations] = useState([]);

    useEffect(() => {

        ObservationService
            .getAllReports()
            .then(setObservations);

    }, []);

    // --------------------------
    // Build State Statistics
    // --------------------------

    const stateCounts = {};

const districtCounts = {};

observations.forEach(report => {

    const district = report.district || "Unknown";

    districtCounts[district] =
        (districtCounts[district] || 0) + 1;

});

    observations.forEach(report => {

        const state = report.state || "Unknown";

        stateCounts[state] =
            (stateCounts[state] || 0) + 1;

    });

    const topStates =
        Object.entries(stateCounts)
            .sort((a, b) => b[1] - a[1]);

const topDistricts =
    Object.entries(districtCounts)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);

    return (

        <Box
            sx={{
                width: 320,
                bgcolor: "#f5f5f5",
                p: 2,
                overflowY: "auto"
            }}
        >

            <Card>

                <CardContent>

                    <Typography variant="h6">

                        India Summary

                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography>

                        Total Reports : {observations.length}

                    </Typography>

                    <Typography>

                        States Reporting : {topStates.length}

                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                    >

                        Top States

                    </Typography>

                    {topStates.map(([state, count]) => (

                        <Box
                            key={state}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1
                            }}
                        >

                            <Typography>

                                {state}

                            </Typography>

                            <Typography fontWeight="bold">

                                {count}

                            </Typography>

                        </Box>

                    ))}

<Divider sx={{ my: 2 }} />

<Typography
    variant="subtitle1"
    sx={{ fontWeight: "bold" }}
>

    Top Districts

</Typography>

{topDistricts.map(([district, count]) => (

    <Box
        key={district}
        sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1
        }}
    >

        <Typography>

            {district}

        </Typography>

        <Typography fontWeight="bold">

            {count}

        </Typography>

    </Box>

))}

                </CardContent>

            </Card>

        </Box>

    );

}
