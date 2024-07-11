import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../config/default";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";

const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

export default function CheckboxAutocomplete({
  options,
  multiSelect,
  setMultiselect,
  placeholder,
  width,
}) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={options}
      limitTags={-1}
      disableCloseOnSelect
      value={multiSelect}
      onChange={(event, newValue) => {
        setMultiselect(newValue);
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li
            style={{
              fontFamily: "Nunito",
              padding: "0",
            }}
            key={key}
            {...optionProps}
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: FONT_SIZE_LARGE,
                },
              }}
            />
            <span style={{ fontSize: FONT_SIZE_LARGE }}>{option}</span>
          </li>
        );
      }}
      renderTags={() => null}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{
            color: Colors.BLACK,
            width: width || "6.5rem",
            "& .MuiOutlinedInput-root": {
              padding: 0,
              fontSize: FONT_SIZE_LARGE,
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
              "& .MuiAutocomplete-inputRoot": {
                padding: "0px 8px",
                "& .MuiAutocomplete-input": {
                  padding: "0",
                  maxHeight: ".5rem",
                },
                "& .MuiAutocomplete-endAdornment": {
                  display: "none",
                },
              },
            },
          }}
        />
      )}
      clearIcon={<CloseIcon style={{ display: "none" }} />}
    />
  );
}
