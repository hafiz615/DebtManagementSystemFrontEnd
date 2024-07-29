import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import MuiPhoneTextField from "../muiPhoneText";
import AmountTextField from "../amountTextField";
import IntervalTextField from "../intervalFields";
import { PhoneValidation } from "../../constants/appConstants";
import { phoneNumberFormat, swapKeysAndValues } from "../../common";
import useMediaQuery from "@mui/material/useMediaQuery";
import PaymentFields from "../caseCreationFields/paymentFields";
import Dropdown from "./../dropdown";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function CreditorFields({
  debtorCaseData,
  thisCaseData,
  handleCaseDataChange,
  setFinalCaseData,
  finalCaseData,
  caseIndex,
  error,
}) {
  const accountMenuList =
    debtorCaseData &&
    debtorCaseData?.creditorNames?.creditor_names?.map((item, index) => ({
      id: index,
      value: item,
      label: item,
    }));
  const [accountTitle, setAccountTitle] = useState("");
  // thisCaseData?.creditor?.accountTitle
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const { PHONE_NO_CHARACTERS, PHONE_NO_ERROR } = PhoneValidation;
  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const [nameTitleMapping, setNameTitleMapping] = useState(
    swapKeysAndValues(debtorCaseData?.creditorNames?.mapped_data || {})
  );
  const handleAddNewContact = () => {
    const newContact = {
      name: "",
      title: "",
      phone: "",
      email: "",
      country: "",
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

  const handleNumberInputKeyDown = (e) => {
    const invalidChars = ["e", "E", ".", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const today = new Date().toISOString().split("T")[0];
  React.useEffect(() => {
    handleCaseDataChange(caseIndex, "creditor.accountTitle", accountTitle);
  }, [accountTitle]);

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
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.businessInformation.companyName",
                    e.target.value
                  )
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
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.businessInformation.businessCategory",
                    e.target.value
                  )
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
                      border: "none !important",
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
                          border: "none !important",
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
                  value={
                    nameTitleMapping?.[
                      thisCaseData?.creditor?.businessInformation?.companyName
                    ] ?? ""
                  }
                  onChange={(e) =>
                    handleCaseDataChange(
                      caseIndex,
                      "creditor.accountTitle",
                      e.target.value
                    )
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
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.fullName",
                    e.target.value
                  )
                }
              />
              <PaymentsTextFields
                type="text"
                label="Email Address*"
                placeHolderValue="Enter Valid Email"
                width={smallScreen ? "100%" : "97%"}
                value={thisCaseData?.creditor?.basicInformation?.email}
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.email",
                    e.target.value
                  )
                }
                error=""
              />
              <MuiPhoneTextField
                label="Phone #*"
                value={thisCaseData?.creditor?.basicInformation?.phone}
                onChange={(e) =>
                  handleCaseDataChange(
                    caseIndex,
                    "creditor.basicInformation.phone",
                    phoneNumberFormat(e)
                  )
                }
                onKeyDown={handleNumberInputKeyDown}
                error=""
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
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: smallScreen ? "100%" : "97%",
              }}
            />
            {/* <Typography sx={{ fontFamily: "Nunito", fontWeight: "600", marginTop: "0.8rem" }} gutterBottom>
              Security Key*
            </Typography>
            <input
              type="text"
              placeholder="Enter Security Key"
              value={thisCaseData.securityKey}
              onChange={(e) =>
                handleCaseDataChange(caseIndex, "securityKey", e.target.value)
              }
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: smallScreen ? "100%" : "97%",
              }}
            /> */}
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
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "creditor.lastFundedDate",
                e.target.value
              )
            }
            max={today}
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
        <Grid
          container
          item
          xs={12}
          // sx={{ justifyContent: "space-between", marginTop: "1rem" }}
        >
          {/* <PaymentsTextFields
            type="number"
            label="Loan Amount"
            placeHolderValue="Enter Loan Amount"
            width={smallScreen ? "100%" : "97%"}
            value={thisCaseData?.contractDetails?.loanAmount}
            onChange={(e) =>
              handleCaseDataChange(
                caseIndex,
                "contractDetails.loanAmount",
                e.target.value
              )
            }
          /> */}
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
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <IntervalTextField
              label="Purchased Percentage"
              value={thisCaseData?.contractDetails?.purchased_percentage}
              onChange={(e) =>
                handleCaseDataChange(
                  caseIndex,
                  "contractDetails.purchased_percentage",
                  e
                )
              }
              type="percentage"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <IntervalTextField
              label="Repayment Amount"
              value={thisCaseData?.contractDetails?.repayment_amount}
              onChange={(e) =>
                handleCaseDataChange(
                  caseIndex,
                  "contractDetails.repayment_amount",
                  e
                )
              }
              type="currency"
            />
          </Grid>
        </Grid>
      </Grid>

      <PaymentFields
        thisCaseData={thisCaseData}
        handleCaseDataChange={handleCaseDataChange}
        finalCaseData={finalCaseData}
        setFinalCaseData={setFinalCaseData}
        caseIndex={caseIndex}
      />
    </>
  );
}

