import React from "react";
import { useState } from "react";
import {
  Grid,
  Typography,
  Tooltip,
  styled,
  InputBase,
  Box,
  IconButton,
} from "@mui/material";
import {
  Search,
  Sms,
  Email,
  Call,
  ChevronLeft,
  NavigateNext,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { formatDollarAmount } from "../../common";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getTruncatedText } from "../../common";
import ScrollbarStyles from "./../customScroll";

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

export default function CreditorsDetailCards({ caseData, GetCaseDetails }) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 2;
  const handleNext = () => {
    if (startIndex + itemsPerPage < caseData?.creditor?.contacts?.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };
  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };
  const creditorPeronsalDetails = "Personal Details";
  const creditorBusinessDetails = "Business Details";
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
  const griRelationdStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const gridActionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };
  const cellStyle = {
    display: "flex",
    alignItems: "center",
    color: Colors.DIM_LIGHT_GRAY,
    fontWeight: "600",
    fontFamily: "Nunito",
    fontSize: "11px",
  };
  const iconStyle = {
    fontSize: "13px",
    marginLeft: ".3rem",
    marginTop: ".3rem",
  };
  return (
    <>
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
        <>
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
              {creditorPeronsalDetails}
            </p>
            <MuiModels
              show="creditorDetail"
              button="create"
              iconColor={Colors.BLACK}
              width="80vw"
              height="75vh"
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
          </div>
          {[
            {
              label: "Full Name",
              value: caseData?.creditor?.basicInformation?.fullName,
            },
            {
              label: "Email",
              value: caseData?.creditor?.basicInformation?.email,
            },
            {
              label: "Phone #",
              value: caseData?.creditor?.basicInformation?.phone,
            },
          ]?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Typography
                sx={{
                  fontSize: smallScreen ? "11px" : "13px",
                  fontFamily: "Nunito",
                  color: Colors.DARK_GRAY,
                  fontWeight: "700",
                }}
              >
                {item?.label}
              </Typography>
              <Tooltip title={item?.value || ""} placement="top-end">
                <Typography
                  sx={{
                    fontSize: smallScreen ? "11px" : "13px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    textAlign: "right",
                  }}
                >
                  {getTruncatedText(item?.value, 15)}
                </Typography>
              </Tooltip>
            </div>
          ))}
        </>
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
          marginBottom: ".5rem",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
          }}
        >
          {creditorBusinessDetails}
        </p>
        {[
          {
            label: "Company",
            value: caseData?.creditor?.businessInformation?.companyName,
          },
          {
            label: "Category",
            value: caseData?.creditor?.businessInformation?.businessCategory,
          },
        ]?.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: index === 0 ? "8px" : "0",
            }}
          >
            <Typography
              sx={{
                fontSize: smallScreen ? "11px" : "13px",
                fontFamily: "Nunito",
                fontWeight: "700",
                color: Colors.DARK_GRAY,
                width: "45%",
              }}
            >
              {item?.label}
            </Typography>
            <Tooltip title={item?.value || ""} placement="top-end">
              <Typography
                sx={{
                  fontSize: smallScreen ? "11px" : "13px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  textAlign: "right",
                  wordBreak: "break-word",
                }}
              >
                {getTruncatedText(item?.value, 15)}
              </Typography>
            </Tooltip>
          </div>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        lg={1.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          marginBottom: ".5rem",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
          }}
        >
          Funded
        </p>
        <p
          style={{
            fontSize: "11px",
            fontFamily: "Nunito",
            fontWeight: "700",
            color: Colors.DARK_GRAY,
          }}
        >
          Last Funded Date
        </p>
        <p
          style={{
            fontSize: "11px",
            color: Colors.DIM_LIGHT_GRAY,
            fontWeight: "500",
          }}
        >
          {formatDate(caseData?.creditor?.lastFundedDate) || "-"}
        </p>
        <p
          style={{
            fontSize: "11px",
            fontFamily: "Nunito",
            fontWeight: "700",
            color: Colors.DARK_GRAY,
          }}
        >
          Historical Range
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              fontSize: "11px",
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DIM_LIGHT_GRAY,
            }}
          >
            Min
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DIM_LIGHT_GRAY,
            }}
          >
            {formatDollarAmount(caseData?.creditor?.historicalRange?.minimum) ||
              "-"}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              fontSize: "11px",
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DIM_LIGHT_GRAY,
            }}
          >
            Max
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DIM_LIGHT_GRAY,
            }}
          >
            {formatDollarAmount(caseData?.creditor?.historicalRange?.maximum) ||
              "-"}
          </Typography>
        </div>
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
          marginBottom: ".5rem",
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
            show="creditorContacts"
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
            width="70vw"
          />
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
          style={{
            height: "10rem",
            overflowY: "auto",
            ...ScrollbarStyles,
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
              paddingRight: ".2rem",
              paddingLeft: ".2rem",
              height: "2rem",
              alignItems: "center",
            }}
          >
            <Grid item xs={4}>
              <span style={{ fontSize: "11px" }}>Name</span>
            </Grid>
            <Grid item xs={4} sx={griRelationdStyle}>
              <span style={{ fontSize: "11px", marginRight: "1rem" }}>
                Relation
              </span>
            </Grid>
            <Grid item xs={4} sx={gridActionStyle}>
              <span style={{ fontSize: "11px" }}>Action</span>
            </Grid>
          </Grid>
          <Box
            sx={{
              height: "5rem",
              overflow: "auto",
              ...ScrollbarStyles,
            }}
          >
            {caseData?.creditor?.contacts
              ?.slice(startIndex, startIndex + itemsPerPage)
              ?.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor:
                      index % 2 === 0
                        ? Colors.WHITE
                        : "rgba(85, 148, 242, 0.06)",
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
                  <Grid item xs={4}>
                    <span style={cellStyle}>{item?.name || "-"}</span>
                  </Grid>
                  <Grid item xs={4} sx={griRelationdStyle}>
                    <span style={cellStyle}>
                      {item?.relationWithDebtor ||
                        item?.relationWithCreditor ||
                        "-"}
                    </span>
                  </Grid>
                  <Grid item xs={4} sx={gridActionStyle}>
                    <span style={cellStyle}>
                      <Email sx={iconStyle} />
                      <Call sx={iconStyle} />
                      <Sms sx={iconStyle} />
                      <MuiModels
                        show="editCreditorContacts"
                        caseData={caseData}
                        item={item}
                        GetCaseDetails={GetCaseDetails}
                        width="70vw"
                      />
                    </span>
                  </Grid>
                </Grid>
              ))}

            {caseData?.creditor?.contacts?.length > 2 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: "10px",
                }}
              >
                <IconButton
                  aria-label="prev"
                  disabled={startIndex - itemsPerPage < 0}
                  onClick={handlePrev}
                  color="primary"
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  aria-label="next"
                  disabled={
                    startIndex + itemsPerPage >=
                    caseData?.creditor?.contacts?.length
                  }
                  onClick={handleNext}
                  color="primary"
                >
                  <NavigateNext />
                </IconButton>
              </div>
            )}
          </Box>
        </Box>
      </Grid>
    </>
  );
}
