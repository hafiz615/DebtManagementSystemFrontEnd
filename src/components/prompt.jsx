import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import Close from "@mui/icons-material/Close";

import { Colors } from "../config/default";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Replay from "@mui/icons-material/Replay";
import { DeleteUserById, DeleteCustomField } from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";
import { IconButton } from "@mui/material";

export default function Prompt({
  deleting,
  heading,
  text,
  id,
  GetUsers,
  handleModalClose,
  handleUserDelete,
  show,
}) {
  const { showToast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const deleteCustomField = async () => {
    setLoading(true);
    const deletion = await DeleteCustomField(id);
    if (deletion?.status === 200) {
      setOpen(false);
      showToast(deletion?.data?.message, "success");
      handleModalClose();
    } else {
      showToast(
        deletion?.response?.data?.message || deletion?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  const deleteUserById = async () => {
    setLoading(true);
    const deleteUser = await DeleteUserById(id);
    if (deleteUser?.status === 200) {
      setOpen(false);
      showToast(deleteUser?.data?.message, "success");
      handleUserDelete(id);
      GetUsers();
    } else {
      showToast(
        deleteUser?.response?.data?.message || deleteUser?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        {show ? (
          <Replay
            sx={{
              color: Colors.ORANGE_COLOR,
              fontSize: "14px",
            }}
          />
        ) : (
          <DeleteForeverOutlinedIcon
            sx={{
              color: Colors.ORANGE_COLOR,
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TextButton
            buttonText="Cancel"
            onClick={handleClose}
            backgroundColor={Colors.ORANGE_COLOR}
            hoverColor={Colors.ORANGE_COLOR}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            marginRight=".5rem"
            width="6rem"
          />
          <TextButton
            loading={loading}
            buttonText="Confirm"
            onClick={
              deleting === "Custom Field" ? deleteCustomField : deleteUserById
            }
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            width="6rem"
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
