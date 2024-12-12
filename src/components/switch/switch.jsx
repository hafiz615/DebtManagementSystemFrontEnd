import * as React from "react";
import Switch from "@mui/material/Switch";

export default function ControlledSwitch({ checked, setChecked }) {
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
}
