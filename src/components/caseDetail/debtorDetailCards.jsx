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

export default function DebtorDetailsCards({ caseData }) {
  const formatKeys = (keys) => {
    const formattedKeys = keys
      ?.replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
      ?.replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    return formattedKeys;
  };
  return (
    <Grid
      container
      sx={{
        height: "13rem",
        justifyContent: "space-between",
      }}
    >
      <Grid
        item
        xs={3.6}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
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
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10%" }}>
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
                <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                  {key === "SSID" ? "SSN" : formatKeys(key)}
                </Typography>
                <Typography
                  style={{
                    fontSize: "11px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                  }}
                >
                  {value}
                </Typography>
              </div>
            )
          )}
        </div>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
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
          {Object.entries(caseData?.debtor?.businessInformation)?.map(
            ([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                  {key === "EIN" ? key : formatKeys(key)}
                </Typography>
                <Typography
                  style={{
                    fontSize: "11px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                  }}
                >
                  {value}
                </Typography>
              </div>
            )
          )}
        </Box>
      </Grid>
      <Grid
        item
        xs={3.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4%",
            overflowY: "auto",
          }}
        >
          {caseData?.debtor?.contacts?.map((item, index) => {
            return (
              <Card
                key={index}
                sx={{
                  height: "5rem",
                  display: "flex",
                  boxShadow: "none",
                  border: "1px solid lightgrey",
                  borderRadius: "10px",
                  width: "48%",
                  padding: "0px 8px",
                  marginBottom: "4%",
                }}
              >
                <div
                  style={{
                    width: "30%",
                    marginTop: "10%",
                  }}
                >
                  <img
                    style={{ borderRadius: "50%" }}
                    width={25}
                    height={25}
                    src={avatar}
                    alt=""
                  />
                </div>
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    style={{ fontSize: "11px", fontFamily: "Nunito" }}
                  >
                    {item?.name}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "11px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                      overflowWrap: "break-word",
                    }}
                  >
                    {item?.email}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "11px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                    }}
                  >
                    {item?.phone}
                  </Typography>
                </div>
              </Card>
            );
          })}
        </div>
      </Grid>
      <Grid
        item
        xs={2.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
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
              <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                {item?.name}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {item?.totalDebt}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {item?.caseCode}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
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
