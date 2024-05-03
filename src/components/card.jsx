import * as React from "react";

import { Grid } from "@mui/material/";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import PaymentsTextFields from "./paymentsTextFields";

import { Colors } from "../config/default";
import TextButton from "./button";

export default function BasicCard({
  cardHeading,
  toShowBusiness,
  toShowDebtor,
  toShowContactDetails,
  toShowCreditorBusiness,
  toShowCreditorFunded,
}) {
  return (
    <Card
      sx={{
        borderRadius: "10px",
      }}
    >
      <CardContent>
        {toShowBusiness ? (
          <>
            <Typography
              sx={{ fontFamily: "Nunito", fontWeight: "600" }}
              gutterBottom
            >
              {cardHeading}
            </Typography>

            <Grid
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
              />
              <PaymentsTextFields
                label="EIN Number"
                placeHolderValue="32-2124444"
              />
              <PaymentsTextFields
                label="Business Category"
                placeHolderValue="Loriem Ipsum"
              />
            </Grid>
            <Grid item xs={12}>
              <PaymentsTextFields
                label="Description"
                placeHolderValue="Loriem Ipsum"
                width="100%"
              />
            </Grid>
            <Grid
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
              />
              <PaymentsTextFields
                label="State"
                placeHolderValue="Loriem Ipsumame"
              />
              <PaymentsTextFields label="City" placeHolderValue="Name" />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <PaymentsTextFields label="Zip Code" placeHolderValue="+1" />
              <PaymentsTextFields
                label="Phone #"
                placeHolderValue="8143008957"
              />
              <PaymentsTextFields
                label="Address"
                placeHolderValue="Loriem Ipsum"
              />
            </Grid>
          </>
        ) : (
          ""
        )}
        {toShowDebtor ? (
          <>
            <Typography
              sx={{ fontFamily: "Nunito", fontWeight: "600" }}
              gutterBottom
            >
              {cardHeading}
            </Typography>

            <Grid
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
              />
              <PaymentsTextFields
                label="Email Address"
                placeHolderValue="user@email.com"
              />
              <PaymentsTextFields
                label="Business Category"
                placeHolderValue="Loriem Ipsum"
              />
            </Grid>
            <Grid item xs={12}>
              <PaymentsTextFields
                label="Description"
                placeHolderValue="Loriem Ipsum"
                width="100%"
              />
            </Grid>
            <Grid
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
              />
              <PaymentsTextFields
                label="State"
                placeHolderValue="Loriem Ipsumame"
              />
              <PaymentsTextFields label="City" placeHolderValue="Name" />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <PaymentsTextFields label="Zip Code" placeHolderValue="+1" />
              <PaymentsTextFields
                label="Phone #"
                placeHolderValue="8143008957"
              />
              <PaymentsTextFields
                label="Address"
                placeHolderValue="Loriem Ipsum"
              />
            </Grid>
          </>
        ) : (
          ""
        )}
        {toShowContactDetails ? (
          <>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                sx={{ fontFamily: "Nunito", fontWeight: "600" }}
                gutterBottom
              >
                {cardHeading}
              </Typography>
              <TextButton
                buttonText="ADD CONTACT"
                startIcon={<AddIcon />}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Grid
                item
                xs={8}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <PaymentsTextFields
                  label="Country"
                  placeHolderValue="721-07-4426"
                />
                <PaymentsTextFields
                  label="Country"
                  placeHolderValue="721-07-4426"
                />
                <PaymentsTextFields
                  label="Country"
                  placeHolderValue="721-07-4426"
                />
                <PaymentsTextFields
                  label="Country"
                  placeHolderValue="721-07-4426"
                />
              </Grid>
              <Grid item xs={4} sx={{ marginLeft: "0.5rem" }}>
                <PaymentsTextFields
                  label="Country"
                  placeHolderValue="721-07-4426"
                  width="17rem"
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={8}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
            </Grid>
          </>
        ) : (
          ""
        )}
        {toShowCreditorBusiness ? (
          <>
            <Typography
              sx={{ fontFamily: "Nunito", fontWeight: "600" }}
              gutterBottom
            >
              {cardHeading}
            </Typography>
            <Grid
              item
              xs={8}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
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
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
              />
              <PaymentsTextFields
                label="Country"
                placeHolderValue="721-07-4426"
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
            <Grid item xs={12}>
              <PaymentsTextFields placeHolderValue="721-07-4426" width="100%" />
            </Grid>
          </>
        ) : (
          ""
        )}
        {toShowCreditorFunded ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
              gutterBottom
            >
              {cardHeading}
            </Typography>
            <Grid
              item
              xs={9}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                }}
                gutterBottom
              >
                Last Funded Date
              </Typography>
              <PaymentsTextFields placeHolderValue="00/00/00" />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                }}
                gutterBottom
              >
                25/12/2024
              </Typography>
            </Grid>
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                marginTop: "1rem",
              }}
            >
              <Grid item xs={3.5}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Historical Range
                </Typography>
              </Grid>
              <Grid
                xs={6.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "0.5rem",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                  }}
                  gutterBottom
                >
                  Minimum
                </Typography>
                <PaymentsTextFields placeHolderValue="$" />
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                  }}
                  gutterBottom
                >
                  Maximum
                </Typography>
                <PaymentsTextFields placeHolderValue="$" />
              </Grid>
            </Grid>
          </>
        ) : (
          ""
        )}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
