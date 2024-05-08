import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import TextButton from "../button";

export default function CreditorFields() {
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
        <Grid container item xs={12}>
          <PaymentsTextFields
            label="Country"
            placeHolderValue="721-07-4426"
            width="97%"
          />
          <PaymentsTextFields
            label="Country"
            placeHolderValue="721-07-4426"
            width="97%"
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
            label="Country"
            placeHolderValue="721-07-4426"
            width="97%"
          />
          <PaymentsTextFields
            label="Country"
            placeHolderValue="721-07-4426"
            width="97%"
          />
          <PaymentsTextFields
            label="Country"
            placeHolderValue="721-07-4426"
            width="97%"
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
          Notes
        </Typography>
        <input
          type="text"
          placeholder="721-07-4426"
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
      <Grid
        item
        xs={12}
        xl={5.9}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          padding: "1rem",
          height: "320px",
        }}
      >
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
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
            gutterBottom
          >
            Last Funded Date
          </Typography>
          <PaymentsTextFields placeHolderValue="00/00/00" width="100%" />
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "0.5rem",
            }}
            gutterBottom
          >
            25/12/2024
          </Typography>
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
            gutterBottom
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
                gutterBottom
              >
                Minimum
              </Typography>
              <PaymentsTextFields placeHolderValue="$" width="97%" />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", marginTop: "1rem" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginRight: ".5rem",
                }}
                gutterBottom
              >
                Maximum
              </Typography>
              <PaymentsTextFields placeHolderValue="$" width="97%" />
            </Grid>
          </Grid>
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
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />

            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
              width="97%"
            />
            <PaymentsTextFields
              label="Country"
              placeHolderValue="721-07-4426"
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
              Country
            </Typography>
            <input
              type="text"
              placeholder="721-07-4426"
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
