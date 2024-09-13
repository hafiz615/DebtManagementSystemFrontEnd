import React from "react";
import Switch from "@mui/material/Switch";
import { Colors } from "../../config/default";

export default function BasicSwitches({
  checked,
  onChange,
  key,
  disableToggleButtons,
}) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      inputProps={{ "aria-label": "controlled" }}
      disabled={disableToggleButtons}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: Colors.SKY_BLUE,
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: Colors.SKY_BLUE,
        },
      }}
      color="primary"
    />
  );
}
