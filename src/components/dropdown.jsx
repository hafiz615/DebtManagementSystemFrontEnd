import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../config/default";

export default function Dropdown({
  menuItems,
  backgroundColor,
  width,
  defaultSelectedItem,
  selectedValue,
  setSelectedValue,
  onChange,
  initialValue,
  hoverColor,
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
    if (onChange) {
      onChange(value);
    } else {
      setSelectedValue(value);
    }
  };

  return (
    <>
      {/* <select
        style={{
          border: "none",
          height: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: paddingLeft,
          width: width,
          backgroundColor: backgroundColor,
          color: Colors.DARK_GRAY,
          fontFamily: "Nunito",
          borderRadius: "5px",
          textTransform: "none",
          ":active": {
            border: "none",
          },
          ":hover": {
            background: hoverColor || Colors.WHITE,
          },
        }}
        onClick={handleClick}
      >
        {menuItems.map((item, index) => (
          <option
            key={index}
            style={{ color: Colors.LIGHT_GRAY }}
            onClick={() => handleMenuItemClick(item.value)}
            value={item?.label}
          >
            {item?.label}
          </option>
        ))}
      </select> */}
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "1rem",
          backgroundColor: backgroundColor,
          color: Colors.DARK_GRAY,
          fontFamily: "Nunito",
          borderRadius: "5px",
          textTransform: "none",
          ":hover": {
            background: hoverColor || Colors.WHITE,
          },
          width: width,
        }}
      >
        {initialValue || selectedValue || defaultSelectedItem}{" "}
        <ExpandMoreIcon />
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
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            sx={{ color: Colors.LIGHT_GRAY }}
            onClick={() => handleMenuItemClick(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
