import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import Dropdown from "./../dropdown";
import Checkboxes from "../checkBox";
import MuiPhoneTextField from "../muiPhoneText";
import { PhoneValidation } from "../../constants/appConstants";
import { formatPhoneNumber } from "../../common";
import AmountTextField from "../amountTextField";
import PaymentCardDetails from "../paymentCard";
import { GetAllStatuses } from "../../services/services";

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
  connectPayment,
  setConnectPayment,
  walletId,
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

  useEffect(() => {
    GetStatuses();
  }, []);
  // const menuItems = [
  //   { label: "Customer", value: "Customer" },
  //   { label: "On hold", value: "On hold" },
  //   { label: "Canceled", value: "Canceled" },
  //   { label: "Declared Bankrupcy", value: "Declared Bankrupcy" },
  // ];

  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

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
        businessCountry: debtorOwnDetails?.BasicCountry,
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
      country: "",
      state: "",
      city: "",
      zipCode: "",
      relationWithDebtor: "",
    };
    setDebtorContactDetails([...debtorContactDetails, newContact]);
  };
  const handleRemoveNewData = (index) => {
    const updatedList = [...debtorContactDetails];
    updatedList.splice(index, 1); // Remove item at the specified index in the copy
    setDebtorContactDetails(updatedList); // Update state with the modified copy
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
  const handleNumberInputKeyDown = (e) => {
    const invalidChars = ["e", "E", ".", "-"];
    const allowedKeys = [
      "+",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const handleNumberInput = (e) => {
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
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
            Debtor Details
          </Typography>
          {walletId === "" && (
            <PaymentCardDetails
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
            />
          )}
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
            onChange={(e) =>
              basicInfoInputChange("BasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            value={debtorOwnDetails?.BasicEmailAddress}
            onChange={(e) =>
              basicInfoInputChange("BasicEmailAddress", e.target.value)
            }
            error={errors?.emailValid}
          />
          <PaymentsTextFields
            type="text"
            label="SSN*"
            placeHolderValue="Enter SSN"
            width="100%"
            value={debtorOwnDetails?.BasicSsid}
            onChange={(e) => basicInfoInputChange("BasicSsid", e.target.value)}
            onKeyDown={handleNumberInput}
            error={errors?.ssn}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            justifyContent: "center",
            marginBottom: "0.5rem",
          }}
        >
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
              Weekly Budget*
            </Typography>

            <AmountTextField
              width="98%"
              marginLeft=".2rem"
              value={debtorOwnDetails?.BasicWeeklyBudget}
              onChange={(e) =>
                basicInfoInputChange("BasicWeeklyBudget", e.target.value)
              }
              onKeyDown={handleNumberInput}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: ".5rem",
            }}
          >
            <Checkboxes
              checked={checked}
              handleCheckChange={handleCheckChange}
              fontSize="28"
            />
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
          </Grid>
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
            label="Country*"
            placeHolderValue="Enter Country Name"
            width="100%"
            value={debtorOwnDetails?.BasicCountry}
            onChange={(e) =>
              basicInfoInputChange("BasicCountry", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            value={debtorOwnDetails?.BasicState}
            onChange={(e) => basicInfoInputChange("BasicState", e.target.value)}
          />
          <PaymentsTextFields
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            value={debtorOwnDetails?.BasicCity}
            onChange={(e) => basicInfoInputChange("BasicCity", e.target.value)}
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
            type="number"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            value={debtorOwnDetails?.BasicZipCode}
            onChange={(e) =>
              basicInfoInputChange("BasicZipCode", e.target.value)
            }
            onKeyDown={handleNumberInput}
          />
          <MuiPhoneTextField
            label="Phone #*"
            value={debtorOwnDetails?.BasicPhoneNumber}
            onChange={(e) =>
              basicInfoInputChange("BasicPhoneNumber", formatPhoneNumber(e))
            }
            onKeyDown={handleNumberInputKeyDown}
            error={errors?.basicPhone}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            value={debtorOwnDetails?.BasicAddress}
            onChange={(e) =>
              basicInfoInputChange("BasicAddress", e.target.value)
            }
          />
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
            onChange={(e) =>
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
            onChange={(e) =>
              businessInfoInputChange("businessEinNumber", e.target.value)
            }
            error={errors?.einNumber}
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Category"
            width="100%"
            value={debtorBusinessDetails?.businessCategory}
            onChange={(e) =>
              businessInfoInputChange("businessCategory", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Nunito",
              marginLeft: "1rem",
              color: Colors.DARK_GRAY,
            }}
          >
            Description (Optional)
          </Typography>
          <input
            type="text"
            placeholder="Add Description"
            value={debtorBusinessDetails?.businessDescription}
            onChange={(e) =>
              businessInfoInputChange("businessDescription", e.target.value)
            }
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "100%",
            }}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.2rem",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Country*"
            placeHolderValue="Enter Country Name"
            width="100%"
            value={debtorBusinessDetails?.businessCountry}
            onChange={(e) =>
              businessInfoInputChange("businessCountry", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            value={debtorBusinessDetails?.businessState}
            onChange={(e) =>
              businessInfoInputChange("businessState", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            value={debtorBusinessDetails?.businessCity}
            onChange={(e) =>
              businessInfoInputChange("businessCity", e.target.value)
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
            type="number"
            label="Zip Code*"
            placeHolderValue="Enter Zip Code"
            width="100%"
            value={debtorBusinessDetails?.businessZipCode}
            onChange={(e) =>
              businessInfoInputChange("businessZipCode", e.target.value)
            }
            onKeyDown={handleNumberInput}
          />

          <MuiPhoneTextField
            label="Phone #*"
            value={debtorBusinessDetails?.businessPhoneNumber}
            onChange={(e) =>
              businessInfoInputChange(
                "businessPhoneNumber",
                formatPhoneNumber(e)
              )
            }
            onKeyDown={handleNumberInputKeyDown}
            error={errors?.businessPhone}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            value={debtorBusinessDetails?.businessAddress}
            onChange={(e) =>
              businessInfoInputChange("businessAddress", e.target.value)
            }
          />
        </Grid>
      </Grid>

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
            Contact Details
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
                  <Grid container item xs={12} md={8}>
                    <PaymentsTextFields
                      type="text"
                      label="Name"
                      placeHolderValue="Enter Name"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.name}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="text"
                      label="Title"
                      placeHolderValue="Enter Title"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                    />

                    <MuiPhoneTextField
                      label="Phone #"
                      value={item?.phone}
                      onChange={(e) =>
                        handleInputChange(index, "phone", formatPhoneNumber(e))
                      }
                      onKeyDown={handleNumberInputKeyDown}
                      error={contactError?.[`phone${index}`]}
                    />

                    <PaymentsTextFields
                      type="text"
                      label="Enter Email"
                      placeHolderValue="Enter Email"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.email}
                      onChange={(e) =>
                        handleInputChange(index, "email", e.target.value)
                      }
                      error={emailContactError?.[`email${index}`]}
                    />

                    <PaymentsTextFields
                      type="text"
                      label="Country (Optional)"
                      placeHolderValue="Country Name"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.country}
                      onChange={(e) =>
                        handleInputChange(index, "country", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="text"
                      label="State (Optional)"
                      placeHolderValue="Enter State"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.state}
                      onChange={(e) =>
                        handleInputChange(index, "state", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      label="City (Optional)"
                      placeHolderValue="Enter City"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.city}
                      onChange={(e) =>
                        handleInputChange(index, "city", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="number"
                      label="Zip Code (Optional)"
                      placeHolderValue="Enter Zip Code"
                      width={smallScreen ? "100%" : "97%"}
                      value={item?.zipCode}
                      onChange={(e) =>
                        handleInputChange(index, "zipCode", e.target.value)
                      }
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                  <Grid
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
                      Relation with Debtor (Optional)
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
                  </Grid>
                </Grid>
                <hr></hr>
              </>
            );
          })}
      </Grid>
    </>
  );
}
