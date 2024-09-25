import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { Colors } from "../config/default";

export default function ResponsiveTimePickers({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopTimePicker
        sx={{
          backgroundColor: Colors.BG_LIGHT_GRAY,
          color: Colors.DIM_LIGHT_GRAY,
          borderRadius: "5px",
          width: "15rem",
          height: "2.5rem",
          alignItems: "flex-start",
          overflow: "hidden",
          "& .MuiOutlinedInput-root": {
            display: "flex",
            height: "2.5rem",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
        }}
        value={value}
        onChange={onChange}
        ampm={false}
        format="HH:mm"
      />
    </LocalizationProvider>
  );
}
