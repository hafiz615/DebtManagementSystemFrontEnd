import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../config/default";
export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedValue, setSelectedValue] = React.useState(3); // State to hold the selected value
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    setSelectedValue(value);
    handleClose();
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          backgroundColor: Colors.WHITE,
          color: Colors.LIGHT_GRAY,
          fontFamily: "Nunito",
          borderRadius: "5px",
          ":hover": {
            backgroundColor: Colors.WHITE,
          },
        }}
      >
        {selectedValue || "3"} <ExpandMoreIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          sx={{ width: "4rem", color: Colors.LIGHT_GRAY }}
          onClick={() => handleMenuItemClick(5)}
        >
          5
        </MenuItem>
        <MenuItem
          sx={{ color: Colors.LIGHT_GRAY }}
          onClick={() => handleMenuItemClick(7)}
        >
          7
        </MenuItem>
      </Menu>
    </>
  );
}
