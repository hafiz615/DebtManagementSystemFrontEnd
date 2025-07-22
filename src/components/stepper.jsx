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
import {
  DebtorDetailsPage,
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  PAGE_HEIGHT,
} from "../constants/appConstants";
import TextButton from "./button";
import CreditorDetails from "./caseCreation/creditorDetails";
import FileUploadComponent from "./caseCreation/FileUploadComponent/uploadFiles";
import {
  CreateCreditorCase,
  GetCreditorSearch,
  GetDebtorSearch,
  CreateDebtor,
  UploadFiles,
  ExtractContractData,
} from "../services/services";
import { useToast } from "../toast/toastContext";
import { isEmpty } from "lodash";
import { hasAnyValue, phoneNumberFormat, sanitizeText } from "../common";
import ScrollbarStyles from "./customScroll";

const steps = ["File upload ", "Client", "Creditor"];

export default function HorizontalLinearStepper({ hide, caseData }) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [activeStep, setActiveStep] = React.useState(hide ? 1 : 0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [filteredArray, setFilteredArray] = useState([]);
  // const [isStatus200, setIsStatus200] = useState(false);

  const { AUTHORITY_TEXT, DEBTOR_HEADING } = DebtorDetailsPage;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:768px)");
  const debtorBasicInfo = caseData?.debtor?.basicInformation;
  const debtorBusinessInfo = caseData?.debtor?.businessInformation;
  //Debtor-Basic-Details-State
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

  //Debtor-Business-Details-State
  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
    businessCompanyName: debtorBusinessInfo?.companyName || "",
    businessEinNumber: debtorBusinessInfo?.EIN || "",
    businessState: debtorBusinessInfo?.state || "",
    businessCity: debtorBusinessInfo?.city || "",
    businessZipCode: debtorBusinessInfo?.zipCode || "",
    businessAddress: debtorBusinessInfo?.address || "",
  });

  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState(debtorBasicInfo?.status || "");
  const [businessType, setBusinessType] = useState(
    debtorBusinessInfo?.businessCategory || "Construction"
  );
  const [extractedData, setExtractedData] = useState({});
  const [inputKey, setInputKey] = useState(Date.now());
  //Debtor-Contact-State
  const contacts = !isEmpty(caseData?.debtor?.contacts)
    ? caseData?.debtor?.contacts?.map((contact) => ({
        name: contact?.name || "",
        phone: contact?.phone
          ? contact?.phone.startsWith("+1")
            ? contact?.phone.slice(2)
            : contact?.phone
          : "",
        email: contact?.email || "",
      }))
    : [
        {
          name: "",
          phone: "",
          email: "",
        },
      ];

  const [debtorContactDetails, setDebtorContactDetails] = useState(contacts);

  const debtorContantHasValue = debtorContactDetails?.some((contact) =>
    hasAnyValue(contact)
  );

  //creditor state
  const [creditors, setCreditors] = useState([]);

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
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [lawsuitFiles, setLawsuitFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);

  //Search Debtor and Creditor State
  const [debtorSearchText, setDebtorSearchText] = useState("");
  const [creditorSearchText, setCreditorSearchText] = useState("");
  //calculation
  const [totalAmount, setTotalAmount] = useState();
  const [walletId, setWalletId] = useState("");
  const [finalCaseData, setFinalCaseData] = useState([]);

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
  //disable button On Empty Fields
  const [contactError, setContactErrors] = useState({});
  const [emailContactError, setEmailContactError] = useState({});
  //states for uploaded signed url
  const [bankStatementUrl, setBankSatementUrl] = useState([]);
  const [mcaUrl, setMcaUrl] = useState([]);
  const [otherFileUrl, setOtherFileUrl] = useState([]);
  const [lawsuitUrl, setLawsuitUrl] = useState([]);
  //
  const [debtorCaseData, setDebtorCaseData] = useState([]);

  const [connectPayment, setConnectPayment] = useState({
    paymentToken: "",
    paymentType: "",
  });

  const [lawsuitExtractedData, setLawsuitExtractedData] = useState([]);

  const disableButton =
    // (activeStep === 0 && files?.length === 0) ||
    // (activeStep === 1 &&
    //   (status === "" ||
    //     (debtorContantHasValue &&
    //       !isEmpty(emailContactError) &&
    //       hasAnyValue(emailContactError)) ||
    //     checkContacts(debtorContactDetails) ||
    //     (debtorContantHasValue &&
    //       !isEmpty(contactError) &&
    //       hasAnyValue(contactError)) ||
    //     Object.values(debtorOwnDetails)?.some((value) => value === "") ||
    //     Object.entries(debtorBusinessDetails)
    //       .filter(([key]) => key !== "businessDescription")
    //       .some(([key, value]) => value === "") ||
    //     !!debtorBusinessDetails?.businessDescription?.trim()?.length === 0 ||
    //     errors?.businessPhone ||
    //     errors?.einNumber ||
    //     errors?.ssn ||
    //     errors?.emailValid ||
    //     errors?.basicPhone)) ||
    (activeStep === 2 &&
      finalCaseData.some(
        (caseData) => caseData?.creditor?.accountTitle === ""
      )) ||
    (activeStep === 3 &&
      (totalReceivable === null ||
        totalReceivable === "" ||
        feePayment === "" ||
        paidAmount === null ||
        paidAmount === "" ||
        remainingAmount === null ||
        remainingAmount === "" ||
        // lastPaymentDate === "" ||
        debtorDetailsStatus === "" ||
        parseInt(remainingAmount) !== parseInt(totalAmount) ||
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

  const handleExtractedData = (extracted_data) => {
    const response = {
      BusinessInfo: {},
      DebtorInfo: {},
      Creditors: [],
    };

    const creditorMap = new Map();

    extracted_data.forEach((item) => {
      if (isEmpty(item)) return {};

      // Merge business info
      for (let key in item.bussiness_info) {
        if (
          key === "Business EIN Number" &&
          response?.BusinessInfo[key]?.length !== 9
        ) {
          const ein = sanitizeText(item.bussiness_info[key]);
          if (ein.length === 9) {
            response.BusinessInfo[key] = ein;
          }
        } else if (
          item.bussiness_info[key] !== null &&
          item.bussiness_info[key] !== ""
        ) {
          response.BusinessInfo[key] = item.bussiness_info[key];
        }
      }

      // Merge debtor info
      for (let key in item.debtor_info) {
        if (item.debtor_info[key] !== null && item.debtor_info[key] !== "") {
          response.DebtorInfo[key] = item.debtor_info[key];
        }
      }
      try {
        // Process creditor info
        const creditorName = item.creditor_info["creditor's Name"];
        if (!creditorMap.has(creditorName)) {
          creditorMap.set(creditorName, {
            Name: creditorName,
            EmailAddress: item.creditor_info["creditor's Email address"],
            PhoneNumber: item.creditor_info["creditor's Phone Number"],
            AccountTitle:
              item?.creditor_info["creditor's bank acc. title"] || "",
            ContractDetails: item.contract_details,
          });
        }
      } catch (error) {
        showToast("We ran into an error in parsing", error);
      }
    });

    // Convert creditor map to an array
    response.Creditors = Array.from(creditorMap.values());
    response.Creditors = response.Creditors.map((creditor) => ({
      ...creditor,
      ContractDetails: creditor.ContractDetails,
    }));
    setWalletId("");

    const parseString = (value) =>
      value ? String(value).replace(/-/g, "") : "";

    setDebtorOwnDetails({
      BasicFullName: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's Name"]
        : "",
      BasicEmailAddress: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's Email address"]
        : "",
      BasicSsid: response?.DebtorInfo
        ? parseString(response?.DebtorInfo["Debtor's SSN"])
        : "",
      BasicState: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's State Name"]
        : "",
      BasicCity: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's City Name"]
        : "",
      BasicZipCode: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's Zip code"]
        : "",
      BasicPhoneNumber: response?.DebtorInfo
        ? phoneNumberFormat(response?.DebtorInfo["Debtor's Phone Number"])
        : "",
      BasicAddress: response?.DebtorInfo
        ? response?.DebtorInfo["Debtor's Address"]
        : "",
    });
    setDebtorBusinessDetails({
      businessCompanyName: response?.BusinessInfo
        ? response?.BusinessInfo["Business Legal Name"]
        : "",
      businessEinNumber: parseString(
        response?.BusinessInfo
          ? response?.BusinessInfo["Business EIN Number"]
          : ""
      ),
      businessCategory: response?.BusinessInfo
        ? response?.BusinessInfo["Business Category"]
        : "",

      businessState: response?.BusinessInfo
        ? response?.BusinessInfo["Business State Name"]
        : "",
      businessCity: response?.BusinessInfo
        ? response?.BusinessInfo["Business City Name"]
        : "",
      businessZipCode: response?.BusinessInfo
        ? response?.BusinessInfo["Business Zip code"]
        : "",
      businessAddress: response?.BusinessInfo
        ? response?.BusinessInfo["Business Street Address"]
        : "",
    });

    setCreditors(response?.Creditors);
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
      BasicState: debtorData?.basicInformation?.state || "",
      BasicCity: debtorData?.basicInformation?.city || "",
      BasicZipCode: debtorData?.basicInformation?.zipCode || "",
      BasicPhoneNumber: debtorData?.basicInformation?.phone || "",
      BasicAddress: debtorData?.basicInformation?.address || "",
      BasicWeeklyBudget: debtorData?.basicInformation?.weeklyBudget || 0,
    });
    setWalletId(debtorData?.customerVaultId || "");
    setBankSatementUrl(debtorData?.bankStatementDocuments || []);
    setMcaUrl(debtorData?.mcaDocuments || []);
    setOtherFileUrl(debtorData?.otherDocuments || []);
    setLawsuitUrl(debtorData?.lawsuitDocuments || []);
    setStatus(debtorData?.basicInformation?.status);
    setBusinessType(debtorData?.businessInformation?.businessCategory || "");
    setDebtorBusinessDetails({
      businessCompanyName: debtorData?.businessInformation?.companyName || "",
      businessEinNumber: debtorData?.businessInformation?.EIN || "",
      businessState: debtorData?.businessInformation?.state || "",
      businessCity: debtorData?.businessInformation?.city || "",
      businessZipCode: debtorData?.businessInformation?.zipCode || "",
      businessAddress: debtorData?.businessInformation?.address || "",
    });
    if (!isEmpty(debtorData?.contacts)) {
      setDebtorContactDetails(
        debtorData?.contacts?.map((contact) => ({
          name: contact?.name || "",
          phone: contact?.phone || "",
          email: contact?.email || "",
        }))
      );
    } else {
      setDebtorContactDetails([
        {
          name: "",
          phone: "",
          email: "",
        },
      ]);
    }
    setFilteredArray([]);
    setDebtorSearchText("");
  };

  const SearchCreditorFields = async (value, index) => {
    if (value) {
      const params = { text: value };
      const getCreditorDataInSearch = await GetCreditorSearch(params);
      if (getCreditorDataInSearch?.status === 200) {
        const data = getCreditorDataInSearch?.data?.data;
        setFilteredArray(data);
      }
    }
  };
  const handleCreditorSelect = (result, index) => {
    const updatedFinalCaseData = [...finalCaseData];
    updatedFinalCaseData[index].creditor.basicInformation = {
      ...updatedFinalCaseData[index]?.creditor?.basicInformation,
      ...result?.basicInformation,
    };
    updatedFinalCaseData[index].creditor.businessInformation = {
      ...updatedFinalCaseData[index]?.creditor?.businessInformation,
      ...result?.businessInformation,
    };
    setFinalCaseData(updatedFinalCaseData);
    setFilteredArray([]);
    setCreditorSearchText("");
  };

  const handleNext = async () => {
    try {
      window.scrollTo(0, 0);
      if (activeStep === 0) {
        const calculateTime = selectedFiles && selectedFiles?.length * 3.1 + 7;
        !loading && setProgress(1); // Reset progress
        setLoading(true);
        const timer = setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 100 / calculateTime
          );
        }, 1000);
        const extractedDataMCAs =
          selectedFiles?.length > 0
            ? await ExtractContractData(selectedFiles).then((res) => {
                if (isEmpty(res)) {
                  showToast("Could not extract data from files", "error");
                  setProgress(101);
                  clearInterval(timer);
                  setActiveStep(activeStep + 1);
                } else {
                  setExtractedData(res);
                  return res;
                }
              })
            : [];

        if (files?.length > 0) {
          const uploadFile = await UploadFiles(files, setProgress);
          if (uploadFile?.status === 200) {
            setBankSatementUrl(uploadFile?.data?.data);
          }
        }
        if (selectedFiles?.length > 0) {
          const uploadFile = await UploadFiles(selectedFiles, setProgress);
          if (uploadFile?.status === 200) {
            setMcaUrl(uploadFile?.data?.data);
          }
        }
        if (otherFiles?.length > 0) {
          const uploadFile = await UploadFiles(otherFiles, setProgress);
          if (uploadFile?.status === 200) {
            setOtherFileUrl(uploadFile?.data?.data);
          }
        }
        if (lawsuitFiles?.length > 0) {
          const uploadFile = await UploadFiles(lawsuitFiles, setProgress);
          if (uploadFile?.status === 200) {
            setLawsuitUrl(uploadFile?.data?.data);
          }
        }

        handleExtractedData(extractedDataMCAs);
        setActiveStep(activeStep + 1);
      } else if (activeStep === 1) {
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

        const params = {
          basicInformation: {
            fullName: debtorOwnDetails?.BasicFullName,
            email: debtorOwnDetails?.BasicEmailAddress,
            SSID: debtorOwnDetails?.BasicSsid,
            status: status,
            state: debtorOwnDetails?.BasicState,
            city: debtorOwnDetails?.BasicCity,
            zipCode: debtorOwnDetails?.BasicZipCode,
            phone: debtorOwnDetails?.BasicPhoneNumber
              ? debtorOwnDetails.BasicPhoneNumber.startsWith("+1")
                ? debtorOwnDetails.BasicPhoneNumber.slice(2)
                : debtorOwnDetails.BasicPhoneNumber
              : "",
            address: debtorOwnDetails?.BasicAddress,
            weeklyBudget: debtorOwnDetails?.BasicWeeklyBudget || 0,
          },
          businessInformation: {
            companyName: debtorBusinessDetails?.businessCompanyName,
            EIN: debtorBusinessDetails?.businessEinNumber,
            businessCategory: businessType,
            state: debtorBusinessDetails?.businessState,
            city: debtorBusinessDetails?.businessCity,
            zipCode: debtorBusinessDetails?.businessZipCode,
            address: debtorBusinessDetails?.businessAddress,
          },
          contacts: debtorContacts,
          paymentToken: connectPayment?.paymentToken,
          paymentType: connectPayment?.paymentType,
          mcaDocuments: mcaUrl || [],
          bankStatementDocuments: bankStatementUrl || [],
          otherDocuments: otherFileUrl || [],
          lawsuitDocuments: lawsuitUrl || [],
          extractedFields: isEmpty(extractedData) ? [] : extractedData,
        };
        const res = await CreateDebtor(params);
        if (res?.status === 200) {
          showToast(res?.data?.message, "success");
          setLawsuitExtractedData(res?.data?.data?.debtor?.lawsuitFields);
          setDebtorCaseData(res?.data?.data);
          setActiveStep(activeStep + 1);
        } else {
          const errorMessage = res?.response?.data?.message;
          showToast(errorMessage, "error");
        }
      } else if (activeStep === 2) {
        setLoading(true);
        const isEmpty = (obj) => {
          return Object.values(obj)?.every(
            (value) => value === "" || value == null
          );
        };
        finalCaseData.forEach((item) => {
          if (
            item.creditor.aggression === null ||
            isNaN(item.creditor.aggression)
          ) {
            item.creditor.aggression = 0;
          }
        });

        const res = await CreateCreditorCase(
          { data: finalCaseData },
          debtorCaseData.debtor._id
        );

        if (res?.status === 200 || res?.status === 201) {
          showToast(res?.data?.message, "success");
          localStorage.setItem("route", "list-details");
          navigate(`/client/list-details/${res?.data?.data[0]?.debtor}`);
          setDebtorCaseData(res?.data?.data);
        } else {
          const errorMessage = res?.response?.data?.message;
          showToast(errorMessage, "error");
        }
      } else {
        setLoading(true);
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
    } catch (error) {
      console.error("An error occurred while processing business info:", error);
    } finally {
      setLoading(false);
    }
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

  const clearDebtor = () => {
    setDebtorOwnDetails({
      BasicFullName: "",
      BasicEmailAddress: "",
      BasicSsid: "",
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
      businessState: "",
      businessCity: "",
      businessZipCode: "",
      businessAddress: "",
    });
    setWalletId("");
    setStatus("");
    setBusinessType("");
    setDebtorContactDetails([
      {
        name: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const handleReset = () => {
    if (activeStep === 0) {
      setFiles([]);
      setSelectedFiles([]);
      setOtherFiles([]);
      setLawsuitFiles([]);
      setExtractedData({});
      setInputKey(Date.now());
    } else if (activeStep === 1) {
      clearDebtor();
    } else if (activeStep === 2) {
      setFinalCaseData([]);
    } else if (activeStep === 3) {
      setNewDataList([
        {
          amount: "",
          startDate: today,
          timePeriod: "Custom",
          frequency: 1,
        },
      ]);
    }
    setErrors({
      phone: "",
      einNumber: "",
      ssn: "",
      basicPhone: "",
      emailValid: "",
    });
  };

  const resetAll = () => {
    setFiles([]);
    setSelectedFiles([]);
    setOtherFiles([]);
    setLawsuitFiles([]);
    setExtractedData({});
    setInputKey(Date.now());
    clearDebtor();
    setFinalCaseData([]);
    setNewDataList([
      {
        amount: "",
        startDate: today,
        timePeriod: "Custom",
        frequency: 1,
      },
    ]);
    setErrors({
      phone: "",
      einNumber: "",
      ssn: "",
      basicPhone: "",
      emailValid: "",
    });
    setActiveStep(0);
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
      <Grid item xs={12} sx={{ width: { xs: "65vw", sm: "auto" } }}>
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
                <Step key={label} {...stepProps} sx={{ fill: Colors.SKY_BLUE }}>
                  <StepLabel
                    {...labelProps}
                    sx={{
                      cursor: "pointer",
                      "& .MuiStepLabel-label": {
                        fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                      },
                    }}
                    StepIconProps={{
                      sx: {
                        color: Colors.SKY_BLUE,
                        "&.Mui-active": {
                          color: Colors.SKY_BLUE,
                        },
                        "&.Mui-completed": {
                          color: Colors.SKY_BLUE,
                        },
                      },
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
              files={files}
              setFiles={setFiles}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              otherFiles={otherFiles}
              setOtherFiles={setOtherFiles}
              lawsuitFiles={lawsuitFiles}
              setLawsuitFiles={setLawsuitFiles}
              setInputKey={setInputKey}
              inputKey={inputKey}
              loading={loading}
              progress={progress}
              setProgress={setProgress}
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
              businessType={businessType}
              setBusinessType={setBusinessType}
              walletId={walletId}
            />
          ) : activeStep === 2 && creditors ? (
            <CreditorDetails
              creditors={creditors}
              setCreditors={setCreditors}
              debtorCaseData={debtorCaseData}
              setDebtorCaseData={setDebtorCaseData}
              finalCaseData={finalCaseData}
              setFinalCaseData={setFinalCaseData}
              searchText={creditorSearchText}
              setSearchText={setCreditorSearchText}
              SearchFields={SearchCreditorFields}
              loading={loading}
              handleSelect={handleCreditorSelect}
              filteredArray={filteredArray}
              setFilteredArray={setFilteredArray}
              errors={errors}
              setErrors={setErrors}
              lawsuitExtractedData={lawsuitExtractedData}
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
              container
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "space-between",
                  sm: "flex-end",
                },
                gap: "5px",
                width: "100%",
                backgroundColor: Colors.BG_LIGHT_GRAY,
              }}
            >
              <TextButton
                buttonText="BACK"
                width={smallScreen ? "6rem" : "auto"}
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
                width={smallScreen ? "6rem" : "auto"}
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
                width={smallScreen ? "6rem" : "auto"}
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
                width={smallScreen ? "6rem" : "auto"}
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
