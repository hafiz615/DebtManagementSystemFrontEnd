import * as React from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material/";

import CreateIcon from "@mui/icons-material/Create";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../../constants/appConstants";

export default function AlertDialog({ handleEditFileName, initialFileName }) {
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(initialFileName);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (newName.trim() !== "") {
      handleEditFileName(newName); // Call the parent function with the new name
      setNewName(""); // Clear the input field
      setOpen(false); // Close the dialog
    }
  };
  React.useEffect(() => {
    setNewName(initialFileName);
  }, [initialFileName]);

  return (
    <React.Fragment>
      <CreateIcon
        onClick={handleClickOpen}
        sx={{
          color: Colors.DARK_GRAY,
          // marginTop: "0.5rem",
          cursor: "pointer",
          fontSize: { xs: FONT_SIZE_SMALL, sm: "1.2rem" },
        }}
      />

      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Edit File Name</DialogTitle>
        <DialogContent>
          <>
            <input
              type="text"
              placeholder="New File Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "100%",
                marginRight: "0.5rem",
              }}
            />

            <Box mt={2} textAlign="right">
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                  colors: Colors.SKY_BLUE,
                  borderRadius: "10px",
                  pl: "2rem",
                  pr: "2rem",
                }}
              >
                Save
              </Button>
            </Box>
          </>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
