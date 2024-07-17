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

import {
  DeleteUserById,
  DeleteCustomField,
  DeleteSettings,
  DeleteRole,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  handleDelete,
  disabled,
  iconSize,
  row,
  templateType,
  getSettings,
  rolesId,
  GetRoles,
  setSelectedRole,
  roleName,
  permissionData,
}) {
  const { showToast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

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
  const deleteTemplate = async () => {
    const newTemplate = {
      subject: row?.subject,
      name: templateType === "email" ? row?.name : row?.name,
      event: templateType === "email" ? row?.event : row?.event,
      html: templateType === "email" ? row?.html : row?.text,
      templateId: row?.templateId,
    };

    const resNotificationTemplate = await DeleteSettings(
      newTemplate,
      templateType
    );
    if (resNotificationTemplate?.status === 200) {
      showToast(resNotificationTemplate?.data?.message, "success");
      getSettings();
      // setFroalaEditor("");
      // handleClose();
      // setFroalaEditor("");
      // setEmailTemplate({
      //   subject: "",
      //   name: "",
      //   event: "",
      //   html: "",
      // });
      // setSmsTemplate({
      //   name: "",
      //   event: "",
      //   text: "",
      // });
    } else {
      const errorMessage = resNotificationTemplate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const deleteRole = async () => {
    setSelectedRole(roleName);
    setLoading(true);
    const deleteRoles = await DeleteRole(rolesId);
    if (deleteRoles?.status === 200) {
      setOpen(false);
      showToast(deleteRoles?.data?.message, "success");
      setSelectedRole(null);
      GetRoles();
    } else {
      showToast(
        deleteRoles?.response?.data?.message || deleteRoles?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  const handleClickOpen = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  const handleConfirm = async (event) => {
    event.stopPropagation();
    setLoading(true);
    if (handleRetry) {
      await handleRetry(item);
    } else if (handlePayment) {
      await handlePayment(item);
    } else if (handlePayment) {
    } else if (deleting === "Custom Field") {
      await deleteCustomField();
    } else if (handleDelete) {
      await handleDelete();
    } else if (deleteRole) {
      await deleteRole();
    } else if (deleteTemplate) {
      await deleteTemplate();
    } else {
      await deleteUserById();
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={(event) => handleClickOpen(event)}
        disabled={disabled}
      >
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
              color: disabled ? Colors.DIM_LIGHT_GRAY : Colors.ORANGE_COLOR,
              fontSize: iconSize || "20px",
              cursor: "pointer",
            }}
          />
        )}
      </IconButton>

      <StyledDialog
        open={open}
        onClose={(event) => handleClose(event)}
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
            onClick={(event) => handleClose(event)}
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
            onClick={(event) => handleConfirm(event)}
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
