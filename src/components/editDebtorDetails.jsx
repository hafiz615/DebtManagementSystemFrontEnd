import React, { useState } from "react";

import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import PaymentsTextFields from "./caseTextField";
import Dropdown from "./dropdown";

export default function EditDebtorDetail({
  handleClose,
  selectedValue,
  setSelectedValue,
}) {
  const menuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankrupcy", value: "Declared Bankrupcy" },
  ];
  // const isEmailValid = (email) => {
  //   // Use a more robust email validation regular expression
  //   const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  //   return emailRegex.test(email);
  // };
  const [editDebtor, setEditDebtor] = useState("");
  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>
      <Grid
        item
        xs={12}
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
          Personal Details
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
            // value={debtorOwnDetails?.BasicFullName}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicFullName", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="100%"
            // value={debtorOwnDetails?.BasicEmailAddress}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicEmailAddress", e.target.value)
            // }
            // error={errors?.emailValid}
          />
          <PaymentsTextFields
            type="text"
            label="SSN*"
            placeHolderValue="Enter SSN"
            width="100%"
            // value={debtorOwnDetails?.BasicSsid}
            // onChange={(e) => basicInfoInputChange("BasicSsid", e.target.value)}
            // onKeyDown={handleNumberInput}
            // error={errors?.ssn}
          />
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
            placeholder="Choose Status"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            selectedValue={editDebtor}
            setSelectedValue={setEditDebtor}
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
            // value={debtorOwnDetails?.BasicCountry}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicCountry", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            // value={debtorOwnDetails?.BasicState}
            // onChange={(e) => basicInfoInputChange("BasicState", e.target.value)}
          />
          <PaymentsTextFields
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            // value={debtorOwnDetails?.BasicCity}
            // onChange={(e) => basicInfoInputChange("BasicCity", e.target.value)}
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
            // value={debtorOwnDetails?.BasicZipCode}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicZipCode", e.target.value)
            // }
            // onKeyDown={handleNumberInput}
          />
          <PaymentsTextFields
            // type="number"
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            // value={debtorOwnDetails?.BasicPhoneNumber}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicPhoneNumber", e.target.value)
            // }
            // error={errors?.basicPhone}
            // onKeyDown={handleNumberInputKeyDown}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            // value={debtorOwnDetails?.BasicAddress}
            // onChange={(e) =>
            //   basicInfoInputChange("BasicAddress", e.target.value)
            // }
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
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
            // value={debtorBusinessDetails?.businessCompanyName}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCompanyName", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="number"
            label="EIN Number*"
            placeHolderValue="Enter Ein Number"
            width="100%"
            // value={debtorBusinessDetails?.businessEinNumber}
            // onKeyDown={handleNumberInput}
            // onChange={(e) =>
            //   businessInfoInputChange("businessEinNumber", e.target.value)
            // }
            // error={errors?.einNumber}
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Business Category"
            width="100%"
            // value={debtorBusinessDetails?.businessCategory}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCategory", e.target.value)
            // }
          />
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
            // value={debtorBusinessDetails?.businessDescription}
            // onChange={(e) =>
            //   businessInfoInputChange("businessDescription", e.target.value)
            // }
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
            // value={debtorBusinessDetails?.businessCountry}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCountry", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="State*"
            placeHolderValue="Enter State Name"
            width="100%"
            // value={debtorBusinessDetails?.businessState}
            // onChange={(e) =>
            //   businessInfoInputChange("businessState", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="City*"
            placeHolderValue="Enter City Name"
            width="100%"
            // value={debtorBusinessDetails?.businessCity}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCity", e.target.value)
            // }
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
            // value={debtorBusinessDetails?.businessZipCode}
            // onChange={(e) =>
            //   businessInfoInputChange("businessZipCode", e.target.value)
            // }
            // onKeyDown={handleNumberInput}
          />
          <PaymentsTextFields
            // type="number"
            type="text"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="100%"
            // value={debtorBusinessDetails?.businessPhoneNumber}
            // onChange={(e) =>
            //   businessInfoInputChange("businessPhoneNumber", e.target.value)
            // }
            // error={errors?.businessPhone}
            // onKeyDown={handleNumberInputKeyDown}
          />
          <PaymentsTextFields
            type="text"
            label="Address*"
            placeHolderValue="Add Your Address"
            width="100%"
            // value={debtorBusinessDetails?.businessAddress}
            // onChange={(e) =>
            //   businessInfoInputChange("businessAddress", e.target.value)
            // }
          />
        </Grid>
      </Grid>
      <Grid container sx={{ justifyContent: "right" }}>
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </Grid>
    </>
  );
}
