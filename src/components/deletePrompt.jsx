import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Colors } from "../config/default";
import { styled } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteForeverOutlined } from "@mui/icons-material";
import { deleteCreditor } from "../services/services";
import { useToast } from "../toast/toastContext";
import TextButton from "./button";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
  },
  "& .MuiTypography-root": {
    fontFamily: "Nunito",
  },
}));

export default function DeletePrompt({
  heading,
  text,
  loading,
  handleConfirm,
  buttonName,
  creditorId,
  GetCaseDetails,
  setLoading,
  id,
}) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };
  const handleDeleteCreditor = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    const apiResponse = await deleteCreditor(creditorId);
    if (apiResponse?.status === 200) {
      showToast(apiResponse?.data?.message, "success");
      setOpen(false);
      GetCaseDetails(id);
    } else {
      const errorMessage = apiResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <React.Fragment>
      {buttonName === "Delete" ? (
        <Tooltip title="Delete Creditor">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <DeleteForeverOutlined
              sx={{
                color: Colors.ORANGE_COLOR,
                fontSize: "1.2rem",
              }}
            />
          </IconButton>
        </Tooltip>
      ) : (
        <TextButton
          buttonText={buttonName}
          height="2rem"
          width="8rem"
          onClick={() => setOpen(true)}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
      )}

      <StyledDialog
        open={open}
        onClose={(event) => handleClose(event)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ textAlign: "center" }}
            id="alert-dialog-description"
          >
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
            onClick={(e) =>
              buttonName === "Delete"
                ? handleDeleteCreditor(e)
                : handleConfirm()
            }
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            paddingLeft="2rem"
            paddingRight="2rem"
            height="2rem"
            width="6rem"
            disabled={loading}
          />
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}
