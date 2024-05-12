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
import { CreateCase } from "../services/services";

const steps = ["Debtor", "Creditor", "Payment", "File upload", "Preview"];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

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

  const [debtorContactDetails, setDebtorContactDetails] = useState({
    debtorContactName: "",
    debtorContactTitle: "",
    debtorContactPhone: "",
    debtorContactEmail: "",
    debtorContactCountry: "",
    debtorContactState: "",
    debtorContactCity: "",
    debtorContactZipCode: "",
    debtorContactRelation: "",
  });
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
  console.log(historicRange, "historic");
  const [creditorContactDetails, setCreditorContactDetails] = useState({
    name: "",
    title: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    relationWithCreditor: "",
  });

  // payment state
  const [totalReceivable, setTotalReceivable] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
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
  const [files, setFiles] = useState([]);
  const handleNext = async (type) => {
    if (activeStep === steps.length - 1) {
      const params = {
        debtor: {
          basicInformation: {
            fullName: debtorOwnDetails?.BasicFullName,
            email: debtorOwnDetails?.BasicEmailAddress,
            SSID: debtorOwnDetails?.BasicSsid,
            // status:status,
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
          contacts: [
            {
              name: debtorContactDetails?.debtorContactName,
              title: debtorContactDetails?.debtorContactTitle,
              phone: debtorContactDetails?.debtorContactPhone,
              email: debtorContactDetails?.debtorContactEmail,
              relationWithDebtor: debtorContactDetails?.debtorContactRelation,
              country: debtorContactDetails?.debtorContactCountry,
              state: debtorContactDetails?.debtorContactState,
              city: debtorContactDetails?.debtorContactCity,
              zipCode: debtorContactDetails?.debtorContactZipCode,
            },
          ],
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
          contacts: [
            {
              name: creditorContactDetails?.name,
              title: creditorContactDetails?.title,
              phone: creditorContactDetails?.phoneNumber,
              email: creditorContactDetails?.email,
              relationWithDebtor: creditorContactDetails?.relationWithCreditor,
              country: creditorContactDetails?.country,
              state: creditorContactDetails?.state,
              city: creditorContactDetails?.city,
              zipCode: creditorContactDetails?.zipCode,
            },
          ],
        },
        totalDebt: totalReceivable,
        lastPaymentDate: lastPaymentDate,
        paidAmount: paidAmount,
        remaining: remainingAmount,
        documents: [
          {
            key: "#2page0-1714377479280.pdf",
            originalFileName: "#2page0.pdf",
          },
          {
            key: "invoice-1714377479300.png",
            originalFileName: "invoice.png",
          },
        ],
        paymentPlanStartDate: "2022-05-01",
        intervals: newDataList,
      };
      console.log(params, "params");

      const caseCreation = await CreateCase(params);
      console.log(caseCreation, "caseCreation");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
            <FileUploadComponent files={files} setFiles={setFiles} />
          ) : activeStep === 4 ? (
            <PreviewDetails />
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
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
                paddingLeft="2rem"
                paddingRight="2rem"
                height="2rem"
                onClick={() => {
                  handleNext(activeStep === steps.length - 1 ? "SAVE" : "NEXT");
                }}
                marginRight="1rem"
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </Grid>
    </Grid>
  );
}
