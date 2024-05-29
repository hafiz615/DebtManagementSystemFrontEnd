import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Close from "@mui/icons-material/Close";

import { Colors } from "../config/default";
import { DeleteUserById } from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";

export default function Prompt({ heading, text, id, GetUsers }) {
  const { showToast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const deleteUserById = async () => {
    setLoading(true);
    const deleteUser = await DeleteUserById(id);
    if (deleteUser?.status === 200) {
      setOpen(false);
      showToast(deleteUser?.data?.message, "success");
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
      <Close
        onClick={handleClickOpen}
        sx={{
          color: Colors.ORANGE_COLOR,
          fontSize: "20px",
          cursor: "pointer",
          marginLeft: "1rem",
          mb: ".2rem",
        }}
      />

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
            onClick={deleteUserById}
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
