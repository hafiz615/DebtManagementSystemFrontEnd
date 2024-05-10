import * as React from "react";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import ModelInfo from "./modelInfo";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: smallScreen ? "65%" : "55%",
//   bgcolor: Colors.WHITE,
//   borderRadius: "10px",
//   boxShadow: 24,
//   p: 1.5,
// };
export default function BasicModal({ modelButton, show ,GetUsers}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:768px)");

  return (
    <div>
      <Button
        sx={{
          fontFamily: "Nunito",
          fontWeight: "500",
          borderRadius: "10px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          color: Colors.WHITE,
          backgroundColor: Colors.SKY_BLUE,
          "&:hover": {
            background: Colors.SKY_BLUE,
            border: "none",
          },
        }}
        onClick={handleOpen}
        startIcon={<AddIcon />}
      >
        {show ? "EDIT USERS" : modelButton}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid
          container
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: smallScreen ? "65%" : "55%",
            bgcolor: Colors.WHITE,
            borderRadius: "10px",
            boxShadow: 24,
            p: 1.5,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                color: Colors.DIM_LIGHT_GRAY,
              }}
            />
          </Grid>
          <ModelInfo show={show} setOpen={setOpen} GetUsers={GetUsers} />
        </Grid>
      </Modal>
    </div>
  );
}
