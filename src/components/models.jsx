import * as React from "react";

import { Box, Button, Modal, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";

import AddTask from "./addTask";
import EditField from "./editField";
import AddCustomField from "./addCustomField";
import { Colors } from "../config/default";
import TextButton from "./button";

export default function MuiModels({ buttonName, show, button }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 3,
  };

  return (
    <div>
      {button === "icon" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon sx={{ color: Colors.WHITE, fontSize: "16px" }} />
        </IconButton>
      ) : button === "customField" ? (
        <TextButton
          onClick={() => {
            handleOpen();
          }}
          startIcon={<AddIcon />}
          buttonText="New Custom Field"
        />
      ) : show === "editField" ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CreateIcon
            onClick={() => {
              handleOpen();
            }}
            sx={{
              color: Colors.DARK_GRAY,
              cursor: "pointer",
              fontSize: "20px",
            }}
          />
        </Box>
      ) : (
        <Button onClick={handleOpen}>{buttonName}</Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {show === "addTask" ? (
            <AddTask show={show} handleClose={handleClose} />
          ) : show === "task" ? (
            <AddTask show={show} handleClose={handleClose} />
          ) : show === "editField" ? (
            <EditField show={show} handleClose={handleClose} />
          ) : show === "addCustomField" ? (
            <AddCustomField show={show} handleClose={handleClose} />
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
