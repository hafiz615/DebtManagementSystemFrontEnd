import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import MuiModels from "../models";
import ScrollbarStyles from "./../customScroll";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function SettlementCards({
  title,
  settlementRange,
  commissionRange,
  newDefaultRiskScore,
  percentageSettlementOverWeeklyBudget,
  percentageSettlementOverWeeklyTrueRevenue,
  weeksTillPaid,
  weeksTillPaidTitle,
  caseId,
  remainingAmount,
  isLumpSumPayment,
  warning,
  strategy,
  setPaymentChanged,
  percentageReceivableAmount,
  tabValue,
  percentageReceivable,
  weeklyTrueRevenueAmount,
  selectedOption,
  setSelectedOption,
  optionValue,
  isFullPayment,
}) {
  const commonStyles = {
    backgroundColor: Colors.WHITE,
    borderRadius: "10px",
    flexDirection: "column",
    gap: "10px",
    mb: "1rem",
    pb: "1.2rem",
  };

  const commonTextStyles = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    fontWeight: "700",
  };

  const textStyles = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.DARK_GRAY,
  };

  const lineStyle = {
    width: "100%",
    height: "1px",
    backgroundColor: "#EAEBEB",
    margin: "8px 0",
  };

  const allRanges = [
    settlementRange || null,
    commissionRange || null,
    newDefaultRiskScore || null,
    percentageSettlementOverWeeklyBudget || null,
    percentageSettlementOverWeeklyTrueRevenue || null,
    weeksTillPaid || null,
  ];

  const rangeNames = [
    { label: "Settlement Range", tooltip: "Suggested weekly payment amount" },
    {
      label: "Commission Range",
      tooltip: "Amount that will be saved as commission",
    },
    {
      label: "New Default Risk",
      tooltip: "Clients risk score with this payment plan",
    },
    {
      label: "Weekly Budget %",
      tooltip: "Settlement shown as percentage of weekly budget",
    },
    {
      label: "Weekly True Revenue %",
      tooltip: "Settlement shown as percentage of weekly true revenue",
    },
    {
      label: "Weeks Till Paid",
      tooltip: "Number of weeks to complete payment",
    },
  ];

  const mediumScreen = useMediaQuery(
    "(min-width:899px) and (max-width:1400px)"
  );

  function capitalizeFirstWord(text) {
    if (!text) return text;
    const words = text.split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }

  const noData =
    !settlementRange &&
    !commissionRange &&
    !newDefaultRiskScore &&
    !percentageSettlementOverWeeklyBudget &&
    !percentageSettlementOverWeeklyTrueRevenue &&
    !weeksTillPaid;

  const excludedLabelsStrategy1 = [
    "Weekly Budget %",
    "Weekly True Revenue %",
    "New Default Risk",
  ];

  const excludedLabelsStrategy3 = [
    "Settlement Range",
    "Commission Range",
    "Weekly Budget %",
    "Weeks Till Paid",
  ];

  return (
    <>
      <Grid item xs={12} md={5.8} lg={3.8} container sx={commonStyles}>
        <div
          style={{
            margin: "1rem 8%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={commonTextStyles}>
            {strategy === "strategy2" ? "Lump Sum" : "Recommended Strategy"}
          </Typography>
          {strategy === "strategy1" ? (
            <MuiModels
              width="35vw"
              show="settlmentPayment"
              title={title}
              settlementRange={settlementRange?.[title]}
              weeksTillPaid={weeksTillPaid?.[weeksTillPaidTitle]}
              commissionRange={commissionRange?.[title]}
              remainingAmount={remainingAmount}
              setPaymentChanged={setPaymentChanged}
              caseId={caseId}
            />
          ) : strategy === "strategy3" ? (
            <MuiModels
              width="35vw"
              show="strategy3choices"
              buttonName="settlmentPayment"
              title={title}
              settlementRange={percentageReceivableAmount}
              weeksTillPaid={weeklyTrueRevenueAmount}
              commissionRange={commissionRange?.[title]}
              remainingAmount={remainingAmount}
              setPaymentChanged={setPaymentChanged}
              caseId={caseId}
            />
          ) : (
            <MuiModels
              width="70vw"
              show="payments"
              buttonName="settlmentPayment"
              settlementRange={
                strategy === "strategy3"
                  ? selectedOption === "percentageReceivable"
                    ? percentageReceivableAmount
                    : weeklyTrueRevenueAmount
                  : settlementRange?.remaining_principle_amount
              }
              remainingAmount={remainingAmount}
              setPaymentChanged={setPaymentChanged}
              caseId={caseId}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              strategy="strategy3"
            />
          )}
        </div>
        <Box sx={lineStyle} />
        {noData ? (
          <Typography sx={{ ...commonTextStyles, marginLeft: "8%" }}>
            No Data
          </Typography>
        ) : (
          allRanges?.map((item, index) => {
            if (
              strategy === "strategy1" &&
              excludedLabelsStrategy1?.includes(rangeNames[index].label)
            ) {
              return null;
            }

            if (
              strategy === "strategy3" &&
              excludedLabelsStrategy3?.includes(rangeNames[index].label)
            ) {
              return null;
            }

            const shouldShowContent = !isLumpSumPayment;
            return (
              <Grid
                container
                sx={{
                  width: "100%",
                  padding: shouldShowContent && "10px 8px",
                }}
                key={index}
              >
                {shouldShowContent ? (
                  <Grid item xs={6.5} sx={{ paddingLeft: "6%" }}>
                    <Typography
                      sx={{
                        ...commonTextStyles,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {rangeNames[index]?.label}

                      {rangeNames[index]?.tooltip && (
                        <Tooltip
                          title={rangeNames[index]?.tooltip}
                          placement="top-end"
                        >
                          <InfoIcon
                            sx={{ fontSize: "17px", color: Colors.SKY_BLUE }}
                          />
                        </Tooltip>
                      )}
                    </Typography>
                  </Grid>
                ) : null}

                {isLumpSumPayment ? (
                  <>
                    {item !== null && (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          paddingLeft: "6%",
                          paddingRight: "6%",
                        }}
                      >
                        <div style={{ width: "100%", display: "flex" }}>
                          <div
                            style={{
                              width: "75%",
                              fontFamily: "Nunito",
                              color: Colors.SKY_BLUE,
                            }}
                          >
                            Repaid Debt
                          </div>
                          <div style={textStyles}>
                            ${item?.repaid_debt || "--"}
                          </div>
                        </div>
                        <div style={{ width: "100%", display: "flex" }}>
                          <div
                            style={{
                              width: "75%",
                              fontFamily: "Nunito",
                              color: Colors.ORANGE_COLOR,
                            }}
                          >
                            Remaining Amount
                          </div>
                          <div style={textStyles}>
                            ${item?.remaining_principle_amount || "--"}
                          </div>
                        </div>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={5}>
                      {!(
                        strategy === "strategy3" &&
                        (rangeNames[index]?.label === "New Default Risk" ||
                          rangeNames[index]?.label === "Weekly True Revenue %")
                      ) && (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              width: "75%",
                              fontFamily: "Nunito",
                              color: Colors.ORANGE_COLOR,
                            }}
                          >
                            <Tooltip title={"Minimum"} placement="top-end">
                              {mediumScreen ? "Min" : "Minimum"}
                            </Tooltip>
                          </div>
                          <div style={textStyles}>
                            {rangeNames[index]?.label === "Weeks Till Paid"
                              ? rangeNames[index]?.label === "Weeks Till Paid"
                                ? item?.[weeksTillPaidTitle]?.["min"] ||
                                  item?.[weeksTillPaidTitle][0]
                                : ""
                              : rangeNames[index]?.label === "New Default Risk"
                              ? `${item?.[title]?.["min"] || "-"}%`
                              : rangeNames[index]?.label?.includes("%")
                              ? `${
                                  parseFloat(
                                    item?.[title]?.["min"]?.toFixed(2)
                                  ) || "-"
                                }%`
                              : `$${
                                  parseFloat(
                                    item?.[title]?.["min"]?.toFixed(2)
                                  ) || "-"
                                }`}
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent:
                            strategy === "strategy3" ? "flex-end" : "auto",
                        }}
                      >
                        {!(
                          strategy === "strategy3" &&
                          (rangeNames[index]?.label === "New Default Risk" ||
                            rangeNames[index]?.label ===
                              "Weekly True Revenue %")
                        ) && (
                          <div
                            style={{
                              width: "75%",
                              fontFamily: "Nunito",
                              color: Colors.SKY_BLUE,
                            }}
                          >
                            <Tooltip title={"Maximum"} placement="top-end">
                              {mediumScreen ? "Max" : "Maximum"}
                            </Tooltip>
                          </div>
                        )}
                        <div style={textStyles}>
                          {rangeNames[index]?.label === "Weeks Till Paid"
                            ? item?.[weeksTillPaidTitle]?.["max"] ||
                              item?.[weeksTillPaidTitle][1]
                            : rangeNames[index]?.label === "New Default Risk"
                            ? `${item?.[title]?.["max"] || "-"}%`
                            : rangeNames[index]?.label?.includes("%")
                            ? `${
                                parseFloat(
                                  item?.[title]?.["max"]?.toFixed(2)
                                ) || "-"
                              }%`
                            : `$${
                                parseFloat(
                                  item?.[title]?.["max"]?.toFixed(2)
                                ) || "-"
                              }`}
                        </div>
                      </div>
                    </Grid>
                  </>
                )}
              </Grid>
            );
          })
        )}
        {strategy === "strategy3" && tabValue !== 2 && (
          <Grid
            container
            sx={{
              width: "100%",
              padding: "10px 8px",
            }}
          >
            <Grid item xs={6.5} sx={{ paddingLeft: "6%" }}>
              <Typography
                sx={{
                  ...commonTextStyles,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Percentage Receivable
                <Tooltip title={"Percentage Receivable"} placement="top-end">
                  <InfoIcon
                    sx={{
                      fontSize: "17px",
                      color: Colors.SKY_BLUE,
                    }}
                  />
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <div
                style={{
                  fontSize: FONT_SIZE_LARGE,
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  float: "right",
                  color: Colors.DARK_GRAY,
                }}
              >
                {`${parseFloat(percentageReceivable).toFixed(2)}%` || "--"}
              </div>
            </Grid>
          </Grid>
        )}
      </Grid>

      {warning !== "" && isLumpSumPayment && (
        <Grid
          item
          xs={12}
          md={5.8}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.WHITE,
            padding: "1rem",
            borderRadius: "10px",
            height: "12rem",
            overflow: "auto",
            ...ScrollbarStyles,
          }}
        >
          <Typography
            sx={{
              fontSize: FONT_SIZE_LARGE,
              fontFamily: "Nunito",
              fontWeight: "700",
              color: Colors.ORANGE_COLOR,
              marginBottom: "1rem",
            }}
          >
            Warning
          </Typography>
          <Typography
            sx={{
              fontSize: FONT_SIZE_LARGE,
              fontFamily: "Nunito",
              fontWeight: "400",
              color: Colors.BLACK,
            }}
          >
            {warning}
          </Typography>
        </Grid>
      )}
    </>
  );
}
