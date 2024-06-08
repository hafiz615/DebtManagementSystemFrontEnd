import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

function SpinnerWithPercentage({ value, color }) {
  const smallScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );
  const extraLargeScreen = useMediaQuery("(min-width:1800px)");

  const size = extraSmallScreen
    ? "6rem"
    : smallScreen
    ? "8rem"
    : extraLargeScreen
    ? "13rem"
    : "11vw";

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <CircularProgress
        size={size}
        variant="determinate"
        value={100}
        sx={{
          color: "#e0e0e0",
        }}
        thickness={2}
      />
      <CircularProgress
        size={size}
        variant="determinate"
        value={value}
        sx={{
          color: color,
          position: "absolute",
          left: 0,
        }}
        thickness={2}
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
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{ fontSize: "26px", fontWeight: "600", fontFamily: "Nunito" }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default SpinnerWithPercentage;
