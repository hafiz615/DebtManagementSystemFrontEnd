import React from "react";
import Typography from "@mui/material/Typography";
import { Grid, Box } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { Colors } from "../../config/default";
import PaymentsTextFields from "../caseTextField";
import MuiPhoneNumber from "material-ui-phone-number";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CreditorFields({
  creditorBasicsInfo,
  setCreditorBasicsInfo,
  creditorBusinessDetails,
  setCreditorBusinessDetails,
  creditorContactDetails,
  setCreditorContactDetails,
  CreditorNotes,
  setCreditorNotes,
  fundedDate,
  setFundedDate,
  historicRange,
  setHistoricRange,
  creditorFieldsError,
  setCreditorFieldsError,
  creditorContactError,
  setCreditorContactError,
  creditorContactEmailError,
  setCreditorContactEmailError,
}) {
  const isEmailValid = (email) => {
    // Use a more robust email validation regular expression
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const formatPhoneNumber = (value) => {
    const spaceReplace = value?.replace(/ /g, "");
    const phoneFormat = spaceReplace?.replace(/[^+a-zA-Z 0-9]+/g, "");
    return phoneFormat;
  };
  const basicInfoInputChange = (fieldName, value) => {
    if (fieldName === "CreditorBasicEmailAddress") {
      if (!isEmailValid(value)) {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          emailValidError: "Email must be valid",
        }));
      } else {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          emailValidError: "",
        }));
      }
    }
    if (fieldName === "CreditorBasicPhoneNumber") {
      if (value.length !== 11) {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: "Phone number must be 10 digits",
        }));
      } else {
        setCreditorFieldsError((prevErrors) => ({
          ...prevErrors,
          creditorPhoneError: "",
        }));
      }
    }
  };
  const businessInfoInputChange = (fieldName, value) => {
    setCreditorBusinessDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  const notesInputChange = (value) => {
    setCreditorNotes(value);
  };
  const fundedInputChange = (value) => {
    setFundedDate(value);
  };

  const historicInputChange = (fieldName, value) => {
    if (fieldName === "minimum" || fieldName === "maximum") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setHistoricRange((prevState) => ({
          ...prevState,
          [fieldName]: parseInt(value),
        }));
      }
    } else {
      setHistoricRange((prevState) => ({
        ...prevState,
        [fieldName]: parseInt(value),
      }));
    }
  };

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
    setCreditorContactDetails([...creditorContactDetails, newContact]);
  };
  const handleRemoveNewData = (index) => {
    const updatedList = [...creditorContactDetails];
    updatedList.splice(index, 1); // Remove item at the specified index in the copy
    setCreditorContactDetails(updatedList); // Update state with the modified copy
  };
  const handleInputChange = (index, field, value) => {
    const updatedList = [...creditorContactDetails];
    if (field === "email") {
      if (!isEmailValid(value)) {
        setCreditorContactEmailError((prevErrors) => ({
          ...prevErrors,
          [`email${index}`]: "Email must be Valid",
        }));
      } else {
        setCreditorContactEmailError((prevErrors) => ({
          ...prevErrors,
          [`email${index}`]: "",
        }));
      }
    }
    if (field === "phone") {
      if (value.length !== 11) {
        setCreditorContactError((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: "Phone number must be 10 digits",
        }));
      } else {
        setCreditorContactError((prevErrors) => ({
          ...prevErrors,
          [`phone${index}`]: "",
        }));
      }
    }
    if (field === "zipCode") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        updatedList[index][field] = value;
        setCreditorContactDetails(updatedList);
      }
    } else {
      updatedList[index][field] = value;
      setCreditorContactDetails(updatedList);
    }
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
  return (
    <>
      <Grid
        item
        xs={12}
        xl={5.9}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          padding: "1rem",
          height: "350px",
        }}
      >
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
            width="97%"
            value={creditorBusinessDetails?.businessCompanyName}
            onChange={(e) =>
              businessInfoInputChange("businessCompanyName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Business Category*"
            placeHolderValue="Enter Category"
            width="97%"
            value={creditorBusinessDetails?.businessCategory}
            onChange={(e) =>
              businessInfoInputChange("businessCategory", e.target.value)
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
          Creditor Details
        </Typography>
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
          }}
        >
          <PaymentsTextFields
            type="text"
            label="Full Name*"
            placeHolderValue="Enter Full Name"
            width="97%"
            value={creditorBasicsInfo?.CreditorBasicFullName}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicFullName", e.target.value)
            }
          />
          <PaymentsTextFields
            type="text"
            label="Email Address*"
            placeHolderValue="Enter Valid Email"
            width="97%"
            value={creditorBasicsInfo?.CreditorBasicEmailAddress}
            onChange={(e) =>
              basicInfoInputChange("CreditorBasicEmailAddress", e.target.value)
            }
            error={creditorFieldsError?.emailValidError}
          />

          <Grid item xs={12} md={3.9}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Phone #*
            </Typography>
            <MuiPhoneNumber
              sx={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                paddingLeft: ".4rem",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                border: "none !important",
                "& .MuiInputBase-input": {
                  color: Colors.DIM_LIGHT_GRAY,
                  fontSize: ".8rem",
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
              value={creditorBasicsInfo?.CreditorBasicPhoneNumber}
              variant="standard"
              fullWidth
              defaultCountry={"us"}
              disableDropdown={false}
              onChange={(e) =>
                basicInfoInputChange(
                  "CreditorBasicPhoneNumber",
                  formatPhoneNumber(e)
                )
              }
              onKeyDown={handleNumberInputKeyDown}
            />
            {creditorFieldsError?.creditorPhoneError ? (
              <Box
                sx={{
                  color: "red",
                  fontSize: "9.3px",
                  height: smallScreen ? "0.5rem" : "0.7rem",
                }}
              >
                {creditorFieldsError?.creditorPhoneError}
              </Box>
            ) : (
              <Box
                sx={{
                  color: "red",
                  height: smallScreen ? "0.5rem" : "0.7rem",
                }}
              ></Box>
            )}
          </Grid>
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
          value={CreditorNotes}
          onChange={(e) => notesInputChange(e.target.value)}
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px",
            width: "97%",
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        xl={5.9}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
          padding: "1rem",
          height: "350px",
        }}
      >
        <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
          Funded
        </Typography>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Last Funded Date*
          </Typography>
          <PaymentsTextFields
            type="date"
            placeHolderValue="00/00/00"
            width="100%"
            value={fundedDate}
            onChange={(e) => fundedInputChange(e.target.value)}
            max={today}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            marginTop: "1rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
              marginRight: "1rem",
            }}
          >
            Historical Range
          </Typography>

          <Grid
            container
            item
            xs={8}
            sx={{
              marginLeft: "2rem",
            }}
          >
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginRight: ".7rem",
                }}
              >
                Minimum*
              </Typography>
              <PaymentsTextFields
                type="number"
                placeHolderValue="$"
                width="97%"
                value={historicRange?.minimum}
                onChange={(e) => historicInputChange("minimum", e.target.value)}
                onKeyDown={handleNumberInput}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", marginTop: "1rem" }}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  marginRight: ".5rem",
                }}
              >
                Maximum*
              </Typography>
              <PaymentsTextFields
                type="number"
                placeHolderValue="$"
                width="97%"
                value={historicRange?.maximum}
                onChange={(e) => historicInputChange("maximum", e.target.value)}
                onKeyDown={handleNumberInput}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1rem",
          borderRadius: "10px",
          backgroundColor: Colors.WHITE,
          padding: "1rem",
        }}
      >
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontFamily: "Nunito", fontWeight: "600" }}
            gutterBottom
          >
            Contact Details
          </Typography>
          <Add
            onClick={handleAddNewContact}
            sx={{
              backgroundColor: Colors.SKY_BLUE,
              color: Colors.WHITE,
              borderRadius: "50%",
              fontSize: "2.5rem",
              padding: ".4rem",
            }}
          />
        </Grid>
        {creditorContactDetails?.map((item, index) => {
          return (
            <>
              {index !== 0 && (
                <Box
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Delete
                    onClick={() => handleRemoveNewData(index)}
                    sx={{
                      backgroundColor: Colors.ORANGE_COLOR,
                      color: Colors.WHITE,
                      borderRadius: "50%",
                      fontSize: "2.5rem",
                      padding: ".4rem",
                    }}
                  />
                </Box>
              )}
              <Grid key={index} container item xs={12}>
                <Grid container item xs={12} md={8}>
                  <PaymentsTextFields
                    type="text"
                    label="Name"
                    placeHolderValue="Enter Name"
                    width="97%"
                    value={item?.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <PaymentsTextFields
                    type="text"
                    label="Title"
                    placeHolderValue="Enter Title"
                    width="97%"
                    value={item?.title}
                    onChange={(e) =>
                      handleInputChange(index, "title", e.target.value)
                    }
                  />

                  <Grid item xs={12} md={3.9}>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontFamily: "Nunito",
                        marginLeft: "1rem",
                        color: Colors.DARK_GRAY,
                      }}
                    >
                      Phone #*
                    </Typography>
                    <MuiPhoneNumber
                      sx={{
                        backgroundColor: Colors.BG_LIGHT_GRAY,
                        height: "2.5rem",
                        paddingLeft: ".4rem",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        border: "none !important",
                        "& .MuiInputBase-input": {
                          color: Colors.DIM_LIGHT_GRAY,
                          fontSize: ".8rem",
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
                      value={item?.phone}
                      variant="standard"
                      fullWidth
                      defaultCountry={"us"}
                      disableDropdown={false}
                      onChange={(e) =>
                        handleInputChange(index, "phone", formatPhoneNumber(e))
                      }
                      onKeyDown={handleNumberInputKeyDown}
                    />
                    {creditorContactError?.[`phone${index}`] ? (
                      <Box
                        sx={{
                          color: "red",
                          fontSize: "9.3px",
                          height: smallScreen ? "0.5rem" : "0.7rem",
                        }}
                      >
                        {creditorContactError?.[`phone${index}`]}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          color: "red",
                          height: smallScreen ? "0.5rem" : "0.7rem",
                        }}
                      ></Box>
                    )}
                  </Grid>
                  <PaymentsTextFields
                    type="text"
                    label="Enter Email"
                    placeHolderValue="Enter Email"
                    width="97%"
                    value={item?.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                    error={creditorContactEmailError?.[`email${index}`]}
                  />

                  <PaymentsTextFields
                    type="text"
                    label="Country (Optional)"
                    placeHolderValue="Country Name"
                    width="97%"
                    value={item?.country}
                    onChange={(e) =>
                      handleInputChange(index, "country", e.target.value)
                    }
                  />
                  <PaymentsTextFields
                    type="text"
                    label="State (Optional)"
                    placeHolderValue="Enter State"
                    width="97%"
                    value={item?.state}
                    onChange={(e) =>
                      handleInputChange(index, "state", e.target.value)
                    }
                  />
                  <PaymentsTextFields
                    label="City (Optional)"
                    placeHolderValue="Enter City"
                    width="97%"
                    value={item?.city}
                    onChange={(e) =>
                      handleInputChange(index, "city", e.target.value)
                    }
                  />
                  <PaymentsTextFields
                    type="number"
                    label="Zip Code (Optional)"
                    placeHolderValue="Enter Zip Code"
                    width="97%"
                    value={item?.zipCode}
                    onChange={(e) =>
                      handleInputChange(index, "zipCode", e.target.value)
                    }
                    onKeyDown={handleNumberInput}
                  />
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={4}
                  sx={{ flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontFamily: "Nunito",
                      marginLeft: "1rem",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Relation with Debtor (Optional)
                  </Typography>
                  <input
                    type="text"
                    placeholder="Relation"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "relationWithDebtor",
                        e.target.value
                      )
                    }
                    value={item?.relationWithDebtor}
                    style={{
                      backgroundColor: Colors.BG_LIGHT_GRAY,
                      height: "2.5rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      paddingLeft: "1rem",
                      border: "none",
                      outline: "none",
                      borderRadius: "5px",
                      width: "80%",
                    }}
                  />
                </Grid>
              </Grid>
              <hr></hr>
            </>
          );
        })}
      </Grid>
    </>
  );
}
