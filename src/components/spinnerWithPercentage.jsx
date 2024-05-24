import * as React from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

function SpinnerWithPercentage({ value, color }) {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1200px)");
  const extraLargeScreen = useMediaQuery("(min-width:1800px)");

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        size={smallScreen ? "16vw" : extraLargeScreen ? "13rem" : "11vw"}
        variant="determinate"
        value={value}
        sx={{ color: color }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
export default SpinnerWithPercentage;
