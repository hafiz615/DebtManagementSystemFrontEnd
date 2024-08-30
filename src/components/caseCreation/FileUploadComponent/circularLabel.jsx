import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Colors } from "../../../config/default";

export default function CircularProgressWithLabel(props) {
  const { value, size, labelSize, color, backgroundColor, loading } = props;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        width: size,
        height: size,
        backgroundColor: backgroundColor || "transparent",
        borderRadius: "50%",
      }}
    >
      <CircularProgress
        variant={loading && value < 100 ? "determinate" : "indeterminate"}
        value={loading && value < 100 ? value : 100}
        size={size}
        sx={{
          color: color || Colors.SKY_BLUE,
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
          {loading && value < 100 ? `${Math.round(value)}%` : "100%"}
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
