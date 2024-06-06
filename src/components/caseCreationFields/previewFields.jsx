import * as React from "react";

import { Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CreateIcon from "@mui/icons-material/Create";

import { Colors } from "../../config/default";

export default function BasicCard({
  cardHeading,
  height,
  previewDebtorDetails,
  previewCreditorDetails,
  previewSettlementPlan,
  debtorOwnDetails,
  creditorBasicsInfo,
  newDataList,
  status,
  fundedDate,
  CreditorNotes,
  creditorBusinessDetails,
  totalReceivable,
  paidAmount,
  feePayment,
}) {
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  function getReadablePaymentMethod(paymentMethod) {
    const paymentMapping = {
      paidViaCash: "Via Cash",
      toPay: "To Pay",
      paidViaThirdParty: "Third Party",
    };

    return paymentMapping[paymentMethod] || paymentMethod;
  }
  return (
    <Card
      sx={{
        borderRadius: "10px",
        height: height,
        marginTop: { xs: ".5rem", xl: "0rem" },
      }}
    >
      <CardContent>
        {previewDebtorDetails ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              {cardHeading}
              <CreateIcon sx={{ fontSize: "1rem", marginLeft: "0.5rem" }} />
            </Typography>

            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    width: "40%",
                  }}
                >
                  Full Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    width: "50%",
                  }}
                >
                  {debtorOwnDetails?.BasicFullName || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                    // textWrap: "wrap !important",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {debtorOwnDetails?.BasicEmailAddress || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  SSN
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicSsid || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Status
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {status || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Country
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicCountry || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  State
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicState || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  City
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicCity || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Zip Code
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicZipCode || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Phone #.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {debtorOwnDetails?.BasicPhoneNumber || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Address
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {debtorOwnDetails?.BasicAddress || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={3}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Budget
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {debtorOwnDetails?.BasicWeeklyBudget || "-"}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : previewCreditorDetails ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              {cardHeading}
              <CreateIcon sx={{ fontSize: "1rem", marginLeft: "0.5rem" }} />
            </Typography>
            <Grid container item sx={{ marginTop: "1rem" }}>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    width: "40%",
                  }}
                >
                  Full Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    color: Colors.DARK_GRAY,
                    width: "50%",
                  }}
                >
                  {creditorBasicsInfo?.CreditorBasicFullName || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {creditorBasicsInfo?.CreditorBasicEmailAddress || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  Phone #
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {creditorBasicsInfo?.CreditorBasicPhoneNumber || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Funded
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {formatDate(fundedDate || "-")}
                </Typography>
              </Grid>

              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Notes
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {CreditorNotes || "-"}
                </Typography>
              </Grid>
              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Company Name
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {creditorBusinessDetails?.businessCompanyName || "-"}
                </Typography>
              </Grid>

              <Grid container item xs={12} lg={4}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    width: "40%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Business Category
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    width: "50%",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  {creditorBusinessDetails?.businessCategory || "-"}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : previewSettlementPlan ? (
          <>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
              }}
            >
              {cardHeading}
            </Typography>
            <Grid container item>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginLeft: "2rem",
                }}
              >
                Total Receivable
                <span style={{ marginLeft: "1rem" }}>${totalReceivable}</span>
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginLeft: "2rem",
                }}
              >
                Paid Amount
                <span style={{ marginLeft: "1rem" }}>${paidAmount}</span>
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginLeft: "2rem",
                }}
              >
                Fee Payment
                <span style={{ marginLeft: "1rem" }}>
                  {getReadablePaymentMethod(feePayment)}
                </span>
              </Typography>
            </Grid>

            <Grid
              container
              item
              xs={12}
              sx={{
                borderRadius: "10px",
                border: "1px  solid #D9D9D9",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                paddingRight: "1rem",
                paddingLeft: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                overflowY: "auto",
                maxHeight: "15rem",
              }}
            >
              {newDataList?.map((item, index) => {
                return (
                  <Grid container item>
                    <Grid container item xs={12} lg={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          width: "40%",
                        }}
                      >
                        Debt
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "500",
                          color: Colors.DARK_GRAY,
                          width: "50%",
                        }}
                      >
                        {item?.amount}
                      </Typography>
                    </Grid>

                    <Grid container item xs={12} lg={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          width: "40%",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        Time Period
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "500",
                          width: "50%",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        {item?.timePeriod}
                      </Typography>
                    </Grid>
                    {item?.timePeriod !== "Custom" && (
                      <Grid container item xs={12} lg={3}>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontWeight: "600",
                            width: "40%",
                            color: Colors.DARK_GRAY,
                          }}
                        >
                          Frequency
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontWeight: "500",
                            width: "50%",
                            color: Colors.DARK_GRAY,
                          }}
                        >
                          {item?.frequency}
                        </Typography>
                      </Grid>
                    )}

                    <Grid container item xs={12} lg={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          width: "40%",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        Start Date
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "500",
                          width: "50%",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        {formatDate(item?.startDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          ""
        )}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
