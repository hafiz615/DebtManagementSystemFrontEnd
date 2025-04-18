import React from "react";

import { Grid, IconButton, Tooltip, Typography } from "@mui/material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import { formatDateString, getTruncatedText } from "../../common";
import ScrollbarStyles from "../customScroll";
import { FONT_SIZE_MEDIUM } from "../../constants/appConstants";
import { Info, Sync } from "@mui/icons-material";
import { SyncLawsuit } from "../../services/services";
import { useToast } from "../../toast/toastContext";

export default function AttorneyDetail({
  accountsExist,
  caseData,
  GetCaseDetails,
  allAttorneyData,
  getAttorneyData,
}) {
  const attorneyData = allAttorneyData?.attorney || "";
  const lawsuitData = allAttorneyData?.lawSuit || "";
  const lawfirmData = allAttorneyData?.lawfirm || "";
  const { showToast } = useToast();

  const showSync =
    caseData?.debtor?.lawsuitFields ||
    caseData?.debtor?.lawsuitFields?.length !== 0;

  const attorneyFields = [
    { label: "Name", value: attorneyData?.name || "-" },
    { label: "Email", value: attorneyData?.email || "-" },
    { label: "SSN", value: attorneyData?.SSN || "-" },
    {
      label: "Phone",
      value: attorneyData?.phone ? `+1${attorneyData?.phone}` : "-",
    },
    { label: "City", value: attorneyData?.city || "-" },
  ];

  const lawsuitFields = [
    {
      label: "Defendent Company Name",
      value: lawsuitData?.defendentCompanyName || "-",
    },
    {
      label: "lawsuit Date",
      value: lawsuitData?.lawsuitDate
        ? formatDateString(lawsuitData?.lawsuitDate)
        : "-",
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

  const handleLawsuitSync = async () => {
    const res = await SyncLawsuit(caseData?._id);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      getAttorneyData();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

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
            mt: "10px",
            mb: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "13px",
                fontFamily: "Nunito",
              }}
            >
              Creditor's Attorney
            </span>
          </div>
          {attorneyData ? (
            <MuiModels
              show="editAttorney"
              data={attorneyData}
              attorneyId={attorneyData?._id}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              getAttorneyData={getAttorneyData}
            />
          ) : (
            <MuiModels
              show="addAttorneyDetails"
              caseId={caseData?._id}
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
          </>
        ) : (
          <Grid
            item
            container
            xs={12}
            sx={{
              height: "18vh",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_MEDIUM,
              color: Colors.DARK_GRAY,
            }}
          >
            No creditor's attorney Exists
          </Grid>
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Lawsuit
            {showSync && (
              <Tooltip
                title="your existing data could be override by sync call"
                placement="top"
              >
                <Info sx={{ cursor: "pointer", color: Colors.YELLOW }} />
              </Tooltip>
            )}
          </span>

          <div style={{ display: "flex", alignItems: "center" }}>
            {showSync && (
              <IconButton onClick={handleLawsuitSync}>
                <Sync />
              </IconButton>
            )}
            <MuiModels
              show="editLawsuit"
              data={allAttorneyData?.lawSuit}
              caseId={caseData?._id}
              getAttorneyData={getAttorneyData}
            />
          </div>
        </Grid>
        {lawsuitData ? (
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
                    {getTruncatedText(value, 19)}
                  </Typography>
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <Grid
            item
            container
            xs={12}
            sx={{
              height: "18vh",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Nunito",
              fontSize: FONT_SIZE_MEDIUM,
              color: Colors.DARK_GRAY,
            }}
          >
            No lawsuit Exists
          </Grid>
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
            Client's Law Firm
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MuiModels
              type="lawfirm"
              show="showCreditorSync"
              attorneyId={allAttorneyData?.lawfirm?._id}
              iconColor={Colors.BLACK}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              height="22vh"
            />
            <MuiModels
              show="editLawfirm"
              data={allAttorneyData?.lawfirm}
              lawfirmId={allAttorneyData?.lawfirm?._id}
              getAttorneyData={getAttorneyData}
            />
            <MuiModels
              accountsExist={accountsExist}
              type="lawfirm"
              show="paynoteForm"
              button="paynoteForm"
              width="55vw"
              attorneyId={allAttorneyData?.lawfirm?._id}
              caseData={caseData}
            />
          </div>
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
