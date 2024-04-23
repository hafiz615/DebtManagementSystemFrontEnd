import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

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
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
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
        backgroundColor: "#FFFFFF",
        color: "#9EA3A9",
        height: "3.5rem",

        "&:hover": {
          background: "#FFFFFF",
          color: "#9EA3A9",
        },
      }}
    >
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "#D5D6D7", fontSize: "2rem" }} />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        sx={{ color: "#D5D6D7" }}
      />

      <IconButton size="large" aria-label="show 4 new mails" color="inherit">
        <FilterListIcon
          sx={{
            color: "#181A1B",
            fontSize: "2rem",
          }}
        />
      </IconButton>
    </Search>
  );
}

export default SearchBar;
