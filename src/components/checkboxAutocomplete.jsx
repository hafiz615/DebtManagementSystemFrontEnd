import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../config/default";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
            style={{ fontFamily: "Nunito", padding: "0" }}
            key={key}
            {...optionProps}
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
            />
            {option}
          </li>
        );
      }}
      renderTags={() => null}
      style={{ width: width, maxHeight: "2.5rem" }}
      renderInput={(params) => (
        <TextField
          sx={{ color: Colors.BLACK }}
          {...params}
          placeholder={placeholder}
        />
      )}
      clearIcon={<CloseIcon style={{ display: "none" }} />}
    />
  );
}
