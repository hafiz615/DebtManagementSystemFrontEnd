import * as React from "react";

import { Box, Button, Modal, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AddTask from "./addTask";
import EditField from "./editField";
import AddCustomField from "./addCustomField";
import { Colors } from "../config/default";

export default function MuiModels({ buttonName, show }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: show === "editField" ? "40vw" : "50vw",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 3,
  };

  return (
    <div>
      {show === "addCustomField" || show === "addTask" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon sx={{ color: Colors.WHITE, fontSize: "16px" }} />
        </IconButton>
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
