import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddchartIcon from "@mui/icons-material/Addchart";
import { Modal } from "@mui/material";

import { Colors } from "../config/default";
import UploadCsv from "./uploadCsv";
import { useSelector } from "react-redux";

export default function BasicMenu({ openState, backgroundColor, width }) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
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
      {openState ? (
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
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            backgroundColor: Colors.SKY_BLUE,
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
            width: "40px",
            cursor: "pointer",

            ":hover": {
              backgroundColor: Colors.SKY_BLUE,
              color: Colors.WHITE,
            },
          }}
        >
          <AddchartIcon
            sx={{
              color: Colors.WHITE,
              fontSize: "1.5rem",
            }}
          />
        </Box>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {generalPermissions?.createNewCase && (
          <MenuItem
            sx={{ width: "11.9rem" }}
            onClick={() =>
              handleMenuItemClick("Create New Case", "/case-details")
            }
          >
            Create New Case
          </MenuItem>
        )}
        {generalPermissions?.importBulkCases && (
          <MenuItem
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Import
          </MenuItem>
        )}
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <UploadCsv handleModalClose={handleModalClose} />
        </Modal>
      </Menu>
    </>
  );
}
