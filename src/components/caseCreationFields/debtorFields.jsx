import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import TextButton from "../button";

export default function DebtorFields() {
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
            label="Company Name"
            placeHolderValue="Company"
            width="100%"
          />
          <PaymentsTextFields
            label="EIN Number"
            placeHolderValue="32-2124444"
            width="100%"
          />
          <PaymentsTextFields
            label="Business Category"
            placeHolderValue="Lorem Ipsum"
            width="100%"
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
            Description
          </Typography>
          <input
            type="text"
            placeholder="Lorem Ipsum"
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
            label="Country"
            placeHolderValue="721-07-4426"
            width="100%"
          />
          <PaymentsTextFields
            label="State"
            placeHolderValue="Lorem Ipsum"
            width="100%"
          />
          <PaymentsTextFields
            label="City"
            placeHolderValue="Name"
            width="100%"
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
            label="Zip Code"
            placeHolderValue="+1"
            width="100%"
          />
          <PaymentsTextFields
            label="Phone #"
            placeHolderValue="8143008957"
            width="100%"
          />
          <PaymentsTextFields
            label="Address"
            placeHolderValue="Lorem Ipsum"
            width="100%"
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
            label="Full Name"
            placeHolderValue="John Deo"
            width="100%"
          />
          <PaymentsTextFields
            label="Email Address"
            placeHolderValue="user@email.com"
            width="100%"
          />
          <PaymentsTextFields
            label="Business Category"
            placeHolderValue="Lorem Ipsum"
            width="100%"
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
            Description
          </Typography>

          <input
            type="text"
            placeholder="Lorem Ipsum"
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
            label="Country"
            placeHolderValue="721-07-4426"
            width="100%"
          />
          <PaymentsTextFields
            label="State"
            placeHolderValue="Lorem Ipsum"
            width="100%"
          />
          <PaymentsTextFields
            label="City"
            placeHolderValue="Name"
            width="100%"
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
            label="Zip Code"
            placeHolderValue="+1"
            width="100%"
          />
          <PaymentsTextFields
            label="Phone #"
            placeHolderValue="8143008957"
            width="100%"
          />
          <PaymentsTextFields
            label="Address"
            placeHolderValue="Lorem Ipsum"
            width="100%"
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
            startIcon={<AddIcon />}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
          />
        </Grid>
        <Grid container item xs={12}>
          <Grid container item xs={12} md={8}>
            <PaymentsTextFields
              label="Name"
              placeHolderValue="John Deo"
              width="97%"
            />
            <PaymentsTextFields
              label="Title"
              placeHolderValue="John Deo"
              width="97%"
            />
            <PaymentsTextFields
              label="Phone"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Email"
              placeHolderValue="user@email.com"
              width="97%"
            />

            <PaymentsTextFields
              label="Country (Optional)"
              placeHolderValue="Lorem Ipsum"
              width="97%"
            />
            <PaymentsTextFields
              label="State (Optional)"
              placeHolderValue="Lorem Ipsum"
              width="97%"
            />
            <PaymentsTextFields
              label="City (Optional)"
              placeHolderValue="Lorem Ipsum"
              width="97%"
            />
            <PaymentsTextFields
              label="Zip Code (Optional)"
              placeHolderValue="Lorem Ipsum"
              width="97%"
            />
          </Grid>
          <Grid container item xs={12} md={4} sx={{ flexDirection: "column" }}>
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
              placeholder="Lorem Ipsum"
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
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
