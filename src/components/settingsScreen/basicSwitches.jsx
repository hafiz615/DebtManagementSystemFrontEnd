import React from "react";
import Switch from "@mui/material/Switch";

export default function BasicSwitches({ checked, onChange, key }) {
  return (
    <Switch
      checked={checked}
      // onChange={() => onChange(key)}
      onChange={onChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
}
