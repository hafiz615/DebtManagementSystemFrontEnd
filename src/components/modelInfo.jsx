import React, { useState } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import TextButton from "./button";
import CustomTextField from "./customTextfield";
import { CreateUser } from "../services/services";
import { useToast } from "../toast/toastContext";

function ModelInfo({ show, setOpen, GetUsers }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    gender: "",
    phone: "",
    dob: "",
    ssid: "",
    role: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      name: formData?.userName,
      email: formData?.email,
      role: formData?.role,
      SSID: formData?.ssid,
      dateOfBirth: formData?.dob,
      phone: formData?.phone,
      gender: formData?.gender,
      address: formData?.address,
      createdBy: "Admin",
    };
    const userAdded = await CreateUser(params);

    if (userAdded?.status === 201) {
      showToast(userAdded?.data?.message, "success");

      GetUsers();
      setFormData({
        userName: "",
        email: "",
        gender: "",
        phone: "",
        dob: "",
        ssid: "",
        role: "",
        address: "",
      });
      setOpen(false);
    } else {
      const errorMessage = userAdded?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  return (
    <Grid item xs={12} sx={{ paddingX: "1rem" }}>
      <Typography
        sx={{
          fontWeight: "600",
          fontFamily: "Nunito",
        }}
      >
        {show ? "Edit User" : "Add User"}
      </Typography>

      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: {
            xs: "space-evenly",
            sm: "space-between",
          },
          marginTop: "2rem",
        }}
      >
        <CustomTextField
          label="User Name"
          placeHolderValue="Name"
          type="text"
          onChange={(e) => handleInputChange("userName", e.target.value)}
        />
        <CustomTextField
          label="Gender"
          type="text"
          placeHolderValue="Gender"
          onChange={(e) => handleInputChange("gender", e.target.value)}
        />
        <CustomTextField
          label="Email"
          type="text"
          placeHolderValue="Email"
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <CustomTextField
          label="Phone #"
          type="number"
          placeHolderValue="Phone"
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: {
            xs: "space-evenly",
            sm: "space-between",
          },
          marginTop: "1rem",
        }}
      >
        <div style={{ width: "23%" }}>
          <CustomTextField
            label="DOB"
            type="date"
            placeHolderValue="DOB"
            width="100%"
            onChange={(e) => handleInputChange("dob", e.target.value)}
          />
        </div>
        <CustomTextField
          label="SSID"
          type="number"
          placeHolderValue="SSID"
          onChange={(e) => handleInputChange("ssid", e.target.value)}
        />
        <CustomTextField
          label="Role"
          type="text"
          placeHolderValue="Role"
          onChange={(e) => handleInputChange("role", e.target.value)}
        />
        <CustomTextField
          label="Address"
          type="text"
          placeHolderValue="Address"
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "2rem",
        }}
      >
        <TextButton
          loading={loading}
          buttonText={show ? "EDIT" : "ADD"}
          height="2rem"
          marginBottom="2rem"
          onClick={handleSubmit}
        />
      </Grid>
    </Grid>
  );
}

export default ModelInfo;
