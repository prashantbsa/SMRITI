import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";

import ObservationService from "../../services/observationService";

export default function ContextPanel() {

  const observations = ObservationService.getAllReports();

  return (

    <Box
      sx={{
        width: 320,
        bgcolor: "#f5f5f5",
        p: 2,
        overflowY: "auto",
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

        </CardContent>

      </Card>

    </Box>

  );

}
