import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function EditPipelineCase({ handleClose }) {
  //   const { showToast } = useToast();
  //   const [loading, setLoading] = useState(false);

  //   const editPipelineCase = async () => {
  //     setLoading(true);
  //     const params = { original: text, update: newStatus };
  //     const editStatusResponse = await UpdateStatus(params, statusId);
  //     if (editStatusResponse?.status === 200) {
  //       showToast(editStatusResponse?.data?.message, "success");
  //       GetStatuses();
  //     } else {
  //       const errorMessage = editStatusResponse?.response?.data?.message;
  //       showToast(errorMessage, "error");
  //     }
  //     setLoading(false);
  //     handleClose();
  //   };

  return (
    <>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Edit Pipeline Case
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box>
        {/* <input
          type="text"
          placeholder="Edit Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            marginTop: "1rem",
            marginBottom: "1rem",
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "100%",
          }}
        /> */}
        <Box sx={lineStyle} />
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="SAVE"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          //   onClick={editPipelineCase}
          //   loading={loading}
        />
      </Box>
    </>
  );
}
