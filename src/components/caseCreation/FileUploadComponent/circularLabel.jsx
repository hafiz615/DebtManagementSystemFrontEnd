import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Colors } from "../../../config/default";

function CircularProgressWithLabel(props) {
  const { value, size, labelSize, color, backgroundColor } = props;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        width: size,
        height: size,
        backgroundColor: backgroundColor || "transparent", // Set background color
        borderRadius: "50%",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        sx={{
          color: color || Colors.SKY_BLUE, // Set inside color
          position: "absolute",
          left: 0,
          top: 0,
        }}
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
          sx={{ color: "text.secondary", fontSize: labelSize }}
        >
          {value < 99 ? `${Math.round(value)}%` : "Loading..."}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number,
  labelSize: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
};

CircularProgressWithLabel.defaultProps = {
  size: 40,
  labelSize: "1rem",
  color: Colors.SKY_BLUE,
  backgroundColor: "transparent",
};

export default function CircularWithValueLabel({ progress, setProgress }) {
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 99 ? 99 : prevProgress + 2
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, [setProgress]);

  return (
    <CircularProgressWithLabel
      value={progress}
      size={140}
      labelSize="1.5rem"
      color={Colors.SKY_BLUE} // Customize color here
      backgroundColor="#f5f5f5" // Customize background color here
    />
  );
}
