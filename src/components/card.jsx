import * as React from "react";

import { Grid } from "@mui/material/";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CreateIcon from "@mui/icons-material/Create";

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
  toShowDebtDetails,
  toShowSettlementPlan,
  height,

  previewDebtorDetails,
  previewCreditorDetails,
  previewSettlementPlan,
}) {
  return (
    <Card
      sx={{
        borderRadius: "10px",
        height: height,
        marginTop: { xs: ".5rem", xl: "0rem" },
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
                placeHolderValue="Loriem Ipsum"
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
                placeholder="Loriem Ipsum"
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
                placeHolderValue="Loriem Ipsumame"
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
                placeHolderValue="Loriem Ipsum"
                width="100%"
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
                placeHolderValue="Loriem Ipsum"
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
                placeholder="Loriem Ipsum"
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
                placeHolderValue="Loriem Ipsumame"
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
                placeHolderValue="Loriem Ipsum"
                width="100%"
              />
            </Grid>
          </>
        ) : (
          ""
        )}
        {toShowContactDetails ? (
          <>
            <Grid
              container
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
          </>
        ) : (
          ""
        )}
        {toShowDebtDetails ? (
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
              container
              item
              xs={12}
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Grid
                item
                xs={12}
                lg={3.9}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginRight: "2rem",
                  }}
                >
                  Total Receivable
                </Typography>

                <input
                  type="text"
                  placeholder="$$10,000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                lg={3.9}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginRight: "1rem",
                    marginLeft: "2rem",
                  }}
                >
                  Paid
                </Typography>
                <input
                  type="text"
                  placeholder="$$10,000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                lg={3.9}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginRight: "1rem",
                  }}
                >
                  Remaining
                </Typography>
                <input
                  type="text"
                  placeholder="$$10,000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                marginTop: "1rem",
              }}
            >
              <Grid
                item
                xs={12}
                lg={3.9}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginRight: "1rem",
                  }}
                >
                  Last Payment Date
                </Typography>

                <input
                  type="text"
                  placeholder="$$10,000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                lg={3.9}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    marginRight: "1rem",
                    marginLeft: "2rem",
                  }}
                >
                  Status
                </Typography>
                <input
                  type="text"
                  placeholder="$$10,000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
            </Grid>
          </>
        ) : toShowSettlementPlan ? (
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
            <Grid container item>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Debt
                </Typography>
                <input
                  type="text"
                  placeholder="$2000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Time Period
                </Typography>
                <input
                  type="text"
                  placeholder="Custom"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Date
                </Typography>
                <input
                  type="text"
                  placeholder="4/1/2024"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
              </Grid>
            </Grid>
            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Debt
                </Typography>
                <input
                  type="text"
                  placeholder="$2000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Time Period
                </Typography>
                <input
                  type="text"
                  placeholder="Custom"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Date
                </Typography>
                <input
                  type="text"
                  placeholder="4/1/2024"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Frequency
                </Typography>
                <input
                  type="text"
                  placeholder="5"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "20%",
                    marginRight: "0.5rem",
                  }}
                />
                <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
                <RemoveCircleIcon sx={{ color: Colors.ORANGE_COLOR }} />
              </Grid>
            </Grid>
            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Debt
                </Typography>
                <input
                  type="text"
                  placeholder="$2000"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Time Period
                </Typography>
                <input
                  type="text"
                  placeholder="Custom"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Date
                </Typography>
                <input
                  type="text"
                  placeholder="4/1/2024"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "60%",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    marginRight: ".5rem",
                    color: Colors.DARK_GRAY,
                  }}
                  gutterBottom
                >
                  Frequency
                </Typography>
                <input
                  type="text"
                  placeholder="5"
                  style={{
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    height: "2.5rem",
                    color: Colors.DIM_LIGHT_GRAY,
                    paddingLeft: "1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    width: "20%",
                    marginRight: "0.5rem",
                  }}
                />
                <AddCircleIcon sx={{ color: Colors.SKY_BLUE }} />
                <RemoveCircleIcon sx={{ color: Colors.ORANGE_COLOR }} />
              </Grid>
            </Grid>
          </>
        ) : previewDebtorDetails ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              {cardHeading}
              <CreateIcon sx={{ fontSize: "1rem", marginLeft: "0.5rem" }} />
            </Typography>

            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    width: "40%",
                  }}
                >
                  Full Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    width: "50%",
                  }}
                >
                  John Deo
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  user@gmail.com
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  SSID
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  721-07-4426
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Status
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Customer
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Country
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Lorem Ipsum
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  State
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Loriem Ipsum
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  City
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Loriem Ipsum
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Zip Code
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  6677788
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Phone #.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  +18143008957
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Address
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Loriem Ipsum
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : previewCreditorDetails ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              {cardHeading}
              <CreateIcon sx={{ fontSize: "1rem", marginLeft: "0.5rem" }} />
            </Typography>
            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    width: "40%",
                  }}
                >
                  Full Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    width: "50%",
                  }}
                >
                  John Deo
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  user@email.com
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Address
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Loriem Ipsum
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Funded
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  4/4/2024
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Phone #.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  +18143008957
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Notes
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Lorem Ipsum
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Company Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Loriem Ipsum
                </Typography>
              </Grid>

              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Business Category
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Lorem Ipsum
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : previewSettlementPlan ? (
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

            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                marginLeft: "2rem",
              }}
            >
              Total Receivable
              <span style={{ marginLeft: "1rem" }}>$10,000</span>
            </Typography>
            <Grid
              container
              item
              xs={12}
              sx={{
                borderRadius: "10px",
                border: "1px  solid #D9D9D9",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                paddingRight: "1rem",
                paddingLeft: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                overflowY: "auto",
                maxHeight: "15rem",
              }}
            >
              <Grid container item>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item sx={{ marginTop: "1rem" }}>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "40%",
                    }}
                  >
                    Debt
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      width: "50%",
                    }}
                  >
                    $2000
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={2.5}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Time Period
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Custom
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={4}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Authorization Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    2/2/2024
                  </Typography>
                </Grid>
                <Grid container item xs={12} lg={3}>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      width: "40%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Captured Date
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      width: "50%",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    4/2/2024
                  </Typography>
                </Grid>
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
