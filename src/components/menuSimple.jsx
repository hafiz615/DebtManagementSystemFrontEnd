import * as React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddchartIcon from "@mui/icons-material/Addchart";
import { Modal } from "@mui/material";

import { Colors } from "../config/default";
import UploadCsv from "./uploadCsv";

export default function BasicMenu({ backgroundColor, width }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const routeFound = localStorage.getItem("route");
  const roteSelect =
    routeFound === "Create New Case" || routeFound === "Import"
      ? routeFound
      : "Create";
  const [selectedValue, setSelectedValue] = React.useState(
    roteSelect || "Create"
  );

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value, path) => {
    setSelectedValue(value);
    handleClose();
    localStorage.setItem("route", value);
    navigate(path);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
          backgroundColor: backgroundColor,
          color: Colors.WHITE,
          fontFamily: "Nunito",
          width: width,
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
        {selectedValue} <ExpandMoreIcon />
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
          sx={{ width: "11.9rem" }}
          onClick={() =>
            handleMenuItemClick("Create New Case", "/case-details")
          }
        >
          Create New Case
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Import
        </MenuItem>
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <UploadCsv handleModalClose={handleModalClose} />
        </Modal>
      </Menu>
    </>
  );
}
