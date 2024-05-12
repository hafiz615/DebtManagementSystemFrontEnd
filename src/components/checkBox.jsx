import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Colors } from "../config/default";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Checkboxes() {
  const [checked, setChecked] = React.useState(false);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <Checkbox
        {...label}
        checked={checked}
        onChange={handleCheckChange}
        sx={{
          "& .MuiSvgIcon-root": { fontSize: 28 },
          color: Colors.DARK_GRAY,
          "&.Mui-checked": {
            color: Colors.SKY_BLUE, // Change this to the color you want for checked state
          },
        }}
      />
    </div>
  );
}
