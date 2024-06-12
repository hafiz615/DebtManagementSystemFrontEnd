import React from "react";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
// import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";

import { Colors } from "../config/default";
import { MenuItem } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.DIM_LIGHT_GRAY,
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "18rem",
    },
  },
}));
const Dropdown = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "3rem",
  left: 0,
  right: 0,
  zIndex: 1,
  maxHeight: "200px",
  overflowY: "auto",
  borderRadius: "0 0 1rem 1rem",
  boxShadow: theme.shadows[3],
}));
const ClearIconWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  position: "absolute",
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1.5),
  cursor: "pointer",
  color: Colors.DIM_LIGHT_GRAY,
}));
function SearchBar({
  searchText,
  searchCheck,
  searchingText,
  placeholder,
  onChange,
  filteredArray,
  handleSelect,
  setFilteredArray,
  setSearchText,
  handleKeyPress,
  clearSearchFromApi,
}) {
  const clearSearch = () => {
    setSearchText("");
    if (filteredArray) {
      setFilteredArray([]);
    }
  };

  return (
    <Search
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "1rem",
        backgroundColor: Colors.WHITE,
        height: "3rem",
        "&:hover": {
          backgroundColor: Colors.WHITE,
        },
      }}
    >
      <SearchIconWrapper>
        <SearchIcon
          sx={{
            fontSize: "2rem",
          }}
        />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        sx={{ color: Colors.LIGHT_GRAY, fontFamily: "Nunito" }}
        value={searchText}
        onChange={(e) =>
          onChange
            ? onChange(e.target.value)
            : searchCheck
            ? handleKeyPress(e)
            : setSearchText(e.target.value)
        }
      />
      {searchText ? (
        <ClearIconWrapper onClick={clearSearch}>
          <ClearIcon sx={{ fontSize: "1.5rem" }} />
        </ClearIconWrapper>
      ) : (
        ""
      )}
      {searchText && (
        <Dropdown
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
              marginTop: ".5rem",
              marginBottom: ".5rem",
            },
          }}
        >
          {filteredArray?.length > 0 ? (
            filteredArray?.map((result, index) => (
              <MenuItem
                sx={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  mb: ".2rem",
                  "&:hover": {
                    background: "rgba(85, 148, 242, 0.06)",
                  },
                }}
                key={index}
                onClick={() => handleSelect(result)}
              >
                <div
                  style={{
                    display: "flex",
                    padding: 0,
                    flexDirection: "column",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontSize: "11px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: Colors.DARK_GRAY }}>
                    {result?.basicInformation?.fullName}
                  </span>
                  <span>{result?.basicInformation?.email}</span>
                  <span>{result?.basicInformation?.phone}</span>
                  <span> {result?.basicInformation?.SSID}</span>
                </div>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No results</MenuItem>
          )}
        </Dropdown>
      )}
    </Search>
  );
}

export default SearchBar;
