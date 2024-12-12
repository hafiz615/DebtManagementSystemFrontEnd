import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateDebtor } from "../services/services";
import { useToast } from "../toast/toastContext";
import DebtorFields from "./caseCreationFields/debtorFields";
import { phoneNumberFormat } from "../common";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function EditDebtorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
  connectPayment,
  setConnectPayment,
  data,
  showFields,
  showComponent,
  setShowComponent,
}) {
  const { id } = useParams();
  const { showToast } = useToast();
  const parseString = (value) => (value ? String(value).replace(/-/g, "") : "");
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1300px)");
  const [profitMargin, setProfitMargin] = useState(
    caseData?.debtor?.profitMargin || ""
  );
  const debtorBasicInfo =
    caseData?.debtor?.basicInformation || caseData?.DebtorInfo;
  const debtorBusinessInfo =
    caseData?.debtor?.businessInformation || caseData?.BusinessInfo;

  const [loading, setLoading] = useState(false);
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({
    BasicFullName:
      debtorBasicInfo?.fullName || debtorBasicInfo?.["Debtor's Name"] || "",
    BasicEmailAddress:
      debtorBasicInfo?.email ||
      debtorBasicInfo?.["Debtor's Email address"] ||
      "",
    BasicSsid:
      debtorBasicInfo?.SSID ||
      parseString(debtorBasicInfo?.["Debtor's SSN"]) ||
      "",
    BasicState:
      debtorBasicInfo?.state || debtorBasicInfo?.["Debtor's State Name"] || "",
    BasicCity:
      debtorBasicInfo?.city || debtorBasicInfo?.["Debtor's City Name"] || "",
    BasicZipCode:
      debtorBasicInfo?.zipCode || debtorBasicInfo?.["Debtor's Zip code"] || "",
    BasicPhoneNumber:
      debtorBasicInfo?.phone ||
      phoneNumberFormat(debtorBasicInfo?.["Debtor's Phone Number"]) ||
      "",
    BasicAddress:
      debtorBasicInfo?.address || debtorBasicInfo?.["Debtor's Address"] || "",
    BasicWeeklyBudget: debtorBasicInfo?.weeklyBudget || 0,
  });

  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
    businessCompanyName:
      debtorBusinessInfo?.companyName ||
      debtorBusinessInfo?.["Business Legal Name"] ||
      "",
    businessEinNumber:
      debtorBusinessInfo?.EIN ||
      parseString(debtorBusinessInfo?.["Business EIN Number"]) ||
      "",
    businessCategory:
      debtorBusinessInfo?.businessCategory ||
      debtorBusinessInfo?.["Business Category"] ||
      "",
    businessDescription: debtorBusinessInfo?.description || "",
    businessState:
      debtorBusinessInfo?.state ||
      debtorBusinessInfo?.["Business State Name"] ||
      "",
    businessCity:
      debtorBusinessInfo?.city ||
      debtorBusinessInfo?.["Business City Name"] ||
      "",
    businessZipCode:
      debtorBusinessInfo?.zipCode ||
      debtorBusinessInfo?.["Business Zip code"] ||
      "",
    businessPhoneNumber:
      debtorBusinessInfo?.phone ||
      phoneNumberFormat(debtorBusinessInfo?.["Business Phone Number"]) ||
      "",
    businessAddress:
      debtorBusinessInfo?.address ||
      debtorBusinessInfo?.["Business Street Address"] ||
      "",
  });
  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState(debtorBasicInfo?.status || "");
  const [mismatches, setMismatches] = useState({});
  const [errors, setErrors] = useState({
    businessPhone: "",
    einNumber: "",
    ssn: "",
    basicPhone: "",
    emailValid: "",
  });
  const checkFieldMismatch = (value1, value2) => {
    return value1 !== value2;
  };
  const [noteMessage, setNoteMessage] = useState("");
  useEffect(() => {
    if (showFields) {
      const mismatches = {
        BasicFullName: checkFieldMismatch(
          debtorOwnDetails?.BasicFullName,
          data?.debtor?.basicInformation?.fullName
        ),
        BasicEmailAddress: checkFieldMismatch(
          debtorOwnDetails?.BasicEmailAddress,
          data?.debtor?.basicInformation?.email
        ),
        BasicSsid: checkFieldMismatch(
          debtorOwnDetails?.BasicSsid,
          data?.debtor?.basicInformation?.SSID
        ),
        BasicState: checkFieldMismatch(
          debtorOwnDetails?.BasicState,
          data?.debtor?.basicInformation?.state
        ),
        BasicAddress: checkFieldMismatch(
          debtorOwnDetails?.BasicAddress,
          data?.debtor?.basicInformation?.address
        ),
        BasicCity: checkFieldMismatch(
          debtorOwnDetails?.BasicCity,
          data?.debtor?.basicInformation?.city
        ),
        BasicZipCode: checkFieldMismatch(
          debtorOwnDetails?.BasicZipCode,
          data?.debtor?.basicInformation?.zipCode
        ),
        BasicPhoneNumber: checkFieldMismatch(
          debtorOwnDetails?.BasicPhoneNumber,
          data?.debtor?.basicInformation?.phone
        ),
        businessCompanyName: checkFieldMismatch(
          debtorBusinessDetails?.businessCompanyName,
          data?.debtor?.businessInformation?.companyName
        ),
        businessEinNumber: checkFieldMismatch(
          debtorBusinessDetails?.businessEinNumber,
          data?.debtor?.businessInformation?.EIN
        ),
        businessCategory: checkFieldMismatch(
          debtorBusinessDetails?.businessCategory,
          data?.debtor?.businessInformation?.businessCategory
        ),
        businessState: checkFieldMismatch(
          debtorBusinessDetails?.businessState,
          data?.debtor?.businessInformation?.state
        ),
        businessCity: checkFieldMismatch(
          debtorBusinessDetails?.businessCity,
          data?.debtor?.businessInformation?.city
        ),
        businessZipCode: checkFieldMismatch(
          debtorBusinessDetails?.businessZipCode,
          data?.debtor?.businessInformation?.zipCode
        ),
        businessPhoneNumber: checkFieldMismatch(
          debtorBusinessDetails?.businessPhoneNumber,
          data?.debtor?.businessInformation?.phone
        ),
        businessAddress: checkFieldMismatch(
          debtorBusinessDetails?.businessAddress,
          data?.debtor?.businessInformation?.address
        ),
      };

      setMismatches(mismatches);
      const hasMismatch = Object.values(mismatches).some((value) => value);

      if (hasMismatch) {
        setNoteMessage(
          "Note: Highlighted Information does not match with existing Client Information"
        );
      } else {
        setNoteMessage("");
      }
    }
  }, [data, caseData, debtorBusinessDetails, debtorOwnDetails, showFields]);

  const [isFormValid, setIsFormValid] = useState(false);
  // const validateForm = () => {
  //   const ownDetailsValid = Object.values(debtorOwnDetails).every(
  //     (value) => value !== ""
  //   );
  //   const businessDetailsValid = Object.entries(debtorBusinessDetails).every(
  //     ([key, value]) => key === "businessDescription" || value !== ""
  //   );
  //   const noErrors = Object.values(errors).every((error) => error === "");
  //   const isWeeklyBudgetValid = debtorOwnDetails.BasicWeeklyBudget > 0; // Check if weekly budget is greater than 0
  //   return (
  //     ownDetailsValid &&
  //     businessDetailsValid &&
  //     noErrors &&
  //     status !== "" &&
  //     isWeeklyBudgetValid
  //   );
  // };

  // useEffect(() => {
  //   setIsFormValid(validateForm());
  // }, [debtorOwnDetails, debtorBusinessDetails, errors, status]);

  const updateDebtorById = async () => {
    setLoading(true);
    const params = {
      basicInformation: {
        fullName: debtorOwnDetails?.BasicFullName,
        email: debtorOwnDetails?.BasicEmailAddress,
        SSID: debtorOwnDetails?.BasicSsid,
        state: debtorOwnDetails?.BasicState,
        city: debtorOwnDetails?.BasicCity,
        zipCode: debtorOwnDetails?.BasicZipCode,
        status: status,
        phone: debtorOwnDetails?.BasicPhoneNumber,
        address: debtorOwnDetails?.BasicAddress,
        weeklyBudget: debtorOwnDetails?.BasicWeeklyBudget?.toString() || 0,
      },
      businessInformation: {
        companyName: debtorBusinessDetails?.businessCompanyName,
        EIN: debtorBusinessDetails?.businessEinNumber,
        businessCategory: debtorBusinessDetails?.businessCategory,
        description: debtorBusinessDetails?.businessDescription,
        state: debtorBusinessDetails?.businessState,
        city: debtorBusinessDetails?.businessCity,
        zipCode: debtorBusinessDetails?.businessZipCode,
        phone: debtorBusinessDetails?.businessPhoneNumber,
        address: debtorBusinessDetails?.businessAddress,
      },
      profitMargin: Number(profitMargin),
      paymentToken: connectPayment?.paymentToken,
      paymentType: connectPayment?.paymentType,
    };

    const updateDebtor = await UpdateDebtor(caseData?._id || data?._id, params);
    if (updateDebtor?.status === 200) {
      showToast(updateDebtor?.data?.message, "success");
      if (showFields) {
        setShowComponent(true);
      } else {
        handleClose();
      }

      GetCaseDetails(id);
    } else {
      showToast(
        updateDebtor?.response?.data?.message || updateDebtor?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  const showCreditor = () => {
    setShowComponent(false);
  };

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ fontWeight: "600", fontFamily: "Nunito", paddingLeft: "1rem" }}
        >
          Edit Client Details
        </Typography>
        <Close onClick={handleClose} sx={{ marginRight: "1rem" }} />
      </Box>

      <Grid
        container
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DebtorFields
          show="Edit"
          debtorOwnDetails={debtorOwnDetails}
          setDebtorOwnDetails={setDebtorOwnDetails}
          debtorBusinessDetails={debtorBusinessDetails}
          setDebtorBusinessDetails={setDebtorBusinessDetails}
          selectedValue={status}
          setSelectedValue={setStatus}
          loading={loading}
          checked={checked}
          setChecked={setChecked}
          connectPayment={connectPayment}
          setConnectPayment={setConnectPayment}
          errors={errors}
          setErrors={setErrors}
          misMatches={mismatches}
          showFieldError={showFields}
          profitMargin={profitMargin}
          setProfitMargin={setProfitMargin}
        />
      </Grid>
      {showFields && (
        <Grid container>
          <>
            {noteMessage && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid item xs={9}>
                  <Typography
                    sx={{
                      color: Colors.ORANGE_COLOR,
                      fontFamily: "Nunito",
                    }}
                  >
                    {noteMessage}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid item xs={6}>
              <Box
                sx={{
                  fontFamily: "Nunito",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  Previous Client Own Details:
                </Typography>
                <Typography>
                  Full Name: {data?.debtor?.basicInformation?.fullName || "--"}
                </Typography>
                <Typography>
                  Email: {data?.debtor?.basicInformation?.email || "--"}
                </Typography>
                <Typography>
                  SSN: {data?.debtor?.basicInformation?.SSID || "--"}
                </Typography>
                <Typography>
                  State: {data?.debtor?.basicInformation?.state || "--"}
                </Typography>
                <Typography>
                  City: {data?.debtor?.basicInformation?.city || "--"}
                </Typography>
                <Typography>
                  Zip Code: {data?.debtor?.basicInformation?.zipCode || "--"}
                </Typography>
                <Typography>
                  Phone Number: {data?.debtor?.basicInformation?.phone || "--"}
                </Typography>
                <Typography>
                  Address: {data?.debtor?.basicInformation?.address || "--"}
                </Typography>
                <Typography>
                  Weekly Budget:{" "}
                  {data?.debtor?.basicInformation?.weeklyBudget || "--"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  fontFamily: "Nunito",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  Previous Client Business Details:
                </Typography>
                <Typography>
                  Company Name:{" "}
                  {data?.debtor?.businessInformation?.companyName || "--"}
                </Typography>
                <Typography>
                  EIN: {data?.debtor?.businessInformation?.EIN || "--"}
                </Typography>
                <Typography>
                  Business Category:{" "}
                  {data?.debtor?.businessInformation?.businessCategory || "--"}
                </Typography>
                <Typography>
                  Business Description:{" "}
                  {data?.debtor?.businessInformation?.description || "--"}
                </Typography>
                <Typography>
                  State: {data?.debtor?.businessInformation?.state || "--"}
                </Typography>
                <Typography>
                  City: {data?.debtor?.businessInformation?.city || "--"}
                </Typography>
                <Typography>
                  Zip Code: {data?.debtor?.businessInformation?.zipCode || "--"}
                </Typography>
                <Typography>
                  Phone Number:{" "}
                  {data?.debtor?.businessInformation?.phone || "--"}
                </Typography>
                <Typography>
                  Address: {data?.debtor?.businessInformation?.address || "--"}
                </Typography>
              </Box>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: ".8rem",
                marginTop: ".8rem",
                position: "sticky",
                bottom: 0,
                zIndex: 1,
              }}
            >
              <TextButton
                buttonText="Update"
                height="2rem"
                width="8rem"
                marginRight="1rem"
                // disabled={!isFormValid}
                onClick={updateDebtorById}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
                loading={loading}
              />
              <TextButton
                buttonText="Skip"
                height="2rem"
                width="8rem"
                marginTop={smallScreen ? "1rem" : "auto"}
                onClick={showCreditor}
                backgroundColor={Colors.ORANGE_COLOR}
                hoverColor={Colors.ORANGE_COLOR}
              />
            </Grid>
          </>
        </Grid>
      )}
      {!showFields && (
        <Grid container sx={{ justifyContent: "right" }}>
          <TextButton
            buttonText="Save"
            height="2rem"
            width="8rem"
            marginRight="1rem"
            // disabled={!isFormValid}
            onClick={updateDebtorById}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            loading={loading}
          />
        </Grid>
      )}
    </>
  );
}
