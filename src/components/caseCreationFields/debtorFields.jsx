import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Add } from "@mui/icons-material";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import TextButton from "../button";
import Dropdown from "./../dropdown";
import Checkboxes from "../checkBox";

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
}) {
  const menuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankrupcy", value: "Declared Bankrupcy" },
  ];
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
      if (value.length !== 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          basicPhone: "",
        }));
      }
    }
    if (
      fieldName === "BasicSsid" ||
      fieldName === "BasicZipCode" ||
      fieldName === "BasicPhoneNumber"
    ) {
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
      if (value.length !== 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          businessPhone: "Phone number must be 10 digits",
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

    if (
      fieldName === "businessEinNumber" ||
      fieldName === "businessPhoneNumber " ||
      fieldName === "businessZipCode"
    ) {
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
      if (value.length !== 10) {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: "Phone number must be 10 digits",
        }));
      } else {
        setContactErrors((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: "",
        }));
      }
    }
    if (field === "phone" || field === "zipCode") {
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
        }}
      >
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
          Debtor Details
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            item
            xs={4}
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
              Status*
            </Typography>

            <Dropdown
              menuItems={menuItems}
              menuWidth="11.7rem"
              placeholder="Choose Status"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="98%"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
          </Grid>
          <Grid
            container
            item
            xs={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                marginLeft: "0.5rem",
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
          <PaymentsTextFields
            // type="number"
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            value={debtorOwnDetails?.BasicPhoneNumber}
            onChange={(e) =>
              basicInfoInputChange("BasicPhoneNumber", e.target.value)
            }
            error={errors?.basicPhone}
            onKeyDown={handleNumberInputKeyDown}
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
            marginTop: "0.5rem",
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
          <PaymentsTextFields
            // type="number"
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            value={debtorBusinessDetails?.businessPhoneNumber}
            onChange={(e) =>
              businessInfoInputChange("businessPhoneNumber", e.target.value)
            }
            error={errors?.businessPhone}
            onKeyDown={handleNumberInputKeyDown}
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
          <TextButton
            buttonText="ADD CONTACT"
            startIcon={<Add />}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            onClick={handleAddNewContact}
          />
        </Grid>
        {debtorContactDetails &&
          debtorContactDetails?.map((item, index) => {
            return (
              <>
                <Grid key={index} container item xs={12}>
                  <Grid container item xs={12} md={8}>
                    <PaymentsTextFields
                      type="text"
                      label="Name"
                      placeHolderValue="Enter Name"
                      width="97%"
                      value={item?.name}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="text"
                      label="Title"
                      placeHolderValue="Enter Title"
                      width="97%"
                      value={item?.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="number"
                      label="Phone"
                      placeHolderValue="Enter Phone Number"
                      width="97%"
                      value={item?.phone}
                      onChange={(e) =>
                        handleInputChange(index, "phone", e.target.value)
                      }
                      error={contactError?.[`phone${index}`]}
                      onKeyDown={handleNumberInputKeyDown}
                    />
                    <PaymentsTextFields
                      type="text"
                      label="Enter Email"
                      placeHolderValue="Enter Email"
                      width="97%"
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
                      width="97%"
                      value={item?.country}
                      onChange={(e) =>
                        handleInputChange(index, "country", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="text"
                      label="State (Optional)"
                      placeHolderValue="Enter State"
                      width="97%"
                      value={item?.state}
                      onChange={(e) =>
                        handleInputChange(index, "state", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      label="City (Optional)"
                      placeHolderValue="Enter City"
                      width="97%"
                      value={item?.city}
                      onChange={(e) =>
                        handleInputChange(index, "city", e.target.value)
                      }
                    />
                    <PaymentsTextFields
                      type="number"
                      label="Zip Code (Optional)"
                      placeHolderValue="Enter Zip Code"
                      width="97%"
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
                        width: "80%",
                      }}
                    />
                    {index !== 0 && (
                      <>
                        <TextButton
                          buttonText="DELETE CONTACT"
                          backgroundColor={Colors.ORANGE_COLOR}
                          hoverColor={Colors.ORANGE_COLOR}
                          onClick={() => handleRemoveNewData(index)}
                          width="40%"
                          marginTop="1.5rem"
                        />
                      </>
                    )}
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
