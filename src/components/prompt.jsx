import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Colors } from "../config/default";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Replay from "@mui/icons-material/Replay";
import { styled } from "@mui/material/styles";

import { DeleteUserById, DeleteCustomField } from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";
import { IconButton } from "@mui/material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
  },
  "& .MuiTypography-root": {
    fontFamily: "Nunito",
  },
}));

export default function Prompt({
  deleting,
  heading,
  text,
  id,
  GetUsers,
  handleModalClose,
  handleUserDelete,
  show,
  handleRetry,
  item,
  handlePayment,
  showPayment,
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

  const handleConfirm = async () => {
    setLoading(true);
    if (handleRetry) {
      await handleRetry(item);
    } else if (handlePayment) {
      await handlePayment(item);
    } else if (handlePayment) {
    } else if (deleting === "Custom Field") {
      await deleteCustomField();
    } else {
      await deleteUserById();
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        {show ? (
          <Replay
            sx={{
              color: Colors.ORANGE_COLOR,
              fontSize: "20px",
            }}
          />
        ) : showPayment ? (
          // <Box
          //   sx={{
          //     border: "1px solid red",
          //     display: "flex",
          //     alignItems: "center",
          //     justifyContent: "center",
          //     marginTop: ".2rem",
          //     marginLeft: ".5rem",
          //   }}
          // >
          <Replay
            sx={{
              color: Colors.DARK_GRAY,
              fontSize: "20px",
            }}
          />
        ) : (
          // </Box>
          <DeleteForeverOutlinedIcon
            sx={{
              color: Colors.ORANGE_COLOR,
              fontSize: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </IconButton>

      <StyledDialog
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
        <DialogActions
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
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
            onClick={handleConfirm}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            width="6rem"
          />
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}
