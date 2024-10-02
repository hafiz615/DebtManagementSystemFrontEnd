import React, { useEffect, useState } from "react";

import {
  styled,
  InputBase,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { Search, ChevronLeft, NavigateNext } from "@mui/icons-material";
import { useToast } from "../../toast/toastContext";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import { formatValue, getTruncatedText } from "../../common";
import ScrollbarStyles from "./../customScroll";
import {
  debtorBusinessDetails,
  debtorPeronsalDetails,
} from "../../constants/appConstants";
import PaymentCardDetails from "../paymentCard";
import { AddDebtorAccount } from "../../services/services";

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

export default function DebtorDetailsCards({
  caseData,
  GetCaseDetails,
  caseDataId,
  GetLogsById,
}) {
  const [searchText, setSearchText] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 2;
  const handleNext = () => {
    if (startIndex + itemsPerPage < caseData?.debtor?.contacts?.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };
  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const formatKeys = (keys) => {
    const formattedKeys = keys
      ?.replace(/([A-Z])/g, " $1")
      ?.replace(/^./, (str) => str?.toUpperCase());
    return formattedKeys;
  };

  const desiredKeys = [
    "companyName",
    "businessCategory",
    "EIN",
    "phone",
    "description",
  ];
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

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const filteredContacts = caseData?.debtor?.contacts?.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const [connectPayment, setConnectPayment] = useState({
    paymentToken: "",
    paymentType: "",
  });
  const debtorId = caseData?.debtor?._id;
  const { showToast } = useToast();
  const addDebtorDetails = async () => {
    const params = connectPayment;
    const debtorAccountDetails = await AddDebtorAccount(params, debtorId);
    if (debtorAccountDetails?.status === 200) {
      showToast(debtorAccountDetails?.data?.message, "success");
    } else if (debtorAccountDetails?.response?.status === 400) {
      const errorMessage = debtorAccountDetails?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };
  useEffect(() => {
    if (connectPayment?.paymentToken && connectPayment?.paymentType) {
      addDebtorDetails();
    }
  }, [connectPayment]);
  useEffect(() => {
    setStartIndex(0);
  }, [searchText]);

  const paginatedContacts = filteredContacts?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
            {debtorPeronsalDetails}
          </p>
          <span style={{ display: "flex", justifyContent: "end" }}>
            <MuiModels
              show="debtorDetail"
              button="create"
              iconColor={Colors.BLACK}
              width="80vw"
              height="72vh"
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
            />
            <PaymentCardDetails setConnectPayment={setConnectPayment} />
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
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

                  <Tooltip title={value} placement="top-end">
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
                      {getTruncatedText(formatValue(value), 15) || "--"}
                    </Typography>
                  </Tooltip>
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
          {debtorBusinessDetails}
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
          {desiredKeys?.map((key) => {
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
                  <Tooltip title={value} placement="top-end">
                    <Typography
                      sx={{
                        fontSize: smallScreen ? "11px" : "13px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                        fontWeight: "500",
                        textAlign: "right",
                      }}
                    >
                      {getTruncatedText(formatValue(value), 15)}
                    </Typography>
                  </Tooltip>
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
              onChange={(e) => setSearchText(e.target.value)}
            />
          </SearchContainer>
        </Grid>
        <Box>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: Colors.SKY_BLUE,
              color: Colors.WHITE,
              paddingRight: ".4rem",
              paddingLeft: ".4rem",
              borderRadius: ".4rem",
              height: "2rem",
              alignItems: "center",
            }}
          >
            <Grid item xs={4}>
              <span style={{ fontSize: "11px" }}>Name</span>
            </Grid>
            <Grid item xs={4} sx={griRelationdStyle}>
              <span
                style={{
                  fontSize: "11px",
                  marginRight: "1rem",
                }}
              >
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
            {paginatedContacts?.map((item, index) => (
              <Grid
                item
                xs={12}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  backgroundColor:
                    index % 2 === 0 ? Colors.WHITE : "rgba(85, 148, 242, 0.06)",
                  "&:hover": {
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                  },
                  cursor: "pointer",
                  paddingRight: ".4rem",
                  paddingLeft: ".4rem",
                  height: "2rem",
                  alignItems: "center",
                }}
              >
                <Grid item xs={4}>
                  <span style={cellStyle}>{item?.name || "--"}</span>
                </Grid>
                <Grid item xs={4} sx={griRelationdStyle}>
                  <span style={cellStyle}>
                    {item?.relationWithDebtor || "--"}
                  </span>
                </Grid>
                <Grid item xs={4} sx={gridActionStyle}>
                  <span style={cellStyle}>
                    <MuiModels
                      show="sendEmailCase"
                      buttonName="sendEmail"
                      iconColor={Colors.BLACK}
                      caseDataId={caseDataId}
                      maxHeight="78vh"
                      GetLogsById={GetLogsById}
                    />
                    <MuiModels
                      show="sendEmailCase"
                      buttonName="sendSms"
                      headerName={true}
                      iconColor={Colors.BLACK}
                      caseDataId={caseDataId}
                      maxHeight="78vh"
                      GetLogsById={GetLogsById}
                    />
                    <MuiModels
                      show="editDebtorContacts"
                      caseData={caseData}
                      item={item}
                      GetCaseDetails={GetCaseDetails}
                      width="70vw"
                    />
                  </span>
                </Grid>
              </Grid>
            ))}

            {filteredContacts?.length > itemsPerPage && (
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
                    startIndex + itemsPerPage >= filteredContacts?.length
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
