import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddchartIcon from "@mui/icons-material/Addchart";

import { Colors } from "../config/default";
export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          backgroundColor: Colors.SKY_BLUE,
          color: Colors.WHITE,
          fontFamily: "Nunito",
          borderRadius: "5px",
          textTransform: "none",
          ":hover": {
            backgroundColor: Colors.SKY_BLUE,
            color: Colors.WHITE,
          },
        }}
      >
        <AddchartIcon sx={{ marginRight: "0.2rem" }} />
        Create New Case <ExpandMoreIcon />
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
          sx={{ width: "11.3rem" }}
          onClick={() => handleMenuItemClick(5)}
        >
          Create New
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(7)}>Import</MenuItem>
      </Menu>
    </div>
  );
}
