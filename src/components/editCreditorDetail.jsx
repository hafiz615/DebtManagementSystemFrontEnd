import React from "react";

import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import PaymentsTextFields from "./caseTextField";
import TextButton from "./button";

export default function EditCreditorDetail({ handleClose }) {
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
          height: "350px",
        }}
      >
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
          Business Information
        </Typography>
        <Grid container item xs={12}>
          <PaymentsTextFields
            type="text"
            label="Company Name*"
            placeHolderValue="Enter Company Name"
            width="97%"
            // value={creditorBusinessDetails?.businessCompanyName}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCompanyName", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Category"
            width="97%"
            // value={creditorBusinessDetails?.businessCategory}
            // onChange={(e) =>
            //   businessInfoInputChange("businessCategory", e.target.value)
            // }
          />
        </Grid>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            marginTop: "1rem",
          }}
          gutterBottom
        >
          Creditor Details
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Full Name"
            width="97%"
            // value={creditorBasicsInfo?.CreditorBasicFullName}
            // onChange={(e) =>
            //   basicInfoInputChange("CreditorBasicFullName", e.target.value)
            // }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="97%"
            // value={creditorBasicsInfo?.CreditorBasicEmailAddress}
            // onChange={(e) =>
            //   basicInfoInputChange("CreditorBasicEmailAddress", e.target.value)
            // }
            // error={creditorFieldsError?.emailValidError}
          />
          <PaymentsTextFields
            type="number"
            label="Phone #*"
            placeHolderValue="Enter Phone Number"
            width="97%"
            // value={creditorBasicsInfo?.CreditorBasicPhoneNumber}
            // onChange={(e) =>
            //   basicInfoInputChange("CreditorBasicPhoneNumber", e.target.value)
            // }
            // error={creditorFieldsError?.creditorPhoneError}
            // onKeyDown={handleNumberInputKeyDown}
          />
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              marginTop: "1rem",
            }}
            gutterBottom
          >
            Notes (optional)
          </Typography>
          <input
            type="text"
            placeholder="Notes"
            // value={CreditorNotes}
            // onChange={(e) => notesInputChange(e.target.value)}
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "97%",
            }}
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
          height: "350px",
        }}
      >
        <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Funded
        </Typography>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Last Funded Date*
          </Typography>
          <PaymentsTextFields
            type="date"
            placeHolderValue="00/00/00"
            width="100%"
            // value={fundedDate}
            // onChange={(e) => fundedInputChange(e.target.value)}
            // max={today}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            marginTop: "1rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Historical Range
          </Typography>

          <Grid
            container
            item
            xs={8}
            sx={{
              marginLeft: "2rem",
            }}
          >
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginRight: ".7rem",
                }}
              >
                Minimum*
              </Typography>
              <PaymentsTextFields
                type="number"
                placeHolderValue="$"
                width="100%"
                // value={historicRange?.minimum}
                // onChange={(e) => historicInputChange("minimum", e.target.value)}
                // onKeyDown={handleNumberInput}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", marginTop: "1rem" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginRight: ".5rem",
                }}
              >
                Maximum*
              </Typography>
              <PaymentsTextFields
                type="number"
                placeHolderValue="$"
                width="100%"
                // value={historicRange?.maximum}
                // onChange={(e) => historicInputChange("maximum", e.target.value)}
                // onKeyDown={handleNumberInput}
              />
            </Grid>
          </Grid>
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
