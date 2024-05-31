import React from "react";

import {
  Grid,
  Typography,
  Card,
  IconButton,
  styled,
  InputBase,
  Box,
} from "@mui/material";
import {
  Search,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ColorLens,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import avatar from "../../assets/Ellipse 12.png";
import MuiModels from "../models";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: Colors.BG_LIGHT_GRAY,
  "&:hover": {
    backgroundColor: Colors.BG_LIGHT_GRAY,
  },
  fontSize: "10px",
  width: "40%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    fontSize: "10px",
    paddingLeft: `calc(1em + ${theme.spacing(2.5)})`,
    transition: theme.transitions.create("width"),
  },
}));

export default function DebtorDetailsCards({ caseData, GetCaseDetails }) {
  const formatKeys = (keys) => {
    const formattedKeys = keys
      ?.replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
      ?.replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    return formattedKeys;
  };

  const getTruncatedText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  const desiredKeys = [
    "companyName",
    "businessCategory",
    "EIN",
    "phone",
    "description",
  ];
  return (
    <Grid
      container
      sx={{
        height: "max-content",
        justifyContent: "space-between",
      }}
    >
      <Grid
        item
        xs={12}
        lg={3.6}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Personal Details
          </p>
          <MuiModels
            show="debtorDetail"
            button="create"
            iconColor={Colors.BLACK}
            width="80vw"
            height="90vh"
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10%",
          }}
        >
          {Object.entries(caseData?.debtor?.basicInformation)?.map(
            ([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "45%",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "Nunito",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {key === "SSID" ? "SSN" : formatKeys(key)}
                </Typography>
                <Typography
                  style={{
                    fontSize: "11px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    textAlign: "right",
                  }}
                >
                  {getTruncatedText(value, 35)}
                </Typography>
              </div>
            )
          )}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        lg={2}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: "0.5rem",
        }}
      >
        <p
          style={{ fontWeight: "600", fontSize: "13px", fontFamily: "Nunito" }}
        >
          Business Details
        </p>
        <Box
          sx={{
            gap: "10%",
            height: "10rem",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
            },
          }}
        >
          {desiredKeys.map((key) => {
            const value = caseData?.debtor?.businessInformation[key];
            if (value) {
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "8px",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      fontFamily: "Nunito",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    {key === "EIN" ? key : formatKeys(key)}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "11px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {getTruncatedText(value, 35)}
                  </Typography>
                </div>
              );
            }
            return null;
          })}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        lg={3.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Contacts
          </p>
          <SearchContainer>
            <SearchIconWrapper>
              <Search sx={{ fontSize: "16px", color: Colors.DIM_LIGHT_GRAY }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Contact..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchContainer>
          <div
            style={{
              display: "flex",
              fontSize: "11px",
              alignItems: "center",
              fontFamily: "Nunito",
            }}
          >
            <IconButton>
              <KeyboardArrowLeft sx={{ fontSize: "16px" }} />
            </IconButton>
            1 of 4
            <IconButton>
              <KeyboardArrowRight sx={{ fontSize: "16px" }} />
            </IconButton>
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "3%",
            height: "10rem",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
            },
          }}
        >
          {caseData?.debtor?.contacts?.map((item, index) => {
            return (
              <>
                <Card
                  key={index}
                  sx={{
                    height: "4.5rem",
                    display: "flex",
                    boxShadow: "none",
                    border: "1px solid lightgrey",
                    borderRadius: "10px",
                    width: "48%",
                    padding: "0px 8px",
                    marginBottom: ".5rem",
                  }}
                >
                  <div
                    style={{
                      width: "70%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "11px",
                        fontFamily: "Nunito",
                        fontWeight: "700",
                        color: Colors.DARK_GRAY,
                      }}
                    >
                      {item?.name}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                        overflowWrap: item?.email?.length > 20 && "break-word",
                      }}
                    >
                      {item?.email}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "11px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                        fontWeight: "500",
                      }}
                    >
                      {item?.phone}
                    </Typography>
                  </div>
                </Card>
              </>
            );
          })}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        lg={2.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: "0.5rem",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E5E5E5",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: Colors.WHITE,
            borderRadius: "8px",
          },
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Other Creditors
          </p>
          <Box sx={{ marginTop: "0.5rem" }}>
            <MuiModels
              show="addCase"
              width="80vw"
              height="90vh"
              caseData={caseData}
            />
          </Box>
        </div>
        {caseData?.creditors?.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  color: Colors.DARK_GRAY,
                }}
              >
                {item?.name}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                  fontWeight: "600",
                }}
              >
                {item?.totalDebt}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                  fontWeight: "600",
                }}
              >
                {item?.caseCode}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                  fontWeight: "600",
                }}
              >
                {item?.status}
              </p>
            </div>
          );
        })}
      </Grid>
    </Grid>
  );
}
