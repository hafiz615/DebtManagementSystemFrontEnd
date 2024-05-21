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
  const [selectedValue, setSelectedValue] = useState("");
  const [gender, setGender] = useState("");
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

  const handleInputChange = (field, value, event) => {
    if (field === "phone") {
      if (value.length !== 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "",
        }));
      }
    }
    if (field === "ssid") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssid: "SSN must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssid: "",
        }));
      }
    }
    if (field === "ssid" || field === "phone") {
      const inputValue = value;
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
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
      gender &&
      selectedValue &&
      !errors.phone &&
      !errors.ssid
    );
  };
  const handleNumberInputKeyDown = (e) => {
    const invalidChars = ["e", "E", ".", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const today = new Date().toISOString().split("T")[0];

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
          label="User Name*"
          placeHolderValue="Enter Name"
          type="text"
          width="10rem"
          onChange={(e) => handleInputChange("userName", e.target.value, e)}
          value={formData?.userName}
        />
        <div style={{ width: "10rem" }}>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Gender*
          </Typography>
          <Dropdown
            menuItems={genderItems}
            placeholder="Enter Gender"
            width="100%"
            height="2.5rem"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            selectedValue={gender}
            setSelectedValue={setGender}
          />
        </div>
        <CustomTextField
          label="Email*"
          type="text"
          width="10rem"
          placeHolderValue="Enter Valid Email"
          onChange={(e) => handleInputChange("email", e.target.value, e)}
          value={formData?.email}
        />
        <CustomTextField
          label="Phone #*"
          type="number"
          width="10rem"
          placeHolderValue="Enter Phone"
          onChange={(e) => handleInputChange("phone", e.target.value, e)}
          error={errors?.phone}
          value={formData?.phone}
          onKeyDown={handleNumberInputKeyDown}
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
        <div style={{ width: "10rem" }}>
          <CustomTextField
            label="DOB*"
            type="date"
            placeHolderValue="Enter DOB"
            width="100%"
            onChange={(e) => handleInputChange("dob", e.target.value, e)}
            value={formData?.dob}
            max={today}
          />
        </div>
        <CustomTextField
          label="SSN*"
          type="number"
          width="10rem"
          placeHolderValue="Enter SSN"
          onChange={(e) => handleInputChange("ssid", e.target.value, e)}
          value={formData?.ssid}
          error={errors?.ssid}
          onKeyDown={handleNumberInput}
        />

        <div style={{ width: "10rem" }}>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Role*
          </Typography>
          <Dropdown
            menuItems={menuItems}
            placeholder="Enter Role"
            height="2.5rem"
            width="100%"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
        <CustomTextField
          label="Address*"
          type="text"
          width="10rem"
          placeHolderValue="Enter Address"
          onChange={(e) => handleInputChange("address", e.target.value, e)}
          value={formData?.address}
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
