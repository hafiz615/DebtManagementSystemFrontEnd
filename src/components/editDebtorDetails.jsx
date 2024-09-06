import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateDebtor } from "../services/services";
import { useToast } from "../toast/toastContext";
import DebtorFields from "./caseCreationFields/debtorFields";

export default function EditDebtorDetail({
  handleClose,
  caseData,
  GetCaseDetails,
  connectPayment,
  setConnectPayment,
}) {
  const { id } = useParams();
  const { showToast } = useToast();

  const debtorBasicInfo = caseData?.debtor?.basicInformation;
  const debtorBusinessInfo = caseData?.debtor?.businessInformation;
  const [loading, setLoading] = useState(false);
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({
    BasicFullName: debtorBasicInfo?.fullName || "",
    BasicEmailAddress: debtorBasicInfo?.email || "",
    BasicSsid: debtorBasicInfo?.SSID || "",
    BasicState: debtorBasicInfo?.state || "",
    BasicCity: debtorBasicInfo?.city || "",
    BasicZipCode: debtorBasicInfo?.zipCode || "",
    BasicPhoneNumber: debtorBasicInfo?.phone || "",
    BasicAddress: debtorBasicInfo?.address || "",
    BasicWeeklyBudget: debtorBasicInfo?.weeklyBudget || 0,
  });

  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
    businessCompanyName: debtorBusinessInfo?.companyName || "",
    businessEinNumber: debtorBusinessInfo?.EIN || "",
    businessCategory: debtorBusinessInfo?.businessCategory || "",
    businessDescription: debtorBusinessInfo?.description || "",
    businessState: debtorBusinessInfo?.state || "",
    businessCity: debtorBusinessInfo?.city || "",
    businessZipCode: debtorBusinessInfo?.zipCode || "",
    businessPhoneNumber: debtorBusinessInfo?.phone || "",
    businessAddress: debtorBusinessInfo?.address || "",
  });
  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState(debtorBasicInfo?.status || "");
  const [errors, setErrors] = useState({
    businessPhone: "",
    einNumber: "",
    ssn: "",
    basicPhone: "",
    emailValid: "",
  });

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
      paymentToken: connectPayment?.paymentToken,
      paymentType: connectPayment?.paymentType,
    };
    const updateDebtor = await UpdateDebtor(caseData?._id, params);
    if (updateDebtor?.status === 200) {
      showToast(updateDebtor?.data?.message, "success");
      handleClose();
      GetCaseDetails(id);
    } else {
      showToast(
        updateDebtor?.response?.data?.message || updateDebtor?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ fontWeight: "600", fontFamily: "Nunito", paddingLeft: "1rem" }}
        >
          Edit Debtor Details
        </Typography>
        <Close sx={{ marginRight: "1rem" }} />
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
        />
      </Grid>
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
    </>
  );
}
