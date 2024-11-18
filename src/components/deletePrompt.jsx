import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Colors } from "../config/default";
import { styled } from "@mui/material/styles";

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
}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <TextButton
        buttonText={buttonName}
        height="2rem"
        width="8rem"
        onClick={() => setOpen(true)}
        backgroundColor={Colors.ORANGE_COLOR}
        hoverColor={Colors.ORANGE_COLOR}
      />
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
