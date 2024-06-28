import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { Colors } from "../../config/default";

export default function StatusAutoComplete({
  arrayStatus,
  value,
  setValue,
  text,
}) {
  const filteredOptions = arrayStatus.filter((option) => option !== text);

  const defaultProps = {
    options: filteredOptions,
    getOptionLabel: (option) => option,
  };

  return (
    <Stack
      spacing={1}
      style={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        marginTop: "1rem",
        marginBottom: "1rem",
        height: "2.5rem",
        color: Colors.DIM_LIGHT_GRAY,
        border: "none",
        outline: "none",
        borderRadius: "5px",
        width: "100%",
        fontFamily: "Nunito",
      }}
    >
      <Autocomplete
        style={{ fontFamily: "Nunito" }}
        {...defaultProps}
        id="controlled-demo"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select a status"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              style: {
                backgroundColor: Colors.BG_LIGHT_GRAY,
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                height: "2.5rem",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                fontFamily: "Nunito",
              },
              startAdornment: params.InputProps.startAdornment
                ? params.InputProps.startAdornment
                : null,
            }}
          />
        )}
      />
    </Stack>
  );
}
