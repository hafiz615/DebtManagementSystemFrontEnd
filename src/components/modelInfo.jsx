import React, { useState } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import TextButton from "./button";
import CustomTextField from "./customTextfield";
import { CreateUser } from "../services/services";
import { useToast } from "../toast/toastContext";
import Dropdown from "./dropdown";
import { Colors } from "../config/default";

function ModelInfo({ show, setOpen, GetUsers }) {
  const menuItems = [
    { label: "Manager", value: "Manager" },
    { label: "Negotiator", value: "Negotiator" },
  ];
  const genderItems = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
  const [selectedValue, setSelectedValue] = useState("Manager");
  const [gender, setGender] = useState("Male");
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    dob: "",
    ssid: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    ssid: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === "phone" || field === "ssid") {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (value && parseInt(value, 10) <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Value must be greater than 0",
        }));
      } else if (value.length > 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Value must not exceed 10 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      }
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      name: formData?.userName,
      email: formData?.email,
      role: selectedValue,
      SSID: formData?.ssid,
      dateOfBirth: formData?.dob,
      phone: formData?.phone,
      gender: gender,
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
        phone: "",
        dob: "",
        ssid: "",
        address: "",
      });
      setOpen(false);
    } else {
      const errorMessage = userAdded?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const isFormValid = () => {
    return (
      formData.userName &&
      isEmailValid(formData.email) &&
      formData.phone &&
      formData.dob &&
      formData.ssid &&
      formData.address &&
      !errors.phone &&
      !errors.ssid
    );
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
        <Grid>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Gender
          </Typography>
          <Dropdown
            menuItems={genderItems}
            defaultSelectedItem={"Male"}
            width="11.5rem"
            height="2.5rem"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            selectedValue={gender}
            setSelectedValue={setGender}
          />
        </Grid>
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
          message="must be less than 11 digits"
          error={errors.phone}
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
          message="must be greater than 0"
          error={errors.ssid}
        />

        <Grid>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Role
          </Typography>
          <Dropdown
            menuItems={menuItems}
            defaultSelectedItem={"Manager"}
            width="11.5rem"
            height="2.5rem"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </Grid>
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
          disabled={!isFormValid()}
        />
      </Grid>
    </Grid>
  );
}

export default ModelInfo;
