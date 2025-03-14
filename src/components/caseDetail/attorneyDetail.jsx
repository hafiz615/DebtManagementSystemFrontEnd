import React from "react";

import { Grid, Tooltip, Typography } from "@mui/material";

import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import MuiModels from "../models";

export default function AttorneyDetail({
  caseData,
  GetCaseDetails,
  attorneyData,
  getAttorneyData,
}) {
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

  return (
    <Grid
      item
      xs={12}
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
      {attorneyData ? (
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
                    {value}
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
              type="attorney"
              show="paynoteForm"
              button="paynoteForm"
              width="55vw"
              attorneyId={attorneyData?._id}
              caseData={caseData}
            />
          </Grid>
        </>
      ) : (
        <p
          style={{
            color: Colors.DIM_LIGHT_GRAY,
            fontFamily: "Nunito",
            fontSize: "13px",
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          No Attorney Exist.
        </p>
      )}
    </Grid>
  );
}
