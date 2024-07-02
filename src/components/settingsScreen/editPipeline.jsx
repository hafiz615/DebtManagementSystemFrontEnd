import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";
import Dropdown from "../dropdown";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function EditPipeline({ handleClose, data }) {
  const { showToast } = useToast();
  const [newStatus, setNewStatus] = useState(data?.name || "");
  const [selectedValue, setSelectedValue] = useState(data?.status || "");
  const [loading, setLoading] = useState(false);
  const menuItems = [
    { label: "Active", value: "Active" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" },
  ];

  //   const editPipeline = async () => {
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
          Edit Pipeline Status
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
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
            width: "73%",
          }}
        />
        <Dropdown
          menuWidth="12%"
          menuItems={menuItems}
          placeholder="Type"
          height="2.5rem"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width="25%"
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </Box>
      <Box sx={lineStyle} />
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
          //   onClick={editPipeline}
          loading={loading}
          disabled={!newStatus}
        />
      </Box>
    </>
  );
}
