import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../config/default";
import ScrollbarStyles from "././customScroll";

export default function Dropdown({
  menuItems,
  backgroundColor,
  width,
  marginBottom,
  marginTop,
  height,
  defaultSelectedItem,
  selectedValue,
  setSelectedValue,
  onChange,
  initialValue,
  hoverColor,
  placeholder,
  menuWidth,
  disabled,
  show,
  setId,
  showCaseStatus,
  emptyMessage,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value, id) => {
    handleClose();
    if (onChange) {
      onChange(value);
    } else {
      setSelectedValue(value);
      if (show === "editAbout" || show === "addTask" || show === "editTask") {
        setId(id);
      }
    }
  };

  return (
    <>
      <Button
        disabled={disabled}
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
          marginBottom: marginBottom,
          marginTop: marginTop,
          border: showCaseStatus ? "2px solid red" : "1px solid transparent",
          fontFamily: "Nunito",
          borderRadius: "5px",
          textTransform: "none",
          ":hover": {
            background: hoverColor || Colors.WHITE,
          },
          width: width,
          height: height,
        }}
      >
        {initialValue || selectedValue || defaultSelectedItem || placeholder}
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
        PaperProps={{
          sx: {
            maxHeight: 300,
            overflowY: "auto",
            minWidth: menuWidth,
            ...ScrollbarStyles,
          },
        }}
      >
        {menuItems?.length === 0 ? (
          <MenuItem
            sx={{
              color: Colors.LIGHT_GRAY,
            }}
          >
            {emptyMessage || "No Item"}
          </MenuItem>
        ) : (
          menuItems?.map((item, index) => (
            <MenuItem
              key={index}
              sx={{
                color: Colors.LIGHT_GRAY,
              }}
              onClick={() => handleMenuItemClick(item?.value, item?.id || "")}
            >
              {item.label}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
