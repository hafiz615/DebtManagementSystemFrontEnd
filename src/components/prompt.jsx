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
  DeleteTasks,
  DeleteLink,
  DeleteCheckDetails,
  DeleteDraft,
  DeleteSmsDraft,
  InboxStatus,
  TaskStatus,
  DeleteVoiceMessage,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CallEnd, Delete, Done } from "@mui/icons-material";
import CallEndIcon from "@mui/icons-material/CallEnd";

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
  data,
  getAllCaseTasks,
  getLinks,
  deleteHandler,
  setFileToDelete,
  caseData,
  checkId,
  GetCaseDetails,
  getAllInboxData,
  task,
  setActivePreview,
  handleSignatureDelete,
  getVoiceMails,
  handleDeleteParticipant,
  handleDeleteAccount,
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

  const deleteTemplate = async () => {
    const newTemplate = {
      name: row?.name,
      event: row?.event,
      content: row?.content,
      templateId: row?.templateId,
      type: templateType,
      ...(templateType === "email" && { subject: row?.subject }),
    };

    const resNotificationTemplate = await DeleteSettings(newTemplate);
    if (resNotificationTemplate?.status === 200) {
      showToast(resNotificationTemplate?.data?.message, "success");
      getSettings();
    } else {
      const errorMessage = resNotificationTemplate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const deleteRole = async () => {
    if (setSelectedRole) {
      setSelectedRole(roleName);
    }
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

  const deleteTasks = async () => {
    setLoading(true);
    const deleteTask = await DeleteTasks(data?._id);

    if (deleteTask?.status === 200) {
      setOpen(false);
      showToast(deleteTask?.data?.message, "success");
      getAllCaseTasks();
    } else {
      showToast(
        deleteTask?.response?.data?.message || deleteTask?.data?.message,
        "error"
      );
    }
    setLoading(true);
  };

  const deleteLink = async () => {
    setLoading(true);
    const deleteUrlRes = await DeleteLink(id);
    if (deleteUrlRes?.status === 200) {
      setOpen(false);
      showToast(deleteUrlRes?.data?.message, "success");
      getLinks();
    } else {
      showToast(
        deleteUrlRes?.response?.data?.message || deletion?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };

  const handleClickOpen = (event) => {
    event.stopPropagation();
    if (deleting === "delete File") {
      setFileToDelete(item);
    }
    setOpen(true);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
    if (deleting === "delete File") {
      setFileToDelete(null);
    }
  };

  const deleteCheckIds = async () => {
    const res = await DeleteCheckDetails(checkId, caseData?.debtor?._id);
    if (res?.status === 200) {
      GetCaseDetails(caseData?._id);
    }
  };

  const deleteDraft = async () => {
    const res = await DeleteDraft(item);
    if (res?.status === 200) {
      getAllInboxData(false, false);
    }
  };

  const deleteSmsDraft = async () => {
    const res = await DeleteSmsDraft(item);
    if (res?.status === 200) {
      getAllInboxData(false, false);
    }
  };

  const deleteVoiceMessage = async () => {
    const res = await DeleteVoiceMessage(item);
    if (res?.status === 200) {
      getVoiceMails(true);
    }
  };

  // const handleCompleteStatus = async () => {
  //   if (task) {
  //     const res = await TaskStatus(item);
  //     if (res?.status === 200) {
  //       getAllInboxData(false, false);
  //     }
  //   } else {
  //     const res = await InboxStatus(item);
  //     if (res?.status === 200) {
  //       getAllInboxData(false, false);
  //       setActivePreview({ id: 0, active: false });
  //     }
  //   }
  // };

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
    } else if (handleSignatureDelete) {
      await handleSignatureDelete();
    } else if (deleting === "delete template") {
      await deleteTemplate();
    } else if (deleting === "Removing Participant") {
      await handleDeleteParticipant();
    } else if (deleting === "Delete Tasks") {
      await deleteTasks();
    } else if (deleting === "Delete User") {
      await deleteUserById();
    } else if (deleting === "Url's") {
      await deleteLink();
    } else if (deleting === "delete File") {
      await deleteHandler();
    } else if (deleting === "checkIds") {
      await deleteCheckIds();
    } else if (deleting === "deleteDraft") {
      await deleteDraft();
    } else if (deleting === "deleteAccount") {
      await handleDeleteAccount();
    } else if (deleting === "deleteSmsDraft") {
      await deleteSmsDraft();
    } else if (deleting === "deleteVoiceMesssage") {
      await deleteVoiceMessage();
    } else if (deleteRole) {
      await deleteRole();
    } else {
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
        {deleting === "markAsComplete" ? (
          <Tooltip title="Mark as complete" placement="top">
            <Done
              sx={{
                color: Colors.NAVY_BLUE,
                fontSize: "20px",
              }}
            />
          </Tooltip>
        ) : show ? (
          <Replay
            sx={{
              color: Colors.ORANGE_COLOR,
              fontSize: "20px",
            }}
          />
        ) : showPayment ? (
          <Replay
            sx={{
              color: Colors.DARK_GRAY,
              fontSize: "20px",
            }}
          />
        ) : handleDeleteParticipant ? (
          <Tooltip title="Remove Participant" placement="top">
            <CallEnd
              sx={{
                color: Colors.ORANGE_COLOR,
                fontSize: "20px",
              }}
            />
          </Tooltip>
        ) : (
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
