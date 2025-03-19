import React from "react";

import { Grid, Tooltip, Typography } from "@mui/material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { formatDateString, getTruncatedText } from "../../common";
import ScrollbarStyles from "../customScroll";

export default function AttorneyDetail({
  accountsExist,
  caseData,
  GetCaseDetails,
  allAttorneyData,
  getAttorneyData,
}) {
  const attorneyData = allAttorneyData?.attorney;
  const lawsuitData = allAttorneyData?.lawSuit;
  const lawfirmData = allAttorneyData?.lawfirm;

  const attorneyFields = [
    { label: "Name", value: attorneyData?.name || "-" },
    { label: "Email", value: attorneyData?.email || "-" },
    { label: "SSN", value: attorneyData?.SSN || "-" },
    {
      label: "Phone",
      value: attorneyData?.phone ? `+1${attorneyData?.phone}` : "-",
    },
    { label: "City", value: attorneyData?.city || "-" },
    {
      label: "Attorney Fee",
      value: attorneyData?.attorneyFee ? `$${attorneyData?.attorneyFee}` : "$0",
    },
  ];

  const lawsuitFields = [
    {
      label: "Defendent Company Name",
      value: lawsuitData?.defendentCompanyName || "-",
    },
    {
      label: "lawsuit Date",
      value: formatDateString(lawsuitData?.lawsuitDate) || "-",
    },
    {
      label: "Lawsuit Paid Amount",
      value: lawsuitData?.lawsuitPaidAmount
        ? `$${lawsuitData?.lawsuitPaidAmount}`
        : "$0",
    },
    {
      label: "Total Balance",
      value: lawsuitData?.balance ? `$${lawsuitData?.balance}` : "$0",
    },
    {
      label: "Lawsuit Receive Amount",
      value: lawsuitData?.lawsuitReceiveAmount
        ? `$${lawsuitData?.lawsuitReceiveAmount}`
        : "$0",
    },
  ];

  const lawfirmFields = [
    {
      label: "lawfirm Company Name",
      value: lawfirmData?.lawfirmCompanyName || "-",
    },
    {
      label: "Email",
      value: lawfirmData?.email || "-",
    },
    {
      label: "City",
      value: lawfirmData?.city || "-",
    },
    {
      label: "State",
      value: lawfirmData?.state || "-",
    },
    {
      label: "Phone",
      value: lawfirmData?.phone ? `+1${lawfirmData?.phone}` : "-",
    },
    {
      label: "Address",
      value: lawfirmData?.address || "-",
    },

    {
      label: "Lawfirm Fee",
      value: lawfirmData?.lawfirmFee ? `$${lawfirmData?.lawfirmFee}` : "$0",
    },
  ];
  return (
    <>
      <Grid
        item
        xs={12}
        md={3.95}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "14rem",
          overflowY: "auto",
          mb: "8px",
          ...ScrollbarStyles,
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: "10px",
          }}
        >
          <div style={{ display: "flex", marginTop: "10px", gap: "10px" }}>
            <span
              style={{
                fontWeight: "600",
                fontSize: "13px",
                fontFamily: "Nunito",
              }}
            >
              Attorney
            </span>
            {attorneyData && (
              <MuiModels
                type="attorney"
                show="showCreditorSync"
                attorneyId={attorneyData?._id}
                iconColor={Colors.BLACK}
                caseData={caseData}
                GetCaseDetails={GetCaseDetails}
                height="22vh"
              />
            )}
          </div>
          {attorneyData && (
            <MuiModels
              show="editAttorney"
              data={attorneyData}
              attorneyId={attorneyData?._id}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              getAttorneyData={getAttorneyData}
            />
          )}
        </Grid>
        {attorneyData && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {attorneyFields?.map(({ label, value }, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    width: "48%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontFamily: "Nunito",
                      fontWeight: "700",
                      color: Colors.DARK_GRAY,
                      width: "45%",
                    }}
                  >
                    {label}
                  </Typography>

                  <Tooltip placement="top" title={value}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: Colors.DIM_LIGHT_GRAY,
                        fontFamily: "Nunito",
                        fontWeight: "500",
                        textAlign: "right",
                        wordBreak: "break-word",
                      }}
                    >
                      {getTruncatedText(value, 12)}
                    </Typography>
                  </Tooltip>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontFamily: "Nunito",
                    fontWeight: "700",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Address
                </Typography>
                <Tooltip placement="top" title={attorneyData?.address || "-"}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      textAlign: "right",
                      wordBreak: "break-word",
                    }}
                  >
                    {attorneyData?.address || "-"}
                  </Typography>
                </Tooltip>
              </div>
            </div>
            <Grid container xs={12} sx={{ justifyContent: "center" }}>
              <MuiModels
                accountsExist={accountsExist}
                type="attorney"
                show="paynoteForm"
                button="paynoteForm"
                width="55vw"
                attorneyId={attorneyData?._id}
                caseData={caseData}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        md={3.95}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "14rem",
          overflowY: "auto",
          mb: "8px",
          ...ScrollbarStyles,
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: "1rem",
            mt: "10px",
          }}
        >
          <span
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Lawsuit
          </span>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {lawsuitFields?.map(({ label, value }, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                width: "98%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  color: Colors.DARK_GRAY,
                  width: "45%",
                }}
              >
                {label}
              </Typography>

              <Tooltip placement="top" title={value}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    textAlign: "right",
                    wordBreak: "break-word",
                  }}
                >
                  {getTruncatedText(value, 18)}
                </Typography>
              </Tooltip>
            </div>
          ))}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        md={3.95}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "14rem",
          overflowY: "auto",
          mb: "8px",
          ...ScrollbarStyles,
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: "1rem",
            mt: "10px",
          }}
        >
          <span
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Lawfirm
          </span>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {lawfirmFields?.map(({ label, value }, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                width: "98%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontFamily: "Nunito",
                  fontWeight: "700",
                  color: Colors.DARK_GRAY,
                  width: "45%",
                }}
              >
                {label}
              </Typography>

              <Tooltip placement="top" title={value}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    textAlign: "right",
                    wordBreak: "break-word",
                  }}
                >
                  {getTruncatedText(value, 18)}
                </Typography>
              </Tooltip>
            </div>
          ))}
        </div>
      </Grid>
    </>
  );
}
