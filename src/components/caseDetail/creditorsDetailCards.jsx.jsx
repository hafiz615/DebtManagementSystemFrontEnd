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
  Sms,
  Email,
  Call,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { formatDollarAmount } from "../../common";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
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
  return (
    <>
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
            show="creditorDetail"
            button="create"
            iconColor={Colors.BLACK}
            width="80vw"
            height="max-content"
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
            maxHeight="85vh"
          />
        </div>
        <div
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
            Full Name
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
            {caseData?.creditor?.basicInformation?.fullName}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Typography
            sx={{
              fontSize: smallScreen ? "11px" : "13px",
              fontSize: "11px",
              fontFamily: "Nunito",
              color: Colors.DARK_GRAY,
              fontWeight: "700",
            }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              fontSize: smallScreen ? "11px" : "13px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
              textAlign: "right",
              fontWeight: "500",
            }}
          >
            {caseData?.creditor?.basicInformation?.email}
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: smallScreen ? "11px" : "13px",
              fontFamily: "Nunito",
              color: Colors.DARK_GRAY,
              fontWeight: "700",
            }}
          >
            Phone #
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
            {caseData?.creditor?.basicInformation?.phone}
          </Typography>
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
          Business Details
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            gap: "10%",
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
            Company
          </Typography>
          <Typography
            sx={{
              fontSize: smallScreen ? "11px" : "13px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
              fontWeight: "500",
              textAlign: "500",
              wordBreak: "break-word",
            }}
          >
            {caseData?.creditor?.businessInformation?.companyName}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10%",
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
            Category
          </Typography>
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
            {caseData?.creditor?.businessInformation?.businessCategory}
          </Typography>
        </div>
        {/* <div>
          <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>Notes</p>
          <p
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAYm,
              fontFamily: "Nunito",
            }}
          >
            {businessDetail?.notes}
          </p>
        </div> */}
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
        lg={3.5}
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
          />

          {/* <div
            style={{ display: "flex", fontSize: "11px", alignItems: "center" }}
          >
            <IconButton>
              <KeyboardArrowLeft
                sx={{ fontSize: "16px", fontFamily: "Nunito" }}
              />
            </IconButton>
            1 of {caseData?.creditor?.contacts?.length}
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
          style={{
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
            <span style={{ fontSize: "11px", marginRight: "1rem" }}>
              Relation
            </span>
            <span style={{ fontSize: "11px" }}>Action</span>
          </Grid>

          {caseData?.creditor?.contacts?.map((item, index) => {
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
