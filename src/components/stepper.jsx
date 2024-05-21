import React, { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../config/default";
import DebtorDetails from "./caseCreation/debtorDetails";
import { DebtorDetailsPage } from "../constants/appConstants";
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
} from "../services/services";
import { useToast } from "../toast/toastContext";
import { isEmpty } from "lodash";

const steps = ["Debtor", "Creditor", "Payment", "File upload", "Preview"];

export default function HorizontalLinearStepper() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const { AUTHORITY_TEXT, AUTHORITY_VALUE, DEBTOR_HEADING } = DebtorDetailsPage;
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");

  //Debtor-Basic-Details-State
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({
    BasicFullName: "",
    BasicEmailAddress: "",
    BasicSsid: "",
    BasicCountry: "",
    BasicState: "",
    BasicCity: "",
    BasicZipCode: "",
    BasicPhoneNumber: "",
    BasicAddress: "",
  });
  //Debtor-Business-Details-State
  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({
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
  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState("");
  //Debtor-Contact-State
  const [debtorContactDetails, setDebtorContactDetails] = useState([
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

  // creditor state
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
  // payment state
  const [totalReceivable, setTotalReceivable] = useState(null);
  const [paidAmount, setPaidAmount] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [lastPaymentDate, setLastPaymentDate] = useState("");
  const [debtorDetailsStatus, setDebtorDetailsStatus] = useState("");
  const [newDataList, setNewDataList] = useState([
    {
      amount: "",
      startDate: "",
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
  const disableButton =
    (activeStep === 0 &&
      (status === "" ||
        Object.values(debtorOwnDetails)?.some((value) => value === "") ||
        Object.entries(debtorBusinessDetails)
          .filter(([key]) => key !== "businessDescription")
          .some(([key, value]) => value === "") ||
        !!debtorBusinessDetails?.businessDescription?.trim()?.length === 0 ||
        errors?.businessPhone ||
        errors?.einNumber ||
        errors?.ssn ||
        errors?.emailValid ||
        errors?.basicPhone)) ||
    (activeStep === 1 &&
      (fundedDate === "" ||
        creditorFieldsError?.emailValidError ||
        creditorFieldsError?.creditorPhoneError ||
        Object.values(creditorBasicsInfo)?.some((value) => value === "") ||
        Object.values(creditorBusinessDetails)?.some((value) => value === "") ||
        Object.values(historicRange).some((value) => value === ""))) ||
    (activeStep === 2 &&
      (totalReceivable === null ||
        totalReceivable === "" ||
        paidAmount === null ||
        paidAmount === "" ||
        remainingAmount === null ||
        remainingAmount === "" ||
        lastPaymentDate === "" ||
        debtorDetailsStatus === "" ||
        remainingAmount !== totalAmount ||
        newDataList?.some((newData) =>
          Object.values(newData)?.some((value) => value === "")
        )));

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const SearchDebtorFields = async () => {
    const params = { text: debtorSearchText };
    setLoading(true);
    const getDebtorDataInSearch = await GetDebtorSearch(params);
    if (getDebtorDataInSearch?.status === 200) {
      const debtorData = getDebtorDataInSearch?.data?.data;
      showToast(getDebtorDataInSearch?.data?.message, "success");
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
        BasicSsid: debtorData?.basicInformation["SSID"] || "",
        BasicCountry: debtorData?.basicInformation?.country || "",
        BasicState: debtorData?.basicInformation?.state || "",
        BasicCity: debtorData?.basicInformation?.city || "",
        BasicZipCode: debtorData?.basicInformation?.zipCode || "",
        BasicPhoneNumber: debtorData?.basicInformation?.phone || "",
        BasicAddress: debtorData?.basicInformation?.address || "",
      });
      setStatus(debtorData?.basicInformation?.status);

      setDebtorBusinessDetails({
        businessCompanyName: debtorData?.businessInformation?.companyName || "",
        businessEinNumber: debtorData?.businessInformation?.EIN || "",
        businessCategory:
          debtorData?.businessInformation?.businessCategory || "",
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
    } else {
      showToast(getDebtorDataInSearch?.response?.data?.message, "error");
    }
    setLoading(false);
  };

  const SearchCreditorFields = async () => {
    const params = { text: creditorSearchText };
    setLoading(true);
    const getCreditorDataInSearch = await GetCreditorSearch(params);
    if (getCreditorDataInSearch?.status === 200) {
      const creditorData = getCreditorDataInSearch?.data?.data;
      showToast(getCreditorDataInSearch?.data?.message, "success");

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
        businessCompanyName:
          creditorData?.businessInformation?.companyName || "",
        businessCategory:
          creditorData?.businessInformation?.businessCategory || "",
      });
      setCreditorNotes(creditorData?.notes || "");
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
    } else {
      showToast(getCreditorDataInSearch?.response?.data?.message, "error");
    }
    setLoading(false);
  };
  const handleNext = async () => {
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
            lastFundedDate: fundedDate,
            historicalRange: historicRange,
            contacts: creditorContacts,
          },
          status: debtorDetailsStatus,
          totalDebt: parseInt(totalReceivable),
          lastPaymentDate: lastPaymentDate,
          paidAmount: parseInt(paidAmount),
          remaining: parseInt(remainingAmount),
          documents: uploadFile?.data?.data,
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
          setHistoricRange({
            minimum: "",
            maximum: "",
          });
          setDebtorDetailsStatus("Customer");
          setLastPaymentDate("");
          setRemainingAmount(null);
          setPaidAmount(null);
          setTotalReceivable(null);
          setFiles([]);
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
          setDebtorSearchText("");
          setCreditorSearchText("");
          setActiveStep(0);
        } else {
          const errorMessage = caseCreation?.response?.data?.message;
          showToast(errorMessage, "error");
        }
      } else {
        const errorMessage = uploadFile?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    setLoading(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
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
          {AUTHORITY_TEXT} <span>{AUTHORITY_VALUE}</span>
        </Typography>
      </Grid>
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
            sx={{ width: { xs: "100%", md: "50%" } }}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Grid>

        <React.Fragment>
          {activeStep === 0 ? (
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
            />
          ) : activeStep === 1 ? (
            <CreditorDetails
              creditorBasicsInfo={creditorBasicsInfo}
              CreditorNotes={CreditorNotes}
              setCreditorNotes={setCreditorNotes}
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
            />
          ) : activeStep === 2 ? (
            <PaymentDetails
              totalReceivable={totalReceivable}
              setTotalReceivable={setTotalReceivable}
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
          ) : activeStep === 3 ? (
            <FileUploadComponent
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              files={files}
              setFiles={setFiles}
            />
          ) : activeStep === 4 ? (
            <PreviewDetails
              debtorOwnDetails={debtorOwnDetails}
              creditorBasicsInfo={creditorBasicsInfo}
              creditorBusinessDetails={creditorBusinessDetails}
              newDataList={newDataList}
              totalReceivable={totalReceivable}
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
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              <TextButton
                buttonText="EXIT"
                disabled={activeStep === 0}
                onClick={handleBack}
                backgroundColor={Colors.ORANGE_COLOR}
                hoverColor={Colors.ORANGE_COLOR}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                marginRight="1rem"
              />
              <TextButton
                buttonText="RESET"
                onClick={handleReset}
                backgroundColor={Colors.DARK_GRAY}
                hoverColor={Colors.DARK_GRAY}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                marginRight="1rem"
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
                marginRight="1rem"
                // disabled={disableButton || loading}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </Grid>
    </Grid>
  );
}
