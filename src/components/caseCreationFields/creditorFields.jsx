import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box, TextField, Slider } from "@mui/material";
import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import AmountTextField from "../amountTextField";

import { swapKeysAndValues } from "../../common";
import useMediaQuery from "@mui/material/useMediaQuery";
import PaymentFields from "../caseCreationFields/paymentFields";
import Autocomplete from "@mui/material/Autocomplete";
import { handleNumberInput } from "../../common";

export default function CreditorFields({
  debtorCaseData,
  thisCaseData,
  handleCaseDataChange,
  setFinalCaseData,
  finalCaseData,
  caseIndex,
  digits,
  setDigits,
  errors,
  businessErrors,
  showErrors,
}) {
  const accountMenuList =
    debtorCaseData &&
    debtorCaseData?.creditorNames?.creditor_names?.map((item, index) => ({
      id: index,
      value: item,
      label: item,
    }));

  const [accountTitle, setAccountTitle] = useState(
    thisCaseData?.creditor?.accountTitle || thisCaseData?.accountTitle || ""
  );

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const [nameTitleMapping, setNameTitleMapping] = useState(
    swapKeysAndValues(debtorCaseData?.creditorNames?.mapped_data || {})
  );
  const handleAddNewContact = () => {
    const newContact = {
      name: "",
      title: "",
      phone: "",
      email: "",
      state: "",
      city: "",
      zipCode: "",
      relationWithDebtor: "",
    };

    // Create a new array of contacts with the new contact added
    const updatedFinalCaseData = finalCaseData?.map((creditor, index) => {
      if (index === caseIndex) {
        return {
          ...creditor,
          creditor: {
            ...creditor.creditor,
            contacts: [...creditor?.creditor?.contacts, newContact],
          },
        };
      }
      return creditor;
    });

    // Update the state with the new array
    setFinalCaseData(updatedFinalCaseData);
  };

  useEffect(() => {
    const validationCodeString = digits;
    handleCaseDataChange(
      caseIndex,
      "creditor.aggression",
      parseInt(validationCodeString)
    );
  }, [digits]);

  const handleRemoveContact = (contactIndex) => {
    // Create a new array of finalCaseData with the updated contacts
    const updatedFinalCaseData = finalCaseData?.map((creditor, index) => {
      if (index === caseIndex) {
        // Create a new array of contacts excluding the one to remove
        const updatedContacts = creditor?.creditor?.contacts?.filter(
          (_, cIndex) => cIndex !== contactIndex
        );

        return {
          ...creditor,
          creditor: {
            ...creditor.creditor,
            contacts: updatedContacts,
          },
        };
      }
      return creditor;
    });

    // Update the state with the new array
    setFinalCaseData(updatedFinalCaseData);
  };

  const handleSliderChange = (event, newValue) => {
    setDigits([newValue]);
  };

  const today = new Date().toISOString().split("T")[0];
  React.useEffect(() => {
    handleCaseDataChange(caseIndex, "creditor.accountTitle", accountTitle);
  }, [accountTitle]);
  const hasError = (field) => {
    return businessErrors?.some(
      (error) => error?.index === caseIndex && error?.field === field
    );
  };
  return (
    <>
      <Grid
        container
        sx={{
          borderRadius: "10px",
          padding: "1rem",
          backgroundColor: Colors.WHITE,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "10px",
            backgroundColor: Colors.WHITE,
            height: { xl: "420px", xs: "max-content" },
          }}
        >
          <div>
            <Typography
              sx={{ fontFamily: "Nunito", fontWeight: "600" }}
              gutterBottom
            >
              Business Information
            </Typography>
            <Grid container item xs={12}>
              <PaymentsTextFields
                type="text"
                label="Company Name*"
                placeHolderValue="Enter Company Name"
                width={smallScreen ? "100%" : "97%"}
                value={thisCaseData?.creditor?.businessInformation?.companyName}
                onChangeFunction={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.businessInformation.companyName",
                    e.target.value
                  )
                }
                border={
                  hasError("companyName") && showErrors
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
              <PaymentsTextFields
                type="text"
                label="Business Category*"
                placeHolderValue="Enter Category"
                width={smallScreen ? "100%" : "97%"}
                value={
                  thisCaseData?.creditor?.businessInformation?.businessCategory
                }
                onChangeFunction={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.businessInformation.businessCategory",
                    e.target.value
                  )
                }
                border={
                  hasError("businessCategory") && showErrors
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
              {typeof debtorCaseData?.creditorNames !== "string" &&
              debtorCaseData?.creditorNames?.creditor_names?.length > 0 ? (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontFamily: "Nunito",
                      marginLeft: "1.8rem",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Account Title
                  </Typography>
                  <Autocomplete
                    sx={{
                      backgroundColor: Colors.BG_LIGHT_GRAY,
                      color: Colors.DIM_LIGHT_GRAY,
                      height: "2.5rem",
                      width: smallScreen ? "100%" : "97%",
                      marginLeft: "1rem",
                      borderRadius: "5px",
                      display: "flex",
                      fontFamily: "Nunito",
                      justifyContent: "center",
                      border:
                        hasError("accountTitle") && showErrors
                          ? "2px solid red"
                          : "none !important",

                      "& .MuiInputBase-input": {
                        color: Colors.DIM_LIGHT_GRAY,
                        fontSize: ".8rem",
                        fontFamily: "Nunito",
                        "&::placeholder": {
                          color: "#6D6D6D",
                        },
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },
                    }}
                    freeSolo
                    options={accountMenuList?.map((option) => option.label)} // Assuming accountMenuList is an array of objects with a label property
                    value={thisCaseData?.creditor?.accountTitle}
                    onChange={(event, newValue) =>
                      handleCaseDataChange(
                        caseIndex,
                        "creditor.accountTitle",
                        newValue
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        onChange={(e) =>
                          handleCaseDataChange(
                            caseIndex,
                            "creditor.accountTitle",
                            e.target.value
                          )
                        }
                        {...params}
                        placeholder="Account Title"
                        variant="standard"
                        sx={{
                          paddingLeft: "2%",
                          paddingTop: "2%",
                          backgroundColor: Colors.BG_LIGHT_GRAY,
                          width: smallScreen ? "100%" : "97%",
                          border:
                            hasError("accountTitle") && showErrors
                              ? "2px solid red"
                              : "none !important",
                          "& .MuiInputBase-input": {
                            color: Colors.DIM_LIGHT_GRAY,
                            fontSize: ".8rem",
                            fontFamily: "Nunito",
                            "&::placeholder": {
                              color: "#6D6D6D",
                            },
                          },
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                            {
                              borderBottom: "none",
                            },
                        }}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <PaymentsTextFields
                  type="Account Title"
                  label="Account Title"
                  placeHolderValue="Enter Account Title"
                  width="100%"
                  value={thisCaseData?.creditor?.accountTitle}
                  onChangeFunction={(e) =>
                    handleCaseDataChange(
                      caseIndex,
                      "creditor.accountTitle",
                      e.target.value
                    )
                  }
                  border={
                    hasError("accountTitle") && showErrors
                      ? "2px solid red"
                      : "1px solid transparent"
                  }
                />
              )}
            </Grid>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                marginTop: "1rem",
              }}
              gutterBottom
            >
              Creditor Details
            </Typography>
            <Grid container item xs={12} sx={{ display: "flex" }}>
              <PaymentsTextFields
                type="text"
                label="Full Name*"
                placeHolderValue="Enter Full Name"
                width={smallScreen ? "100%" : "97%"}
                value={thisCaseData?.creditor?.basicInformation?.fullName}
                onChangeFunction={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.fullName",
                    e.target.value
                  )
                }
                border={
                  hasError("fullName") && showErrors
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
              <PaymentsTextFields
                type="text"
                label="Email Address*"
                placeHolderValue="Enter Valid Email"
                width={smallScreen ? "100%" : "97%"}
                value={thisCaseData?.creditor?.basicInformation?.email}
                onChangeFunction={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.email",
                    e.target.value
                  )
                }
                error={errors?.emailValid}
                border={
                  hasError("email") && showErrors
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
              <PaymentsTextFields
                type="text"
                label="Phone #"
                placeHolderValue="Enter Phone Number"
                width="100%"
                value={
                  thisCaseData?.creditor?.basicInformation?.phone
                    ? thisCaseData?.creditor?.basicInformation?.phone.startsWith(
                        "+1"
                      )
                      ? thisCaseData?.creditor?.basicInformation?.phone.slice(2)
                      : thisCaseData?.creditor?.basicInformation?.phone
                    : ""
                }
                // value={thisCaseData?.creditor?.basicInformation?.phone}
                onChangeFunction={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.phone",
                    numericValue
                  );
                }}
                error={errors?.basicPhone}
                onKeyDown={handleNumberInput}
                border={
                  hasError("phone") && showErrors
                    ? "2px solid red"
                    : "1px solid transparent"
                }
              />
            </Grid>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                marginTop: "1rem",
              }}
              gutterBottom
            >
              Notes (optional)
            </Typography>
            <input
              type="text"
              placeholder="Notes"
              value={thisCaseData?.creditor?.notes}
              onChange={(e) =>
                handleCaseDataChange(
                  caseIndex,
                  "creditor.notes",
                  e.target.value
                )
              }
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border:
                  hasError("notes") && showErrors ? "2px solid red" : "none",

                outline: "none",
                borderRadius: "5px",
                width: smallScreen ? "100%" : "97%",
              }}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          borderRadius: "10px",
          padding: "1rem",
          backgroundColor: Colors.WHITE,
        }}
      >
        <Grid item xs={12}>
          <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
            Funded
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginLeft: "1rem",
            }}
          >
            Last Funded Date
          </Typography>
          <PaymentsTextFields
            width={smallScreen ? "100%" : "97%"}
            type="date"
            placeHolderValue="00/00/00"
            value={thisCaseData?.creditor?.lastFundedDate}
            onChangeFunction={(e) =>
              handleCaseDataChange(
                caseIndex,
                "creditor.lastFundedDate",
                e.target.value
              )
            }
            max={today}
            border={
              hasError("lastFundedDate") && showErrors
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
            Historical Range
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                  marginLeft: "1rem",
                }}
              >
                Minimum
              </Typography>
              <AmountTextField
                value={thisCaseData?.creditor?.historicalRange?.minimum}
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.historicalRange.minimum",
                    parseFloat(e.target.value)
                  )
                }
                onKeyDown={handleNumberInput}
                border={
                  hasError("historicalRange.minimum") && showErrors
                    ? "2px solid red"
                    : "none !important"
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                  marginLeft: "1rem",
                }}
              >
                Maximum
              </Typography>
              <AmountTextField
                value={thisCaseData?.creditor?.historicalRange?.maximum}
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.historicalRange.maximum",
                    parseFloat(e.target.value)
                  )
                }
                onKeyDown={handleNumberInput}
                border={
                  hasError("historicalRange.maximum") && showErrors
                    ? "2px solid red"
                    : "none !important"
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ padding: "1rem" }}>
        <Typography
          sx={{ fontFamily: "Nunito", fontWeight: "600" }}
          gutterBottom
        >
          Contract Detail
        </Typography>
        <Grid container item xs={12}>
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Loan Amount*
            </Typography>
            <AmountTextField
              width={smallScreen ? "100%" : "97%"}
              value={thisCaseData?.contractDetails?.loan_amount}
              onChange={(e) =>
                handleCaseDataChange(
                  caseIndex,
                  "contractDetails.loan_amount",
                  e.target.value
                )
              }
              border={
                hasError("loan_amount") && showErrors
                  ? "2px solid red"
                  : "none !important"
              }
            />
          </Grid>

          <PaymentsTextFields
            type="text"
            label="Purchased Percentage"
            placeHolderValue="Enter Purchased Percentage"
            width={smallScreen ? "100%" : "97%"}
            value={thisCaseData?.contractDetails?.purchased_percentage}
            onChangeFunction={(e) =>
              handleCaseDataChange(
                caseIndex,
                "contractDetails.purchased_percentage",
                e.target.value
              )
            }
            border={
              hasError("purchased_percentage") && showErrors
                ? "2px solid red"
                : "1px solid transparent"
            }
          />

          <PaymentsTextFields
            type="text"
            label="Repayment Amount"
            placeHolderValue="Enter Repayment Amount"
            width={smallScreen ? "100%" : "97%"}
            value={thisCaseData?.contractDetails?.repayment_amount}
            onChangeFunction={(e) =>
              handleCaseDataChange(
                caseIndex,
                "contractDetails.repayment_amount",
                e.target.value
              )
            }
            border={
              hasError("repayment_amount") && showErrors
                ? "2px solid red"
                : "1px solid transparent"
            }
          />
        </Grid>
      </Grid>

      <PaymentFields
        thisCaseData={thisCaseData}
        handleCaseDataChange={handleCaseDataChange}
        finalCaseData={finalCaseData}
        setFinalCaseData={setFinalCaseData}
        caseIndex={caseIndex}
        businessErrors={businessErrors}
        showErrors={showErrors}
      />
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1rem",
            width: "98%",
          }}
        >
          <Typography
            sx={{ fontFamily: "Nunito", fontWeight: "600" }}
            gutterBottom
          >
            Aggression Level
          </Typography>
          <Slider
            aria-labelledby="aggression-level-slider"
            value={digits[0]}
            onChange={handleSliderChange}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              "& .MuiSlider-track": {
                backgroundColor: Colors.SKY_BLUE,
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#ccc",
              },
              "& .MuiSlider-thumb": {
                backgroundColor: Colors.SKY_BLUE,
              },
              "& .MuiSlider-mark": {
                backgroundColor: "#ccc",
              },
              "& .MuiSlider-markActive": {
                backgroundColor: Colors.SKY_BLUE,
              },
            }}
          />
        </Box>
      </Grid>
    </>
  );
}
