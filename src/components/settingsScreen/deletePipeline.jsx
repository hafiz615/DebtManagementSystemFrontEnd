import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";
import StatusAutoComplete from "./statusAutoComplete";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};
export default function DeletePipeline({ handleClose, data, pipelineList }) {
  const { showToast } = useToast();
  const [value, setValue] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const arrayStatus = ["negotiation", "processing"];

  const pipelineStatuses = pipelineList?.map((item) => item?.name);

  //   const deletePipelineStatus = async () => {
  //     setLoading(true);
  //     const params = { original: text, update: value || text };
  //     const deleteStatusResponse = await DeleteAndReplaceStatus(params, statusId);
  //     if (deleteStatusResponse?.status === 200) {
  //       showToast(deleteStatusResponse?.data?.message, "success");
  //       GetStatuses();
  //     } else {
  //       const errorMessage = deleteStatusResponse?.response?.data?.message;
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
          Delete Pipeline Status
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box>
        <Typography
          sx={{ fontWeight: "700", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Choose a Replacement
        </Typography>

        <StatusAutoComplete
          arrayStatus={pipelineStatuses}
          setValue={setValue}
          value={value}
          text={data?.name}
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
              {data?.name}
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
          //   onClick={deletePipelineStatus}
          disabled={!value}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Box>
    </>
  );
}
