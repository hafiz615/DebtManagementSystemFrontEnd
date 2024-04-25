import React from "react";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import { Colors } from "../config/default";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },

  // marginRight: theme.spacing(2),
  // marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
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
  color: Colors.DARK_GRAY,
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "18rem",
    },
  },
}));
function SearchBar() {
  return (
    <Search
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "1rem",
        backgroundColor: Colors.WHITE,
        height: "3.5rem",

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
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        sx={{ color: Colors.DARK_GRAY, fontFamily: "Nunito" }}
      />

      <IconButton size="large" aria-label="show filter data" color="inherit">
        <FilterListIcon
          sx={{
            color: Colors.BLACK,
            fontSize: "2rem",
          }}
        />
      </IconButton>
    </Search>
  );
}

export default SearchBar;
