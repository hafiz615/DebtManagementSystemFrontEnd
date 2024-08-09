import React from "react";

import {
  Grid,
  Typography,
  // IconButton,
  styled,
  InputBase,
  Box,
} from "@mui/material";
import {
  Search,
  // KeyboardArrowLeft,
  // KeyboardArrowRight,
  Call,
  Sms,
  Email,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import useMediaQuery from "@mui/material/useMediaQuery";
import DebtorFields from "../caseCreationFields/debtorFields";

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
  const cellStyle = {
    color: Colors.DIM_LIGHT_GRAY,
    fontWeight: "600",
    fontFamily: "Nunito",
    fontSize: "11px",
  };
  const iconStyle = {
    fontSize: "15px",
    marginLeft: ".3rem",
    marginTop: ".3rem",
  };
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  return (
    <>
      <Grid
        item
        xs={12}
        lg={4.6}
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
            height="72vh"
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6%",
          }}
        >
          {Object.entries(caseData?.debtor?.basicInformation)?.map(
            ([key, value]) =>
              key !== "weeklyBudget" && (
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
                    sx={{
                      fontSize: smallScreen ? "11px" : "13px",
                      fontWeight: "700",
                      fontFamily: "Nunito",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    {key === "SSID" ? "SSN" : formatKeys(key)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: smallScreen ? "11px" : "13px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      textAlign: "right",
                      flexWrap: "wrap",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {getTruncatedText(value, 17)}
                  </Typography>
                </div>
              )
          )}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        lg={3}
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
                    gap: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: smallScreen ? "11px" : "13px",
                      fontWeight: "700",
                      fontFamily: "Nunito",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    {key === "EIN" ? key : formatKeys(key)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: smallScreen ? "11px" : "13px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {getTruncatedText(value, 20)}
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
        lg={4}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: "0.5rem",
        }}
      >
        <Grid
          container
          item
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
          <MuiModels
            show="debtorContacts"
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
            width="70vw"
          />

          {/* <div
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
            1 of {caseData?.debtor?.contacts?.length}
            <IconButton>
              <KeyboardArrowRight sx={{ fontSize: "16px" }} />
            </IconButton>
          </div> */}
        </Grid>

        <Grid container item sx={{ marginBottom: "0.5rem" }}>
          <SearchContainer
            sx={{
              width: "100%",
              marginBottom: smallScreen ? "0.5rem" : "0rem",
            }}
          >
            <SearchIconWrapper>
              <Search
                sx={{
                  fontSize: "16px",
                  color: Colors.DIM_LIGHT_GRAY,
                }}
              />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Contact..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchContainer>
        </Grid>
        <Box
          sx={{
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
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: Colors.SKY_BLUE,
              color: Colors.WHITE,
              paddingRight: ".5rem",
              paddingLeft: ".5rem",
              height: "2rem",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "11px" }}>Name</span>
            <span
              style={{
                fontSize: "11px",
                marginRight: "1rem",
              }}
            >
              Relation
            </span>
            <span style={{ fontSize: "11px" }}>Action</span>
          </Grid>
          {caseData?.debtor?.contacts?.map((item, index) => {
            return (
              <Grid
                item
                xs={12}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor:
                    index % 2 === 0 ? Colors.WHITE : "rgba(85, 148, 242, 0.06)",
                  "&:hover": {
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                  },
                  cursor: "pointer",
                  paddingRight: ".2rem",
                  paddingLeft: ".2rem",
                  height: "2rem",
                  alignItems: "center",
                }}
              >
                <span style={cellStyle}>{item?.name || "-"}</span>
                <span style={cellStyle}>{item?.relationWithDebtor || "-"}</span>
                <span style={cellStyle}>
                  <Email sx={iconStyle} />
                  <Call sx={iconStyle} />
                  <Sms sx={iconStyle} />
                </span>
              </Grid>
            );
          })}
        </Box>
      </Grid>
    </>
  );
}