// <Grid
//   item
//   xs={12}
//   sx={{
//     marginTop: "1rem",
//     borderRadius: "10px",
//     backgroundColor: Colors.WHITE,
//     padding: "1rem",
//   }}
// >
//   <Grid
//     container
//     item
//     xs={12}
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//     }}
//   >
//     <Typography
//       sx={{ fontFamily: "Nunito", fontWeight: "600" }}
//       gutterBottom
//     >
//       Contact Details
//     </Typography>
//     <Add
//       onClick={handleAddNewContact}
//       sx={{
//         backgroundColor: Colors.SKY_BLUE,
//         color: Colors.WHITE,
//         borderRadius: "50%",
//         fontSize: "2.5rem",
//         padding: ".4rem",
//         cursor: "pointer",
//       }}
//     />
//   </Grid>
//   {thisCaseData?.creditor?.contacts?.map((item, index) => {
//     return (
//       <>
//         {index !== 0 && (
//           <Box
//             item
//             xs={12}
//             sx={{
//               display: "flex",
//               justifyContent: "flex-end",
//               width: "100%",
//             }}
//           >
//             <Delete
//               onClick={() => handleRemoveContact(index)}
//               sx={{
//                 backgroundColor: Colors.ORANGE_COLOR,
//                 color: Colors.WHITE,
//                 borderRadius: "50%",
//                 fontSize: "2.5rem",
//                 padding: ".4rem",
//                 cursor: "pointer",
//               }}
//             />
//           </Box>
//         )}
//         {/* <Grid key={index} container item xs={12}>
//         <Grid container item xs={12} md={8}>
//           <PaymentsTextFields
//             type="text"
//             label="Name"
//             placeHolderValue="Enter Name"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.name}
//             onChange={(e) =>
//               handleInputChange(index, "name", e.target.value)
//             }
//           />
//           <PaymentsTextFields
//             type="text"
//             label="Title"
//             placeHolderValue="Enter Title"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.title}
//             onChange={(e) =>
//               handleInputChange(index, "title", e.target.value)
//             }
//           />

//           <MuiPhoneTextField
//             label="Phone #"
//             value={item?.phone}
//             onChange={(e) =>
//               handleInputChange(index, "phone", formatPhoneNumber(e))
//             }
//             onKeyDown={handleNumberInputKeyDown}
//             error=""
//           />
//           <PaymentsTextFields
//             type="text"
//             label="Enter Email"
//             placeHolderValue="Enter Email"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.email}
//             onChange={(e) =>
//               handleInputChange(index, "email", e.target.value)
//             }
//             error=""
//           />

//           <PaymentsTextFields
//             type="text"
//             label="Country (Optional)"
//             placeHolderValue="Country Name"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.country}
//             onChange={(e) =>
//               handleInputChange(index, "country", e.target.value)
//             }
//           />
//           <PaymentsTextFields
//             type="text"
//             label="State (Optional)"
//             placeHolderValue="Enter State"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.state}
//             onChange={(e) =>
//               handleInputChange(index, "state", e.target.value)
//             }
//           />
//           <PaymentsTextFields
//             label="City (Optional)"
//             placeHolderValue="Enter City"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.city}
//             onChange={(e) =>
//               handleInputChange(index, "city", e.target.value)
//             }
//           />
//           <PaymentsTextFields
//             type="number"
//             label="Zip Code (Optional)"
//             placeHolderValue="Enter Zip Code"
//             width={smallScreen ? "100%" : "97%"}
//             value={item?.zipCode}
//             onChange={(e) =>
//               handleInputChange(index, "zipCode", e.target.value)
//             }
//             onKeyDown={handleNumberInput}
//           />
//         </Grid>
//         <Grid
//           container
//           item
//           xs={12}
//           md={4}
//           sx={{ flexDirection: "column" }}
//         >
//           <Typography
//             sx={{
//               fontWeight: "500",
//               fontFamily: "Nunito",
//               marginLeft: "1rem",
//               color: Colors.DARK_GRAY,
//             }}
//           >
//             Relation with Debtor (Optional)
//           </Typography>
//           <input
//             type="text"
//             placeholder="Relation"
//             onChange={(e) =>
//               handleInputChange(
//                 index,
//                 "relationWithDebtor",
//                 e.target.value
//               )
//             }
//             value={item?.relationWithDebtor}
//             style={{
//               backgroundColor: Colors.BG_LIGHT_GRAY,
//               height: "2.5rem",
//               color: Colors.DIM_LIGHT_GRAY,
//               paddingLeft: "1rem",
//               border: "none",
//               outline: "none",
//               borderRadius: "5px",
//               width: smallScreen ? "100%" : "97%",
//             }}
//           />
//         </Grid>
//       </Grid> */}
//         <hr></hr>
//       </>
//     );
//   })}
// </Grid>
