import React, { useState } from "react";

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
import { CreateCase, UploadFiles } from "../services/services";
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
  const [checked, setChecked] = React.useState(false);
  const [status, setStatus] = useState("Custom");
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
  const [debtorDetailsStatus, setDebtorDetailsStatus] = useState("Custom");
  const [newDataList, setNewDataList] = useState([
    {
      amount: "",
      startDate: "",
      timePeriod: "",
    },
  ]);
  //upload files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  //disable button
  const disableButton =
    (activeStep === 0 &&
      (status === "" ||
        Object.values(debtorOwnDetails)?.some((value) => value === "") ||
        Object.values(debtorBusinessDetails)?.some((value) => value === "") ||
        debtorContactDetails?.some((contact) =>
          Object.values(contact)?.some((value) => value === "")
        ))) ||
    (activeStep === 1 &&
      (CreditorNotes === "" ||
        fundedDate === "" ||
        Object.values(creditorBasicsInfo)?.some((value) => value === "") ||
        Object.values(creditorBusinessDetails)?.some((value) => value === "") ||
        creditorContactDetails?.some((contact) =>
          Object.values(contact)?.some((value) => value === "")
        ) ||
        Object.values(historicRange).some((value) => value === ""))) ||
    (activeStep === 2 &&
      (totalReceivable === null ||
        paidAmount === null ||
        remainingAmount === null ||
        lastPaymentDate === "" ||
        debtorDetailsStatus === "" ||
        newDataList?.some((newData) =>
          Object.values(newData)?.some((value) => value === "")
        ))) ||
    (activeStep === 3 && isEmpty(uploadedFiles));

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
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
            contacts: debtorContactDetails,
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
            contacts: creditorContactDetails,
          },
          status: debtorDetailsStatus,
          totalDebt: parseInt(totalReceivable),
          lastPaymentDate: lastPaymentDate,
          paidAmount: parseInt(paidAmount),
          remaining: parseInt(remainingAmount),
          documents: uploadFile?.data?.data,
          intervals: newDataList,
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
          setStatus("Custom");
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
          setDebtorDetailsStatus("Custom");
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
                disabled={disableButton || loading}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </Grid>
    </Grid>
  );
}
