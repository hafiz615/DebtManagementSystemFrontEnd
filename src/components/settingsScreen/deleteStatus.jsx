import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import StatusAutoComplete from "./statusAutoComplete";
import { useToast } from "../../toast/toastContext";
import { DeleteAndReplaceStatus } from "../../services/services";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB", // Change the color as needed
  margin: "1rem 0",
};
export default function DeleteStatus({
  handleClose,
  arrayStatus,
  text,
  statusId,
  GetStatuses,
}) {
  const { showToast } = useToast();
  const [value, setValue] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const deleteStatus = async () => {
    setLoading(true);
    const params = { original: text, update: value || text };
    const deleteStatusResponse = await DeleteAndReplaceStatus(params, statusId);
    if (deleteStatusResponse?.status === 200) {
      showToast(deleteStatusResponse?.data?.message, "success");
      GetStatuses();
    } else {
      const errorMessage = deleteStatusResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
    handleClose();
  };
  return (
    <>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Delete Case Status
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box>
        <Typography
          sx={{ fontWeight: "700", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Choose a Replacement
        </Typography>

        <Typography
          sx={{
            fontWeight: "500",
            fontFamily: "Nunito",
            color: Colors.DIM_LIGHT_GRAY,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          cursus elit id tempor tincidunt. Quisque turpis
        </Typography>
        <StatusAutoComplete
          arrayStatus={arrayStatus}
          setValue={setValue}
          value={value}
          text={text}
        />
        {value && (
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              color: Colors.DIM_LIGHT_GRAY,
            }}
          >
            You're going to replace{" "}
            <span style={{ fontWeight: "700", color: Colors.BLACK }}>
              {text}
            </span>{" "}
            to{" "}
            <span style={{ fontWeight: "700", color: Colors.BLACK }}>
              {value}
            </span>
          </Typography>
        )}

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
          onClick={deleteStatus}
          disabled={!value}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Box>
    </>
  );
}
