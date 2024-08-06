import { Box, Typography } from "@mui/material";

function GuideCalendar() {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          height: "20%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          pt: 2,
          pb: 2,
        }}
      >
        <Typography variant="h2">Calendar</Typography>
      </Box>
    </Box>
  );
}


export default GuideCalendar;
