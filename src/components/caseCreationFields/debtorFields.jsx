import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import Dropdown from "./../dropdown";
import Checkboxes from "../checkBox";
import { PhoneValidation } from "../../constants/appConstants";
import AmountTextField from "../amountTextField";
import { GetAllStatuses } from "../../services/services";

import { isEmailValid, handleNumberInput } from "../../common";

export default function DebtorFields({
  debtorOwnDetails,
  setDebtorOwnDetails,
  debtorBusinessDetails,
  setDebtorBusinessDetails,
  debtorContactDetails,
  setDebtorContactDetails,
  selectedValue,
  setSelectedValue,
  checked,
  setChecked,
  errors,
  setErrors,
  setContactErrors,
  contactError,
  emailContactError,
  setEmailContactError,
  show,
  showFieldError,
  misMatches,
  businessType,
  setBusinessType,
}) {
  const [menuItems, setMenuItems] = useState([]);

  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const GetStatuses = async () => {
    const AllStatuses = await GetAllStatuses();
    if (AllStatuses?.status === 200) {
      setMenuItems(AllStatuses?.data?.data?.status);
    }
  };

  const menu = menuItems?.map((name) => ({
    label: name,
    value: name,
  }));
  const industryTypes = [
    { label: "Construction", value: "Construction" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Media", value: "Media" },
    { label: "Transportation", value: "Transportation" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => {
    GetStatuses();
  }, []);

  const basicInfoInputChange = (fieldName, value) => {
    if (fieldName === "BasicEmailAddress") {
      if (!isEmailValid(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailValid: "Email must be valid",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailValid: "",
        }));
      }
    }
    if (fieldName === "BasicSsid") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssn: "SSN must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ssn: "",
        }));
      }
    }
    if (fieldName === "BasicPhoneNumber") {
      if (value?.length !== PHONE_NO_CHARACTERS) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: PHONE_NO_ERROR,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: "",
        }));
      }
    }
    if (fieldName === "BasicSsid" || fieldName === "BasicZipCode") {
      const inputValue = value;
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        setDebtorOwnDetails((prevDetails) => ({
          ...prevDetails,
          [fieldName]: value,
        }));
      }
    } else {
      setDebtorOwnDetails((prevDetails) => ({
        ...prevDetails,
        [fieldName]: value,
      }));
    }
  };

  const businessInfoInputChange = (fieldName, value) => {
    if (fieldName === "businessPhoneNumber") {
      if (value.length !== PHONE_NO_CHARACTERS) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          businessPhone: PHONE_NO_ERROR,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          businessPhone: "",
        }));
      }
    }
    if (fieldName === "businessEinNumber") {
      if (value.length !== 9) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          einNumber: "EIN must be 9 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          einNumber: "",
        }));
      }
    }

    if (fieldName === "businessEinNumber" || fieldName === "businessZipCode") {
      const inputValue = value;
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        setDebtorBusinessDetails((prevDetails) => ({
          ...prevDetails,
          [fieldName]: value,
        }));
      }
    } else {
      setDebtorBusinessDetails((prevDetails) => ({
        ...prevDetails,
        [fieldName]: value,
      }));
    }
  };

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setDebtorBusinessDetails((prevDetails) => ({
        ...prevDetails,
        businessState: debtorOwnDetails?.BasicState,
        businessCity: debtorOwnDetails?.BasicCity,
        businessZipCode: debtorOwnDetails?.BasicZipCode,
        businessPhoneNumber: debtorOwnDetails?.BasicPhoneNumber,
        businessAddress: debtorOwnDetails?.BasicAddress,
      }));
    }
  };
  const handleAddNewContact = () => {
    const newContact = {
      name: "",
      title: "",
      phone: "",
      email: "",
    };
    setDebtorContactDetails([...debtorContactDetails, newContact]);
  };
  const handleRemoveNewData = (index) => {
    const updatedList = [...debtorContactDetails];
    updatedList.splice(index, 1);
    setDebtorContactDetails(updatedList);
  };

  const handleInputChange = (index, field, value) => {
    const updatedList = [...debtorContactDetails];
    if (field === "email") {
      if (!isEmailValid(value)) {
        setEmailContactError((prevErrors) => ({
          ...prevErrors,
          [`email${index}`]: "Email must be Valid",
        }));
      } else {
        setEmailContactError((prevErrors) => ({
          ...prevErrors,
          [`email${index}`]: "",
        }));
      }
    }
    if (field === "phone") {
      if (value.length !== PHONE_NO_CHARACTERS) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: PHONE_NO_ERROR,
        }));
      } else {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: "",
        }));
      }
    }
    if (field === "zipCode") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        updatedList[index][field] = value;
        setDebtorContactDetails(updatedList);
      }
    } else {
      updatedList[index][field] = value;
      setDebtorContactDetails(updatedList);
    }
  };

  return (
    <>
      <Grid
        item
        xs={12}
        xl={5.9}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          padding: "1rem",
          height: { xs: "max-content", xl: "390px" },
        }}
      >
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ fontFamily: "Nunito", fontWeight: "600" }}
            gutterBottom
          >
            Client Details
          </Typography>
          {/* {walletId === "" && ( */}
        </Grid>

        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Your Name"
            width="100%"
            value={debtorOwnDetails?.BasicFullName}
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicFullName", e.target.value)
            }
            border={
              debtorOwnDetails?.BasicFullName === "" ||
              debtorOwnDetails?.BasicFullName === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicFullName && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            value={debtorOwnDetails?.BasicEmailAddress}
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicEmailAddress", e.target.value)
            }
            error={errors?.emailValid}
            border={
              debtorOwnDetails?.BasicEmailAddress === "" ||
              debtorOwnDetails?.BasicEmailAddress === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicEmailAddress && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
          <PaymentsTextFields
            type="number"
            label="SSN*"
            placeHolderValue="Enter SSN"
            width="100%"
            value={debtorOwnDetails?.BasicSsid || ""}
            onChangeFunction={(e) => {
              const newValue = e.target.value;
              basicInfoInputChange("BasicSsid", newValue);
            }}
            onKeyDown={handleNumberInput}
            error={errors?.ssn}
            border={
              debtorOwnDetails?.BasicSsid === "" ||
              debtorOwnDetails?.BasicSsid === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicSsid && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
        </Grid>

        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Street Address*"
            placeHolderValue="Add Your Street Address"
            width="100%"
            marginLeft="1px"
            value={debtorOwnDetails?.BasicAddress}
            border={
              debtorOwnDetails?.BasicAddress === "" ||
              debtorOwnDetails?.BasicAddress === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicAddress && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicAddress", e.target.value)
            }
          />
          <PaymentsTextFields
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            value={debtorOwnDetails?.BasicCity}
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicCity", e.target.value)
            }
            border={
              debtorOwnDetails?.BasicCity === "" ||
              debtorOwnDetails?.BasicCity === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicCity && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            value={debtorOwnDetails?.BasicState}
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicState", e.target.value)
            }
            border={
              debtorOwnDetails?.BasicState === "" ||
              debtorOwnDetails?.BasicState === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicState && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            marginTop: "0.5rem",
            gap: "1.2%",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            value={debtorOwnDetails?.BasicZipCode}
            onChangeFunction={(e) =>
              basicInfoInputChange("BasicZipCode", e.target.value)
            }
            border={
              debtorOwnDetails?.BasicZipCode === "" ||
              debtorOwnDetails?.BasicZipCode === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicZipCode && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            onKeyDown={handleNumberInput}
          />
          <PaymentsTextFields
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            value={
              debtorOwnDetails?.BasicPhoneNumber
                ? debtorOwnDetails.BasicPhoneNumber.startsWith("+1")
                  ? debtorOwnDetails.BasicPhoneNumber.slice(2)
                  : debtorOwnDetails.BasicPhoneNumber
                : ""
            }
            border={
              debtorOwnDetails?.BasicPhoneNumber === "" ||
              debtorOwnDetails?.BasicPhoneNumber === undefined
                ? "2px solid red"
                : "auto" && misMatches?.BasicPhoneNumber && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            onChangeFunction={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              basicInfoInputChange("BasicPhoneNumber", numericValue);
            }}
            error={errors?.basicPhone}
            onKeyDown={handleNumberInput}
          />

          <div style={{ marginTop: "1rem" }}>
            <Checkboxes
              checked={checked}
              handleCheckChange={handleCheckChange}
              fontSize="28"
            />
          </div>

          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "500",
              fontFamily: "Nunito",
              color: Colors.DARK_GRAY,
            }}
          >
            Same for business
          </Typography>

          <Grid container xs={12}>
            <Grid
              container
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
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
                Status*
              </Typography>

              <Dropdown
                height="2.5rem"
                menuItems={menu}
                menuWidth="11.7rem"
                placeholder="Choose Status"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width={smallScreen ? "100%" : "98%"}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                showCaseStatus={selectedValue === "" && true}
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={4}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontFamily: "Nunito",
                  marginLeft: "1rem",
                  color: Colors.DARK_GRAY,
                }}
              >
                Weekly Budget
              </Typography>

              <AmountTextField
                width="98%"
                marginLeft=".2rem"
                value={debtorOwnDetails?.BasicWeeklyBudget}
                onChange={(e) => {
                  basicInfoInputChange("BasicWeeklyBudget", e.target.value);
                }}
                onKeyDown={handleNumberInput}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        xl={5.9}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          padding: "1rem",
          height: { xs: "max-content", xl: "390px" },
        }}
      >
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
          Business Information
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Company Name*"
            placeHolderValue="Enter Company Name"
            width="100%"
            value={debtorBusinessDetails?.businessCompanyName}
            border={
              debtorBusinessDetails?.businessCompanyName === "" ||
              debtorBusinessDetails?.businessCompanyName === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessCompanyName && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            onChangeFunction={(e) =>
              businessInfoInputChange("businessCompanyName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="number"
            label="EIN Number*"
            placeHolderValue="Enter Ein Number"
            width="100%"
            value={debtorBusinessDetails?.businessEinNumber}
            onKeyDown={handleNumberInput}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessEinNumber", e.target.value)
            }
            border={
              debtorBusinessDetails?.businessEinNumber === "" ||
              debtorBusinessDetails?.businessEinNumber === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessEinNumber && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            error={errors?.einNumber}
          />

          <Grid item xs={12} md={3.9}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Industry Types
            </Typography>

            <Dropdown
              height="2.5rem"
              menuItems={industryTypes}
              menuWidth="11.7rem"
              placeholder="Choose Type"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width={smallScreen ? "100%" : "98%"}
              selectedValue={businessType}
              setSelectedValue={setBusinessType}
              showCaseStatus={businessType === "" && true}
            />
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: show === "Edit" ? "0.5rem" : "1.2rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Street Address*"
            placeHolderValue="Add Your Street Address"
            width="100%"
            border={
              debtorBusinessDetails?.businessAddress === "" ||
              debtorBusinessDetails?.businessAddress === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessAddress && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            value={debtorBusinessDetails?.businessAddress}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessAddress", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            border={
              debtorBusinessDetails?.businessCity === "" ||
              debtorBusinessDetails?.businessCity === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessCity && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            value={debtorBusinessDetails?.businessCity}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessCity", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            border={
              debtorBusinessDetails?.businessState === "" ||
              debtorBusinessDetails?.businessState === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessState && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            value={debtorBusinessDetails?.businessState}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessState", e.target.value)
            }
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            marginTop: "0.5rem",
            gap: "1.2%",
          }}
        >
          <PaymentsTextFields
            type="number"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            border={
              debtorBusinessDetails?.businessZipCode === "" ||
              debtorBusinessDetails?.businessZipCode === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessZipCode && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            value={debtorBusinessDetails?.businessZipCode}
            onChangeFunction={(e) =>
              businessInfoInputChange("businessZipCode", e.target.value)
            }
            onKeyDown={handleNumberInput}
          />
          {/* <PaymentsTextFields
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            value={
              debtorBusinessDetails?.businessPhoneNumber
                ? debtorBusinessDetails.businessPhoneNumber.startsWith("+1")
                  ? debtorBusinessDetails.businessPhoneNumber.slice(2)
                  : debtorBusinessDetails.businessPhoneNumber
                : ""
            }
            border={
              debtorBusinessDetails?.businessPhoneNumber === "" ||
              debtorBusinessDetails?.businessPhoneNumber === undefined
                ? "2px solid red"
                : "auto" && misMatches?.businessPhoneNumber && showFieldError
                ? "2px solid red"
                : "1px solid transparent"
            }
            onChangeFunction={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              businessInfoInputChange("businessPhoneNumber", numericValue);
            }}
            error={errors?.businessPhone}
            onKeyDown={handleNumberInput}
          /> */}
        </Grid>
      </Grid>

      {show !== "Edit" && (
        <Grid
          item
          xs={12}
          sx={{
            marginTop: "1rem",
            borderRadius: "10px",
            backgroundColor: Colors.WHITE,
            padding: "1rem",
          }}
        >
          <Grid
            container
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontFamily: "Nunito", fontWeight: "600" }}
              gutterBottom
            >
              Additional Contract
            </Typography>
            <Add
              onClick={handleAddNewContact}
              sx={{
                backgroundColor: Colors.SKY_BLUE,
                color: Colors.WHITE,
                borderRadius: "50%",
                fontSize: "2.5rem",
                padding: ".4rem",
                cursor: "pointer",
              }}
            />
          </Grid>
          {debtorContactDetails &&
            debtorContactDetails?.map((item, index) => {
              return (
                <>
                  {index !== 0 && (
                    <Box
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Delete
                        onClick={() => handleRemoveNewData(index)}
                        sx={{
                          backgroundColor: Colors.ORANGE_COLOR,
                          color: Colors.WHITE,
                          borderRadius: "50%",
                          fontSize: "2.5rem",
                          padding: ".4rem",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                  )}
                  <Grid key={index} container item xs={12}>
                    <Grid container item xs={12} md={12}>
                      <PaymentsTextFields
                        type="text"
                        label="Name"
                        placeHolderValue="Enter Name"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.name}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                      <PaymentsTextFields
                        type="text"
                        label="Title"
                        placeHolderValue="Enter Title"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.title}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                      />
                      <PaymentsTextFields
                        type="text"
                        label="Phone #"
                        placeHolderValue="Enter Phone Number"
                        width="100%"
                        value={
                          item?.phone
                            ? item?.phone.startsWith("+1")
                              ? item?.phone.slice(2)
                              : item?.phone
                            : ""
                        }
                        onChangeFunction={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          handleInputChange(index, "phone", numericValue);
                        }}
                        error={contactError?.[`phone${index}`]}
                        onKeyDown={handleNumberInput}
                      />

                      <PaymentsTextFields
                        type="text"
                        label="Enter Email"
                        placeHolderValue="Enter Email"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.email}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "email", e.target.value)
                        }
                        error={emailContactError?.[`email${index}`]}
                      />
                      {/* <PaymentsTextFields
                        type="text"
                        label="State (Optional)"
                        placeHolderValue="Enter State"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.state}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "state", e.target.value)
                        }
                      /> */}
                      {/* <PaymentsTextFields
                        label="City (Optional)"
                        placeHolderValue="Enter City"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.city}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "city", e.target.value)
                        }
                      /> */}
                      {/* <PaymentsTextFields
                        type="number"
                        label="Zip Code (Optional)"
                        placeHolderValue="Enter Zip Code"
                        width={smallScreen ? "100%" : "97%"}
                        value={item?.zipCode}
                        onChangeFunction={(e) =>
                          handleInputChange(index, "zipCode", e.target.value)
                        }
                        onKeyDown={handleNumberInput}
                      /> */}
                    </Grid>
                    {/* <Grid
                      container
                      item
                      xs={12}
                      md={4}
                      sx={{ flexDirection: "column" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "500",
                          fontFamily: "Nunito",
                          marginLeft: "1rem",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        Relation with Client(Optional)
                      </Typography>
                      <input
                        type="text"
                        placeholder="Relation"
                        value={item?.relationWithDebtor}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "relationWithDebtor",
                            e.target.value
                          )
                        }
                        style={{
                          backgroundColor: Colors.BG_LIGHT_GRAY,
                          height: "2.5rem",
                          color: Colors.DIM_LIGHT_GRAY,
                          paddingLeft: "1rem",
                          border: "none",
                          outline: "none",
                          borderRadius: "5px",
                          width: smallScreen ? "100%" : "97%",
                        }}
                      />
                    </Grid> */}
                  </Grid>
                  <hr></hr>
                </>
              );
            })}
        </Grid>
      )}
    </>
  );
}
