import React, { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../config/default";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import TextButton from "./button";
import { styled } from "@mui/material/styles";

const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

const StyledListbox = styled("ul")(({ theme }) => ({}));

export default function CheckboxAutocomplete({
  options,
  multiSelect,
  setMultiselect,
  placeholder,
  width,
  update,
  handleUpdate,
}) {
  const autocompleteRef = useRef(null);

  const isComplexData =
    options.length > 0 &&
    typeof options[0] === "object" &&
    "creditorId" in options[0];

  const handleUpdateClick = () => {
    handleUpdate(false);
    if (autocompleteRef.current) {
      autocompleteRef.current.blur();
    }
  };

  return (
    <Autocomplete
      multiple
      ref={autocompleteRef}
      id="checkboxes-tags-demo"
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => (isComplexData ? option.name : option)}
      isOptionEqualToValue={(option, value) =>
        isComplexData
          ? option.creditorId === value.creditorId
          : option === value
      }
      value={multiSelect}
      onChange={(event, newValue) => {
        setMultiselect(newValue);
      }}
      ListboxComponent={(props) => (
        <StyledListbox {...props}>
          {props.children}
          {update && (
            <li>
              <TextButton
                disabled={multiSelect?.length === 0}
                buttonText="Update"
                height="2rem"
                width="100%"
                onClick={handleUpdateClick}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </li>
          )}
        </StyledListbox>
      )}
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
            <span style={{ fontSize: FONT_SIZE_LARGE }}>
              {isComplexData ? option.name : option}
            </span>
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
