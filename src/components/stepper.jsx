import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import DebtorDetails from "./caseCreation/debtorDetails";
import { DebtorDetailsPage, PAGE_HEIGHT } from "../constants/appConstants";
import TextButton from "./button";
import CreditorDetails from "./caseCreation/creditorDetails";
import PaymentDetails from "./caseCreation/paymentDetails";
import PreviewDetails from "./caseCreation/previewDetails";
import FileUploadComponent from "./caseCreation/uploadFiles";
import {
  CreateCase,
  GetCreditorSearch,
  GetDebtorSearch,
  UploadFiles,
  UploadFilesAi,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import { isEmpty } from "lodash";
import { hasAnyValue, checkContacts } from "../common";
import ScrollbarStyles from "./customScroll";

const steps = ["File upload ", "Debtor", "Creditor", "Payment", "Preview"];

export default function HorizontalLinearStepper({ hide, caseData }) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = React.useState(hide ? 1 : 0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [filteredArray, setFilteredArray] = useState([]);

  const { AUTHORITY_TEXT, DEBTOR_HEADING } = DebtorDetailsPage;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const debtorBasicInfo = caseData?.debtor?.basicInformation;
  const debtorBusinessInfo = caseData?.debtor?.businessInformation;
  //Debtor-Basic-Details-State
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({
    BasicFullName: debtorBasicInfo?.fullName || "",
    BasicEmailAddress: debtorBasicInfo?.email || "",
    BasicSsid: debtorBasicInfo?.SSID || "",
    BasicCountry: debtorBasicInfo?.country || "",
    BasicState: debtorBasicInfo?.state || "",
    BasicCity: debtorBasicInfo?.city || "",
    BasicZipCode: debtorBasicInfo?.zipCode || "",
    BasicPhoneNumber: debtorBasicInfo?.phone || "",
    BasicAddress: debtorBasicInfo?.address || "",
    BasicWeeklyBudget: debtorBasicInfo?.weeklyBudget || "",
  });

  //Debtor-Business-Details-State
  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
    businessCompanyName: debtorBusinessInfo?.companyName || "",
    businessEinNumber: debtorBusinessInfo?.EIN || "",
    businessCategory: debtorBusinessInfo?.businessCategory || "",
    businessDescription: debtorBusinessInfo?.description || "",
    businessCountry: debtorBusinessInfo?.country || "",
    businessState: debtorBusinessInfo?.state || "",
    businessCity: debtorBusinessInfo?.city || "",
    businessZipCode: debtorBusinessInfo?.zipCode || "",
    businessPhoneNumber: debtorBusinessInfo?.phone || "",
    businessAddress: debtorBusinessInfo?.address || "",
  });

  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState(debtorBasicInfo?.status || "");
  //Debtor-Contact-State
  const contacts = !isEmpty(caseData?.debtor?.contacts)
    ? caseData?.debtor?.contacts?.map((contact) => ({
        name: contact?.name || "",
        title: contact?.title || "",
        phone: contact?.phone || "",
        email: contact?.email || "",
        country: contact?.country || "",
        state: contact?.state || "",
        city: contact?.city || "",
        zipCode: contact?.zipCode || "",
        relationWithDebtor: contact?.relationWithDebtor || "",
      }))
    : [
        {
          name: "",
          title: "",
          phone: "",
          email: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
          relationWithDebtor: "",
        },
      ];

  const [debtorContactDetails, setDebtorContactDetails] = useState(contacts);

  const debtorContantHasValue = debtorContactDetails?.some((contact) =>
    hasAnyValue(contact)
  );

  //creditor state
  const [creditorBasicsInfo, setCreditorBasicsInfo] = useState({
    CreditorBasicFullName: "",
    CreditorBasicEmailAddress: "",
    CreditorBasicPhoneNumber: "",
  });
  const [creditorBusinessDetails, setCreditorBusinessDetails] = useState({
    businessCompanyName: "",
    businessCategory: "",
  });
  const [CreditorNotes, setCreditorNotes] = useState("");
  const [securityKey, setSecurityKey] = useState("");

  const [fundedDate, setFundedDate] = useState("");

  const [historicRange, setHistoricRange] = useState({
    minimum: "",
    maximum: "",
  });

  const [creditorContactDetails, setCreditorContactDetails] = useState([
    {
      name: "",
      title: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      relationWithDebtor: "",
    },
  ]);
  const creditorContantHasValue = creditorContactDetails?.some((contact) =>
    hasAnyValue(contact)
  );
  // payment state
  const [totalReceivable, setTotalReceivable] = useState(null);
  const [paidAmount, setPaidAmount] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [lastPaymentDate, setLastPaymentDate] = useState("");
  const [debtorDetailsStatus, setDebtorDetailsStatus] = useState("");
  const [feePayment, setFeePayment] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [newDataList, setNewDataList] = useState([
    {
      amount: "",
      startDate: today,
      timePeriod: "Custom",
      frequency: 1,
    },
  ]);
  //upload files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  //Search Debtor and Creditor State
  const [debtorSearchText, setDebtorSearchText] = useState("");
  const [creditorSearchText, setCreditorSearchText] = useState("");
  //calculation
  const [totalAmount, setTotalAmount] = useState();
  const [walletId, setWalletId] = useState("");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);

  useEffect(() => {
    if (
      totalReceivable !== null &&
      paidAmount !== null &&
      totalReceivable !== "" &&
      paidAmount !== ""
    ) {
      setRemainingAmount(totalReceivable - paidAmount);
    } else {
      setRemainingAmount("");
    }
  }, [totalReceivable, paidAmount]);
  const calculateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      const frequency = item.frequency || 1;
      total += item.amount * frequency;
    });
    return total;
  };

  useEffect(() => {
    const newTotal = calculateTotalAmount(newDataList);
    setTotalAmount(newTotal);
  }, [newDataList]);

  // error messages
  const [errors, setErrors] = useState({
    businessPhone: "",
    einNumber: "",
    ssn: "",
    basicPhone: "",
    emailValid: "",
  });
  const [creditorFieldsError, setCreditorFieldsError] = useState({
    emailValidError: "",
    creditorPhoneError: "",
  });

  //disable button On Empty Fields
  const [contactError, setContactErrors] = useState({});
  const [emailContactError, setEmailContactError] = useState({});
  const [creditorContactError, setCreditorContactError] = useState({});
  const [creditorContactEmailError, setCreditorContactEmailError] = useState(
    {}
  );

  const [connectPayment, setConnectPayment] = useState({
    paymentToken: "",
    paymentType: "",
  });

  const disableButton =
    (activeStep === 1 &&
      (status === "" ||
        (debtorContantHasValue &&
          !isEmpty(emailContactError) &&
          hasAnyValue(emailContactError)) ||
        checkContacts(debtorContactDetails) ||
        (debtorContantHasValue &&
          !isEmpty(contactError) &&
          hasAnyValue(contactError)) ||
        Object.values(debtorOwnDetails)?.some((value) => value === "") ||
        Object.entries(debtorBusinessDetails)
          .filter(([key]) => key !== "businessDescription")
          .some(([key, value]) => value === "") ||
        !!debtorBusinessDetails?.businessDescription?.trim()?.length === 0 ||
        errors?.businessPhone ||
        (walletId === "" &&
          (connectPayment?.paymentToken === "" ||
            connectPayment?.paymentType === "")) ||
        errors?.einNumber ||
        errors?.ssn ||
        errors?.emailValid ||
        errors?.basicPhone)) ||
    (activeStep === 2 &&
      (fundedDate === "" ||
        (creditorContantHasValue &&
          !isEmpty(creditorContactEmailError) &&
          hasAnyValue(creditorContactEmailError)) ||
        checkContacts(creditorContactDetails) ||
        (creditorContantHasValue &&
          !isEmpty(creditorContactError) &&
          hasAnyValue(creditorContactError)) ||
        creditorFieldsError?.emailValidError ||
        creditorFieldsError?.creditorPhoneError ||
        Object.values(creditorBasicsInfo)?.some((value) => value === "") ||
        Object.values(creditorBusinessDetails)?.some((value) => value === "") ||
        Object.values(historicRange).some((value) => value === "") ||
        securityKey === "")) ||
    (activeStep === 3 &&
      (totalReceivable === null ||
        totalReceivable === "" ||
        feePayment === "" ||
        paidAmount === null ||
        paidAmount === "" ||
        remainingAmount === null ||
        remainingAmount === "" ||
        lastPaymentDate === "" ||
        debtorDetailsStatus === "" ||
        parseInt(remainingAmount) !== totalAmount ||
        newDataList?.some((newData) =>
          Object.values(newData)?.some((value) => value === "")
        )));

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const SearchDebtorFields = async (value) => {
    if (value) {
      const params = { text: value };
      const getDebtorDataInSearch = await GetDebtorSearch(params);
      if (getDebtorDataInSearch?.status === 200) {
        const data = getDebtorDataInSearch?.data?.data;
        setFilteredArray(data);
      }
    }
  };
  const handleUploadData = (response) => {
    setWalletId("");

    const parseString = (value) =>
      value ? String(value).replace(/-/g, "") : "";

    const phoneNumberFormat = (phoneNumber) => {
      if (!phoneNumber) return "";

      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove all non-numeric characters

      if (cleanedPhoneNumber.length === 10) {
        return "+1" + cleanedPhoneNumber;
      } else if (cleanedPhoneNumber.length === 11) {
        return "+" + cleanedPhoneNumber;
      }
      return phoneNumber.startsWith("+")
        ? phoneNumber
        : "+" + cleanedPhoneNumber;
    };

    setDebtorOwnDetails({
      BasicFullName: response?.debtor_info["Debtor's Name"] || "",
      BasicEmailAddress: response?.debtor_info["Debtor's Email address"] || "",
      BasicSsid: parseString(response?.debtor_info["Debtor's SSN"] || ""),
      BasicCountry: response?.debtor_info["Debtor's Country Name"] || "",
      BasicState: response?.debtor_info["Debtor's State Name"] || "",
      BasicCity: response?.debtor_info["Debtor's City Name"] || "",
      BasicZipCode: response?.debtor_info["Debtor's Zip code"] || "",
      BasicPhoneNumber:
        phoneNumberFormat(response?.debtor_info["Debtor's Phone Number"]) || "",
      BasicAddress: response?.debtor_info["Debtor's Address"] || "",
      // BasicWeeklyBudget: response?.debtor_info["Debtor's Country Name"] || "",
    });

    // setStatus(debtorData?.basicInformation?.status);
    setDebtorBusinessDetails({
      businessCompanyName:
        response?.bussiness_info["Business Legal Name"] || "",
      businessEinNumber: parseString(
        response?.bussiness_info["Business EIN Number"] || ""
      ),
      businessCategory: response?.bussiness_info["Business Category"] || "",
      // businessDescription: response?.bussiness_info["Business Legal Name"] || "",
      businessCountry: response?.bussiness_info["Business Country Name"] || "",
      businessState: response?.bussiness_info["Business State Name"] || "",
      businessCity: response?.bussiness_info["Business City Name"] || "",
      businessZipCode: response?.bussiness_info["Business Zip code"] || "",
      businessPhoneNumber:
        phoneNumberFormat(response?.bussiness_info["Business Phone Number"]) ||
        "",
      businessAddress:
        response?.bussiness_info["Business Street Address"] || "",
    });

    setCreditorBasicsInfo({
      CreditorBasicFullName: response?.creditor_info["creditor's Name"] || "",
      CreditorBasicEmailAddress:
        response?.creditor_info["creditor's Email address"] || "",
      CreditorBasicPhoneNumber:
        phoneNumberFormat(response?.creditor_info["creditor's Phone Number"]) ||
        "",
    });
  };

  const handleSelect = (debtorData) => {
    setErrors({
      phone: "",
      einNumber: "",
      ssn: "",
      basicPhone: "",
      emailValid: "",
    });
    setEmailContactError({});
    setContactErrors({});
    setDebtorOwnDetails({
      BasicFullName: debtorData?.basicInformation?.fullName || "",
      BasicEmailAddress: debtorData?.basicInformation?.email || "",
      BasicSsid: debtorData?.basicInformation?.SSID || "",
      BasicCountry: debtorData?.basicInformation?.country || "",
      BasicState: debtorData?.basicInformation?.state || "",
      BasicCity: debtorData?.basicInformation?.city || "",
      BasicZipCode: debtorData?.basicInformation?.zipCode || "",
      BasicPhoneNumber: debtorData?.basicInformation?.phone || "",
      BasicAddress: debtorData?.basicInformation?.address || "",
      BasicWeeklyBudget: debtorData?.basicInformation?.weeklyBudget || "",
    });
    setWalletId(debtorData?.customerVaultId || "");
    setStatus(debtorData?.basicInformation?.status);
    setDebtorBusinessDetails({
      businessCompanyName: debtorData?.businessInformation?.companyName || "",
      businessEinNumber: debtorData?.businessInformation?.EIN || "",
      businessCategory: debtorData?.businessInformation?.businessCategory || "",
      businessDescription: debtorData?.businessInformation?.description || "",
      businessCountry: debtorData?.businessInformation?.country || "",
      businessState: debtorData?.businessInformation?.state || "",
      businessCity: debtorData?.businessInformation?.city || "",
      businessZipCode: debtorData?.businessInformation?.zipCode || "",
      businessPhoneNumber: debtorData?.businessInformation?.phone || "",
      businessAddress: debtorData?.businessInformation?.address || "",
    });
    if (!isEmpty(debtorData?.contacts)) {
      setDebtorContactDetails(
        debtorData?.contacts?.map((contact) => ({
          name: contact?.name || "",
          title: contact?.title || "",
          phone: contact?.phone || "",
          email: contact?.email || "",
          country: contact?.country || "",
          state: contact?.state || "",
          city: contact?.city || "",
          zipCode: contact?.zipCode || "",
          relationWithDebtor: contact?.relationWithDebtor || "",
        }))
      );
    } else {
      setDebtorContactDetails([
        {
          name: "",
          title: "",
          phone: "",
          email: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
          relationWithDebtor: "",
        },
      ]);
    }
    setFilteredArray([]);
    setDebtorSearchText("");
  };
  const SearchCreditorFields = async (value) => {
    if (value) {
      const params = { text: value };
      const getCreditorDataInSearch = await GetCreditorSearch(params);
      if (getCreditorDataInSearch?.status === 200) {
        const data = getCreditorDataInSearch?.data?.data;
        setFilteredArray(data);
      }
    }
  };
  const handleCreditorSelect = (creditorData) => {
    setCreditorBasicsInfo({
      CreditorBasicFullName: creditorData?.basicInformation?.fullName || "",
      CreditorBasicEmailAddress: creditorData?.basicInformation?.email || "",
      CreditorBasicPhoneNumber: creditorData?.basicInformation?.phone || "",
    });
    setCreditorContactError({});
    setCreditorContactEmailError({});
    setCreditorFieldsError({
      emailValidError: "",
      creditorPhoneError: "",
    });
    setCreditorBusinessDetails({
      businessCompanyName: creditorData?.businessInformation?.companyName || "",
      businessCategory:
        creditorData?.businessInformation?.businessCategory || "",
    });
    setCreditorNotes(creditorData?.notes || "");
    setSecurityKey(creditorData?.creditorSecurityKey || "");

    const formattedFundedDate = creditorData?.lastFundedDate
      ? new Date(creditorData.lastFundedDate).toISOString().split("T")[0]
      : "";
    setFundedDate(formattedFundedDate || "");
    setHistoricRange({
      minimum: creditorData?.historicalRange?.minimum || "",
      maximum: creditorData?.historicalRange?.maximum || "",
    });
    if (!isEmpty(creditorData?.contacts)) {
      setCreditorContactDetails(
        creditorData?.contacts?.map((contact) => ({
          name: contact?.name || "",
          title: contact?.title || "",
          phone: contact?.phone || "",
          email: contact?.email || "",
          country: contact?.country || "",
          state: contact?.state || "",
          city: contact?.city || "",
          zipCode: contact?.zipCode || "",
          relationWithDebtor: contact?.relationWithDebtor || "",
        }))
      );
    } else {
      setCreditorContactDetails([
        {
          name: "",
          title: "",
          phone: "",
          email: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
          relationWithDebtor: "",
        },
      ]);
    }
    setFilteredArray([]);
    setCreditorSearchText("");
  };

  //Api call
  const handleNext = async () => {
    window.scrollTo(0, 0);
    if (activeStep === 0) {
      setLoading(true);
      const UploadAiData = await UploadFilesAi(uploadedFiles);
      if (UploadAiData?.status === 200) {
        handleUploadData(UploadAiData?.data);
      }
      setLoading(true);
    }
    if (activeStep === steps.length - 1) {
      setLoading(true);
      const isEmpty = (obj) => {
        return Object.values(obj)?.every(
          (value) => value === "" || value == null
        );
      };

      const areAllObjectsEmpty = (arr) => {
        return arr?.every(isEmpty);
      };
      const debtorContacts = areAllObjectsEmpty(debtorContactDetails)
        ? []
        : debtorContactDetails;
      const creditorContacts = areAllObjectsEmpty(creditorContactDetails)
        ? []
        : creditorContactDetails;
      const modifiedArray = newDataList?.map((obj) => {
        if (obj?.timePeriod === "Custom") {
          return { ...obj, frequency: 0 };
        }
        return obj;
      });

      const uploadFile = await UploadFiles(uploadedFiles);
      if (uploadFile?.status === 200) {
        const params = {
          debtor: {
            basicInformation: {
              fullName: debtorOwnDetails?.BasicFullName,
              email: debtorOwnDetails?.BasicEmailAddress,
              SSID: debtorOwnDetails?.BasicSsid,
              status: status,
              country: debtorOwnDetails?.BasicCountry,
              state: debtorOwnDetails?.BasicState,
              city: debtorOwnDetails?.BasicCity,
              zipCode: debtorOwnDetails?.BasicZipCode,
              phone: debtorOwnDetails?.BasicPhoneNumber,
              address: debtorOwnDetails?.BasicAddress,
              weeklyBudget: debtorOwnDetails?.BasicWeeklyBudget || "",
            },
            businessInformation: {
              companyName: debtorBusinessDetails?.businessCompanyName,
              EIN: debtorBusinessDetails?.businessEinNumber,
              businessCategory: debtorBusinessDetails?.businessCategory,
              description: debtorBusinessDetails?.businessDescription,
              country: debtorBusinessDetails?.businessCountry,
              state: debtorBusinessDetails?.businessState,
              city: debtorBusinessDetails?.businessCity,
              zipCode: debtorBusinessDetails?.businessZipCode,
              phone: debtorBusinessDetails?.businessPhoneNumber,
              address: debtorBusinessDetails?.businessAddress,
            },
            contacts: debtorContacts,
          },
          paymentToken: connectPayment?.paymentToken,
          paymentType: connectPayment?.paymentType,
          creditor: {
            basicInformation: {
              fullName: creditorBasicsInfo?.CreditorBasicFullName,
              email: creditorBasicsInfo?.CreditorBasicEmailAddress,
              phone: creditorBasicsInfo?.CreditorBasicPhoneNumber,
            },
            businessInformation: {
              companyName: creditorBusinessDetails?.businessCompanyName,
              businessCategory: creditorBusinessDetails?.businessCategory,
            },
            notes: CreditorNotes,
            creditorSecurityKey: securityKey,
            lastFundedDate: fundedDate,
            historicalRange: historicRange,
            contacts: creditorContacts,
          },
          status: debtorDetailsStatus,
          totalDebt: parseInt(totalReceivable),
          feePayment: feePayment,
          lastPaymentDate: lastPaymentDate,
          paidAmount: parseInt(paidAmount),
          remaining: parseInt(remainingAmount),
          documents: uploadFile?.data?.data || [],
          intervals: modifiedArray,
        };

        const caseCreation = await CreateCase(params, false);

        if (caseCreation?.status === 201) {
          showToast(caseCreation?.data?.message, "success");
          setDebtorOwnDetails({
            BasicFullName: "",
            BasicEmailAddress: "",
            BasicSsid: "",
            BasicCountry: "",
            BasicState: "",
            BasicCity: "",
            BasicZipCode: "",
            BasicPhoneNumber: "",
            BasicAddress: "",
            BasicWeeklyBudget: "",
          });
          setDebtorBusinessDetails({
            businessCompanyName: "",
            businessEinNumber: "",
            businessCategory: "",
            businessDescription: "",
            businessCountry: "",
            businessState: "",
            businessCity: "",
            businessZipCode: "",
            businessPhoneNumber: "",
            businessAddress: "",
          });
          setDebtorContactDetails([
            {
              name: "",
              title: "",
              phone: "",
              email: "",
              country: "",
              state: "",
              city: "",
              zipCode: "",
              relationWithDebtor: "",
            },
          ]);
          setChecked(false);
          setStatus("Customer");
          setCreditorBasicsInfo({
            CreditorBasicFullName: "",
            CreditorBasicEmailAddress: "",
            CreditorBasicPhoneNumber: "",
          });
          setCreditorBusinessDetails({
            businessCompanyName: "",
            businessCategory: "",
          });
          setFundedDate("");
          setCreditorNotes("");
          setSecurityKey("");

          setHistoricRange({
            minimum: "",
            maximum: "",
          });
          setDebtorDetailsStatus("");
          setLastPaymentDate("");
          setRemainingAmount(null);
          setPaidAmount(null);
          setTotalReceivable(null);
          setFeePayment("");
          setFiles([]);
          setCompletedSteps(null);
          setNewDataList([
            {
              amount: "",
              startDate: "",
              timePeriod: "",
            },
          ]);
          setCreditorContactDetails([
            {
              name: "",
              title: "",
              phone: "",
              email: "",
              country: "",
              state: "",
              city: "",
              zipCode: "",
              relationWithDebtor: "",
            },
          ]);
          setUploadedFiles([]);
          setWalletId("");
          setDebtorSearchText("");
          setCreditorSearchText("");
          setActiveStep(0);
        } else {
          const errorMessage = caseCreation?.response?.data?.message;
          showToast(errorMessage, "error");
        }
      } else {
        showToast(uploadFile?.response?.data?.message, "error");
      }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setCompletedSteps((prevCompletedSteps) =>
        new Set(prevCompletedSteps)?.add(activeStep)
      );
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    setLoading(false);
  };
  const handleStep = (step) => () => {
    if (
      (step === activeStep + 1 && !disableButton) ||
      completedSteps?.has(step) ||
      step < activeStep
    ) {
      setActiveStep(step);
    }
  };
  const handleBack = () => {
    window.scrollTo(0, 0);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const resetAll = () => {
    localStorage.setItem("route", "home");
    navigate("/home");
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      {!hide && (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: smallScreen ? "flex-start" : "flex-end",
            marginTop: "1.5rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
            }}
          >
            {AUTHORITY_TEXT} <span>{role}</span>
          </Typography>
        </Grid>
      )}

      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          {DEBTOR_HEADING}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              width: {
                xs: "100%",
                md: "50%",
                color: Colors.SKY_BLUE,
              },
            }}
          >
            {steps?.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    {...labelProps}
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleStep(index)();
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Grid>

        <React.Fragment>
          {activeStep === 0 ? (
            <FileUploadComponent
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              files={files}
              setFiles={setFiles}
            />
          ) : activeStep === 1 ? (
            <DebtorDetails
              debtorOwnDetails={debtorOwnDetails}
              setDebtorOwnDetails={setDebtorOwnDetails}
              debtorBusinessDetails={debtorBusinessDetails}
              setDebtorBusinessDetails={setDebtorBusinessDetails}
              debtorContactDetails={debtorContactDetails}
              setDebtorContactDetails={setDebtorContactDetails}
              selectedValue={status}
              setSelectedValue={setStatus}
              checked={checked}
              setChecked={setChecked}
              searchText={debtorSearchText}
              setSearchText={setDebtorSearchText}
              SearchFields={SearchDebtorFields}
              loading={loading}
              errors={errors}
              setErrors={setErrors}
              setContactErrors={setContactErrors}
              contactError={contactError}
              emailContactError={emailContactError}
              setEmailContactError={setEmailContactError}
              filteredArray={filteredArray}
              handleSelect={handleSelect}
              setFilteredArray={setFilteredArray}
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
              walletId={walletId}
            />
          ) : activeStep === 2 ? (
            <CreditorDetails
              creditorBasicsInfo={creditorBasicsInfo}
              CreditorNotes={CreditorNotes}
              setCreditorNotes={setCreditorNotes}
              securityKey={securityKey}
              setSecurityKey={setSecurityKey}
              fundedDate={fundedDate}
              setFundedDate={setFundedDate}
              historicRange={historicRange}
              setHistoricRange={setHistoricRange}
              setCreditorBasicsInfo={setCreditorBasicsInfo}
              creditorBusinessDetails={creditorBusinessDetails}
              setCreditorBusinessDetails={setCreditorBusinessDetails}
              creditorContactDetails={creditorContactDetails}
              setCreditorContactDetails={setCreditorContactDetails}
              searchText={creditorSearchText}
              setSearchText={setCreditorSearchText}
              SearchFields={SearchCreditorFields}
              loading={loading}
              creditorFieldsError={creditorFieldsError}
              setCreditorFieldsError={setCreditorFieldsError}
              creditorContactError={creditorContactError}
              setCreditorContactError={setCreditorContactError}
              creditorContactEmailError={creditorContactEmailError}
              setCreditorContactEmailError={setCreditorContactEmailError}
              handleSelect={handleCreditorSelect}
              filteredArray={filteredArray}
              setFilteredArray={setFilteredArray}
            />
          ) : activeStep === 3 ? (
            <PaymentDetails
              totalReceivable={totalReceivable}
              setTotalReceivable={setTotalReceivable}
              setFeePayment={setFeePayment}
              feePayment={feePayment}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              remainingAmount={remainingAmount}
              setRemainingAmount={setRemainingAmount}
              lastPaymentDate={lastPaymentDate}
              setLastPaymentDate={setLastPaymentDate}
              selectedValue={debtorDetailsStatus}
              setSelectedValue={setDebtorDetailsStatus}
              newDataList={newDataList}
              setNewDataList={setNewDataList}
              totalAmount={totalAmount}
            />
          ) : activeStep === 4 ? (
            <PreviewDetails
              debtorOwnDetails={debtorOwnDetails}
              creditorBasicsInfo={creditorBasicsInfo}
              creditorBusinessDetails={creditorBusinessDetails}
              newDataList={newDataList}
              totalReceivable={totalReceivable}
              feePayment={feePayment}
              paidAmount={paidAmount}
              remainingAmount={remainingAmount}
              status={status}
              fundedDate={fundedDate}
              CreditorNotes={CreditorNotes}
            />
          ) : (
            ""
          )}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              marginTop: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "space-between",
                  sm: "flex-end",
                },
                width: "100%",
                backgroundColor: Colors.BG_LIGHT_GRAY,
              }}
            >
              <TextButton
                buttonText="BACK"
                disabled={activeStep === 0}
                onClick={handleBack}
                backgroundColor={Colors.ORANGE_COLOR}
                hoverColor={Colors.ORANGE_COLOR}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                marginRight={smallScreen ? "8px" : "1rem"}
              />
              <TextButton
                buttonText="RESET"
                onClick={handleReset}
                backgroundColor={Colors.DARK_GRAY}
                hoverColor={Colors.DARK_GRAY}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                marginRight={smallScreen ? "8px" : "1rem"}
              />
              <TextButton
                width={smallScreen ? "12rem" : "max-content"}
                buttonText="RESET ALL"
                onClick={resetAll}
                backgroundColor={Colors.DARK_GRAY}
                hoverColor={Colors.DARK_GRAY}
                paddingLeft={smallScreen ? "10px" : "2rem"}
                paddingRight={smallScreen ? "10px" : "2rem"}
                height="2rem"
                marginRight={smallScreen ? "8px" : "1rem"}
              />
              <TextButton
                buttonText={activeStep === steps.length - 1 ? "SAVE" : "NEXT"}
                loading={loading}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                onClick={() => {
                  handleNext();
                }}
                marginRight={smallScreen ? "8px" : "1rem"}
                disabled={disableButton || loading}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </Grid>
    </Grid>
  );
}
