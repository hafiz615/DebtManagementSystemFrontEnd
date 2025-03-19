import React from "react";
import { Grid, Typography } from "@mui/material";
import PaymentsTextFields from "../caseTextField";
import { Colors } from "../../config/default";

export default function LawsuitFields({
  index,
  smallScreen,
  lawsuitFields,
  setLawsuitFields,
}) {
  const handleFieldChange = (field, section) => (e) => {
    setLawsuitFields((prevFields) =>
      prevFields.map((item, i) =>
        i === index
          ? {
              ...item,
              [section]: {
                ...item[section],
                [field]: e.target.value,
              },
            }
          : item
      )
    );
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        borderRadius: "10px",
        padding: "1rem",
        backgroundColor: Colors.WHITE,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Nunito",
          marginLeft: "1rem",
          fontWeight: "600",
        }}
      >
        Lawsuit
      </Typography>
      <Grid container item xs={12}>
        <PaymentsTextFields
          type="number"
          label="Balance*"
          placeHolderValue="Enter Balance"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawsuit?.balance}
          onChangeFunction={handleFieldChange("balance", "lawsuit")}
          border={
            lawsuitFields?.[index]?.lawsuit?.balance
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          width={smallScreen ? "100%" : "97%"}
          type="date"
          label="Document Date"
          placeHolderValue="00/00/00"
          value={lawsuitFields?.[index]?.lawsuit?.document_date}
          onChangeFunction={handleFieldChange("document_date", "lawsuit")}
          border={
            lawsuitFields?.[index]?.lawsuit?.document_date
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
      </Grid>
      <Typography
        sx={{
          fontFamily: "Nunito",
          marginLeft: "1rem",
          fontWeight: "600",
        }}
      >
        Law Firm
      </Typography>
      <Grid container item xs={12}>
        <PaymentsTextFields
          type="text"
          label="Company Name*"
          placeHolderValue="Enter Company Name"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.lawfirmCompanyName}
          onChangeFunction={handleFieldChange("lawfirmCompanyName", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.lawfirmCompanyName
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="Email*"
          placeHolderValue="Enter Valid Email"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.email}
          onChangeFunction={handleFieldChange("email", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.email
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="Phone*"
          placeHolderValue="Enter Phone Number"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.phone}
          onChangeFunction={handleFieldChange("phone", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.phone
              ? "2px solid transparent"
              : "2px solid red"
          }
          error={
            lawsuitFields?.[index]?.lawfirm?.phone?.length !== 10
              ? "Phone number must be 10 digits"
              : ""
          }
        />
        <PaymentsTextFields
          type="text"
          label="Address*"
          placeHolderValue="Enter Address"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.address}
          onChangeFunction={handleFieldChange("address", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.address
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="City*"
          placeHolderValue="Enter City"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.city}
          onChangeFunction={handleFieldChange("city", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.city
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="State*"
          placeHolderValue="Enter State"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.state}
          onChangeFunction={handleFieldChange("state", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.state
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="EIN*"
          placeHolderValue="Enter EIN"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.lawfirm?.EIN}
          onChangeFunction={handleFieldChange("EIN", "lawfirm")}
          border={
            lawsuitFields?.[index]?.lawfirm?.EIN
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
      </Grid>
      <Typography
        sx={{
          fontFamily: "Nunito",
          marginLeft: "1rem",
          fontWeight: "600",
        }}
      >
        Attorney
      </Typography>
      <Grid container item xs={12}>
        <PaymentsTextFields
          type="text"
          label="Name*"
          placeHolderValue="Enter Name"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_name}
          onChangeFunction={handleFieldChange("attorney_name", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_name
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="number"
          label="Phone*"
          placeHolderValue="Enter Phone Number"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_telephone}
          onChangeFunction={handleFieldChange("attorney_telephone", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_telephone
              ? "2px solid transparent"
              : "2px solid red"
          }
          error={
            lawsuitFields?.[index]?.attorney?.attorney_telephone?.length !== 10
              ? "Phone number must be 10 digits"
              : ""
          }
        />
        <PaymentsTextFields
          type="text"
          label="Address*"
          placeHolderValue="Enter Address"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_address}
          onChangeFunction={handleFieldChange("attorney_address", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_address
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="City*"
          placeHolderValue="Enter City"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_city}
          onChangeFunction={handleFieldChange("attorney_city", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_city
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="number"
          label="SSN*"
          placeHolderValue="Enter SSN"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_SSN}
          onChangeFunction={handleFieldChange("attorney_SSN", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_SSN
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
        <PaymentsTextFields
          type="text"
          label="State*"
          placeHolderValue="Enter State"
          width={smallScreen ? "100%" : "97%"}
          value={lawsuitFields?.[index]?.attorney?.attorney_state}
          onChangeFunction={handleFieldChange("attorney_state", "attorney")}
          border={
            lawsuitFields?.[index]?.attorney?.attorney_state
              ? "2px solid transparent"
              : "2px solid red"
          }
        />
      </Grid>
    </Grid>
  );
}
