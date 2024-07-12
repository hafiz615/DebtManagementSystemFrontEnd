import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";

function CreateRole({ handleClose }) {
  const inputStyling = {
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
    fontFamily: "Nunito",
  };
  return (
    <Grid container xs={12}>
      <Typography
        sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
      >
        Cretae Role
      </Typography>

      <Grid item style={{ width: "100%" }}>
        <input type="text" placeholder="Role Name" style={inputStyling} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
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
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default CreateRole;
