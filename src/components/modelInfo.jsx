import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import TextButton from "./button";
import CustomTextField from "./customTextfield";
import { CreateUser, GetUserById, UpdateUser } from "../services/services";
import { useToast } from "../toast/toastContext";
import Dropdown from "./dropdown";
import { Colors } from "../config/default";
import MuiPhoneNumber from "material-ui-phone-number";
import { PhoneValidation } from "../constants/appConstants";
import { formatPhoneNumber } from "../common";

function ModelInfo({ modalType, setOpen, GetUsers, id }) {
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const largeScreen = useMediaQuery("(min-width:1850px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [selectedValue, setSelectedValue] = useState("");
  const [gender, setGender] = useState("");
  const [gettingUser, setGettingUser] = useState(false);
  const { showToast } = useToast();
  const getUser = async () => {
    setGettingUser(true);
    const res = await GetUserById(id);
    if (res?.status === 200) {
      const formattedDate = res?.data?.data?.dateOfBirth
        ? new Date(res?.data?.data?.dateOfBirth).toISOString().split("T")[0]
        : "";
      setFormData({
        userName: res?.data?.data?.name,
        email: res?.data?.data?.email,
        phone: res?.data?.data?.phone,
        dob: formattedDate,
        ssid: res?.data?.data?.SSID,
        address: res?.data?.data?.address,
      });
      setGender(res?.data?.data?.gender);
      setSelectedValue(res?.data?.data?.role);
    }
    setGettingUser(false);
  };
  useEffect(() => {
    if (id) {
      getUser();
    }
  }, [id]);
  const menuItems = [
    { label: "Manager", value: "Manager" },
    { label: "Negotiator", value: "Negotiator" },
    // { label: "Admin", value: "Admin" },
  ];
  const genderItems = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

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
      if (value.length !== PHONE_NO_CHARACTERS) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: PHONE_NO_ERROR,
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
    if (field === "ssid") {
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
      createdBy: role,
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
  const handleEdit = async () => {
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
    };
    const editUser = await UpdateUser(params);
    if (editUser?.status === 200) {
      showToast(editUser?.data?.message, "success");
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
      showToast(
        editUser?.response?.data?.message || editUser?.data?.message,
        "error"
      );
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
        {modalType === "edit" ? "Edit User" : "Add User"}
      </Typography>

      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: "space-between",
          marginTop: "2rem",
          height: "40vh",
        }}
      >
        {gettingUser ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <>
            <CustomTextField
              label="User Name*"
              placeHolderValue="Enter Name"
              type="text"
              width={smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem"}
              onChange={(e) => handleInputChange("userName", e.target.value, e)}
              value={formData?.userName}
            />
            <div
              style={{
                width: smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem",
              }}
            >
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
                menuWidth="10rem"
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
              disabled={modalType === "edit"}
              label="Email*"
              type="text"
              width={smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem"}
              placeHolderValue="Enter Valid Email"
              onChange={(e) => handleInputChange("email", e.target.value, e)}
              value={formData?.email}
            />
            {/* <CustomTextField
              label="Phone #*"
              type="number"
              width={smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem"}
              placeHolderValue="Enter Phone"
              onChange={(e) => handleInputChange("phone", e.target.value, e)}
              error={errors?.phone}
              value={formData?.phone}
              onKeyDown={handleNumberInputKeyDown}
            /> */}
            <Box>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontFamily: "Nunito",
                  marginLeft: "1rem",
                  color: Colors.DARK_GRAY,
                }}
              >
                Phone #*
              </Typography>
              <MuiPhoneNumber
                sx={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  paddingLeft: ".4rem",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  width: smallScreen
                    ? "15rem"
                    : largeScreen
                    ? "20rem"
                    : "10rem",
                  border: "none !important",
                  "& .MuiInputBase-input": {
                    color: Colors.DIM_LIGHT_GRAY,
                    fontSize: ".8rem",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottom: "none",
                  },
                }}
                value={formData?.phone}
                variant="standard"
                defaultCountry={"us"}
                disableDropdown={false}
                onChange={(e) =>
                  handleInputChange("phone", formatPhoneNumber(e))
                }
                onKeyDown={handleNumberInputKeyDown}
              />
              {errors?.phone ? (
                <Box
                  sx={{
                    color: "red",
                    fontSize: "9.3px",
                    height: smallScreen ? "0.5rem" : "0.7rem",
                  }}
                >
                  {errors?.phone}
                </Box>
              ) : (
                <Box
                  sx={{
                    color: "red",
                    height: smallScreen ? "0.5rem" : "0.7rem",
                  }}
                ></Box>
              )}
            </Box>

            <Grid
              container
              item
              xs={12}
              sx={{
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  width: smallScreen
                    ? "15rem"
                    : largeScreen
                    ? "20rem"
                    : "10rem",
                }}
              >
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
                disabled={modalType === "edit"}
                label="SSN*"
                type="number"
                width={smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem"}
                placeHolderValue="Enter SSN"
                onChange={(e) => handleInputChange("ssid", e.target.value, e)}
                value={formData?.ssid}
                error={errors?.ssid}
                onKeyDown={handleNumberInput}
              />

              <div
                style={{
                  width: smallScreen
                    ? "15rem"
                    : largeScreen
                    ? "20rem"
                    : "10rem",
                }}
              >
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
                  menuWidth="10rem"
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
                width={smallScreen ? "15rem" : largeScreen ? "20rem" : "10rem"}
                placeHolderValue="Enter Address"
                onChange={(e) =>
                  handleInputChange("address", e.target.value, e)
                }
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
                buttonText={modalType === "edit" ? "UPDATE" : "ADD"}
                height="2rem"
                marginBottom="2rem"
                width="4.5rem"
                onClick={modalType === "edit" ? handleEdit : handleSubmit}
                disabled={!isFormValid()}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default ModelInfo;
