import * as React from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddchartIcon from "@mui/icons-material/Addchart";

import { Colors } from "../config/default";

export default function BasicMenu({
  heading,
  menuItem1,
  menuItem2,
  menuItem3,
  toShowDrawer,
  backgroundColor,
  toShowDebtor,
  onClick,
}) {
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
    // Do something with the selected menu item value if needed
  };

  return (
    <div>
      {toShowDrawer && (
        <>
          <Button
            id="drawer-basic-button" // Changed id to be unique
            aria-controls={open ? "drawer-basic-menu" : undefined} // Changed aria-controls to be unique
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              backgroundColor: backgroundColor,
              color: Colors.WHITE,
              fontFamily: "Nunito",
              height: "3rem",
              borderRadius: "10px",
              textTransform: "none",
              ":hover": {
                backgroundColor: Colors.SKY_BLUE,
                color: Colors.WHITE,
              },
            }}
          >
            <AddchartIcon sx={{ marginRight: "0.2rem" }} />
            {heading}
            <ExpandMoreIcon />
          </Button>
          <Menu
            id="drawer-basic-menu" // Changed id to be unique
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "drawer-basic-button", // Changed aria-labelledby to match the updated id
            }}
          >
            <MenuItem sx={{ width: "11.3rem" }} onClick={onClick}>
              {menuItem1}
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(7)}>
              {menuItem2}
            </MenuItem>
          </Menu>
        </>
      )}
      {toShowDebtor && (
        <>
          <Button
            id="debtor-basic-button" // Changed id to be unique
            aria-controls={open ? "debtor-basic-menu" : undefined} // Changed aria-controls to be unique
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              backgroundColor: backgroundColor,
              color: Colors.WHITE,
              fontFamily: "Nunito",
              height: "3rem",
              borderRadius: "10px",
              textTransform: "none",
              ":hover": {
                backgroundColor: Colors.SKY_BLUE,
                color: Colors.WHITE,
              },
            }}
          >
            <AddchartIcon sx={{ marginRight: "0.2rem" }} />
            {heading}
            <ExpandMoreIcon />
          </Button>
          <Menu
            id="debtor-basic-menu" // Changed id to be unique
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "debtor-basic-button", // Changed aria-labelledby to match the updated id
            }}
          >
            <MenuItem
              sx={{ width: "11.3rem" }}
              onClick={() => handleMenuItemClick(5)}
            >
              {menuItem1}
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(7)}>
              {menuItem2}
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(7)}>
              {menuItem3}
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}
