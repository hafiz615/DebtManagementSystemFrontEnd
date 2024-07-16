import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import { CreateRoles } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { FONT_FAMILY, FONT_WEIGHT_MEDIUM } from "../../constants/appConstants";

function CreateRole({ handleClose, GetRoles, show, selectedRoleData }) {
  const { showToast } = useToast();
  const [roleName, setRoleName] = useState("");

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (show === "duplicateRole") {
      const params = {
        name: roleName,
        generalPermissions: selectedRoleData?.generalPermissions,
        settings: selectedRoleData?.settings,
        analytics: selectedRoleData?.analytics,
      };
      const addRole = await CreateRoles(params);
      if (addRole?.status === 200) {
        showToast(addRole?.data?.message, "success");
        setRoleName("");
        GetRoles();
      } else {
        const errorMessage = addRole?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      const params = { name: roleName };
      const addRole = await CreateRoles(params);
      if (addRole?.status === 200) {
        showToast(addRole?.data?.message, "success");
        setRoleName();
        GetRoles();
      } else {
        const errorMessage = addRole?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    handleClose();
  };

  return (
    <Grid container xs={12}>
      <Typography
        sx={{
          fontWeight: FONT_WEIGHT_MEDIUM,
          fontFamily: FONT_FAMILY,
          color: Colors.BLACK,
        }}
      >
        Create Role
      </Typography>

      <Grid item style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Role Name"
          style={inputStyling}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
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
            onClick={handleSave}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default CreateRole;
