import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Colors } from "../config/default";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Checkboxes({
  checked,
  handleCheckChange,
  fontSize,
  disabled,
}) {
  return (
    <div>
      <Checkbox
        {...label}
        size="small"
        checked={checked}
        onChange={handleCheckChange}
        disabled={disabled}
        sx={{
          "& .MuiSvgIcon-root": { fontSize: fontSize },
          color: Colors.DIM_LIGHT_GRAY,

          "&.Mui-checked": {
            color: Colors.SKY_BLUE, // Change this to the color you want for checked state
          },
        }}
      />
    </div>
  );
}
