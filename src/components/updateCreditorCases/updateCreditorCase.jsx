import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import {
  GetBulkCaseDetail,
  UpdateBulkDebtor,
  UpdateDebtor,
  UpdateMultipleCreditors,
} from "../../services/services";
import { useNavigate, useParams } from "react-router-dom";
import CreditorDetails from "../caseCreation/creditorDetails";
import ScrollbarStyles from "../customScroll";
import TextButton from "../button";
import { useToast } from "../../toast/toastContext";
import DebtorDetails from "../caseCreation/debtorDetails";

export default function UpdateCreditorCase() {
  const [finalCaseData, setFinalCaseData] = useState([]);
  const [creditors, setCreditors] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [allDebtorData, setAllDebtorData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({
    businessPhone: "",
    emailValid: "",
  });
  const [debtorOwnDetails, setDebtorOwnDetails] = useState({});
  const [debtorBusinessDetails, setDebtorBusinessDetails] = useState({});
  const [debtorContactDetails, setDebtorContactDetails] = useState([]);
  const [contactError, setContactErrors] = useState({});
  const [emailContactError, setEmailContactError] = useState({});
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const steps = ["Debtor", "Creditor"];

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const getBulkCaseDetail = async () => {
    setLoading(true);
    const res = await GetBulkCaseDetail(id);
    if (res?.status === 200) {
      const resCreditorsData = res?.data?.data?.cases;
      const resDebtorData = res?.data?.data?.debtor;

      setAllDebtorData(res?.data?.data?.debtor);
      setStatus(resDebtorData?.basicInformation?.status);
      setDebtorContactDetails(
        resDebtorData?.contacts?.length > 0
          ? resDebtorData?.contacts
          : [
              {
                name: "",
                title: "",
                phone: "",
                email: "",
                state: "",
                city: "",
                zipCode: "",
                relationWithDebtor: "",
              },
            ]
      );
      setDebtorBusinessDetails({
        businessCompanyName:
          resDebtorData?.businessInformation?.companyName || "",
        businessEinNumber: resDebtorData?.businessInformation?.EIN || "",
        businessCategory:
          resDebtorData?.businessInformation?.businessCategory || "",
        businessDescription:
          resDebtorData?.businessInformation?.description || "",
        businessState: resDebtorData?.businessInformation?.state || "",
        businessCity: resDebtorData?.businessInformation?.city || "",
        businessZipCode: resDebtorData?.businessInformation?.zipCode || "",
        businessPhoneNumber: resDebtorData?.businessInformation?.phone || "",
        businessAddress: resDebtorData?.businessInformation?.address || "",
      });
      setDebtorOwnDetails({
        BasicFullName: resDebtorData?.basicInformation?.fullName || "",
        BasicEmailAddress: resDebtorData?.basicInformation?.email || "",
        BasicSsid: resDebtorData?.basicInformation?.SSID || "",
        BasicState: resDebtorData?.basicInformation?.state || "",
        BasicCity: resDebtorData?.basicInformation?.city || "",
        BasicZipCode: resDebtorData?.basicInformation?.zipCode || "",
        BasicPhoneNumber: resDebtorData?.basicInformation?.phone || "",
        BasicAddress: resDebtorData?.basicInformation?.address || "",
        BasicWeeklyBudget: resDebtorData?.basicInformation?.weeklyBudget || 0,
      });

      setCaseData(
        resCreditorsData?.map((item) => ({
          contractDetails: {
            loan_amount: item?.contractDetails?.loan_amount || 0,
            repayment_amount: item?.contractDetails?.repayment_amount || 0,
            purchased_percentage:
              item?.contractDetails?.purchased_percentage || 0,
          },
          creditor: {
            aggression: item?.creditor?.aggression || 0,
            accountTitle: item?.creditor?.accountTitle || "",
            basicInformation: {
              email: item?.creditor?.basicInformation?.email || "",
              fullName: item?.creditor?.basicInformation?.fullName || "",
              phone: item?.creditor?.basicInformation?.phone || "",
            },
            businessInformation: {
              businessCategory:
                item?.creditor?.businessInformation?.businessCategory || "",
              companyName:
                item?.creditor?.businessInformation?.companyName || "",
            },
            historicalRange: {
              maximum: item?.creditor?.historicalRange?.maximum || 0,
              minimum: item?.creditor?.historicalRange?.minimum || 0,
            },
            notes: item?.creditor?.notes || "",
            _id: item?.creditor?._id,
            lastFundedDate: item?.creditor?.lastFundedDate || "",
          },
          feePayment: item?.feePayment,
          lastPaymentDate: item?.lastPaymentDate || "",
          paidAmount: item?.paidAmount || 0,
          remaining: item?.remaining || 0,
          status: item?.status || "",
          totalDebt: item?.totalDebt || 0,
          _id: item?._id,
        }))
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    setCreditors(caseData);
    setFinalCaseData(caseData);
  }, [activeStep, finalCaseData]);

  const updateCreditors = async () => {
    setButtonLoading(true);

    finalCaseData?.forEach((item) => {
      if (
        item.creditor.aggression === null ||
        isNaN(item.creditor.aggression)
      ) {
        item.creditor.aggression = 0;
      }
    });

    const params = {
      cases: finalCaseData,
    };

    const multipleCreditorsRes = await UpdateMultipleCreditors(id, params, id);
    if (multipleCreditorsRes?.status === 200) {
      showToast(multipleCreditorsRes?.data?.message, "success");
      localStorage.setItem("route", "home");
      navigate(`/home`);
    } else {
      showToast(
        multipleCreditorsRes?.response?.data?.message ||
          multipleCreditorsRes?.data?.message,
        "error"
      );
    }
    setButtonLoading(false);
  };

  const updateDebtor = async () => {
    setButtonLoading(true);
    const isEmpty = (obj) => {
      return Object.values(obj)?.every(
        (value) => value === "" || value == null
      );
    };
    const areAllObjectsEmpty = (arr) => {
      return arr?.every(isEmpty);
    };

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
        businessCategory: debtorBusinessDetails?.businessCategory,
        description: debtorBusinessDetails?.businessDescription,
        state: debtorBusinessDetails?.businessState,
        city: debtorBusinessDetails?.businessCity,
        zipCode: debtorBusinessDetails?.businessZipCode,
        phone: debtorBusinessDetails?.businessPhoneNumber
          ? debtorBusinessDetails?.businessPhoneNumber.startsWith("+1")
            ? debtorBusinessDetails?.businessPhoneNumber.slice(2)
            : debtorBusinessDetails?.businessPhoneNumber
          : "",
        address: debtorBusinessDetails?.businessAddress,
      },

      contacts: areAllObjectsEmpty(debtorContactDetails)
        ? []
        : debtorContactDetails,
    };

    const resDebtor = await UpdateBulkDebtor(allDebtorData?._id, params);
    if (resDebtor?.status === 200) {
      showToast(resDebtor?.data?.message, "success");
      setActiveStep(1);
    } else {
      showToast(
        resDebtor?.response?.data?.message || resDebtor?.data?.message,
        "error"
      );
    }

    setButtonLoading(false);
  };

  useEffect(() => {
    getBulkCaseDetail();
  }, []);

  const handleBackClick = () => {
    if (activeStep === 0) {
      localStorage.setItem("route", "home");
      navigate(`/home`);
    } else {
      setActiveStep(0);
    }
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0rem 2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
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
          {AUTHORITY_TEXT} <span>{role}</span>
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
          Update Cases
        </Typography>
      </Grid>
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
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
        }}
      >
        {activeStep === 0 ? (
          <DebtorDetails
            debtorOwnDetails={debtorOwnDetails}
            setDebtorOwnDetails={setDebtorOwnDetails}
            debtorBusinessDetails={debtorBusinessDetails}
            setDebtorBusinessDetails={setDebtorBusinessDetails}
            debtorContactDetails={debtorContactDetails}
            setDebtorContactDetails={setDebtorContactDetails}
            setContactErrors={setContactErrors}
            contactError={contactError}
            emailContactError={emailContactError}
            setEmailContactError={setEmailContactError}
            selectedValue={status}
            setSelectedValue={setStatus}
            checked={checked}
            setChecked={setChecked}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
            hideComponents={true}
          />
        ) : activeStep === 1 ? (
          <CreditorDetails
            creditors={creditors}
            setCreditors={setCreditors}
            finalCaseData={finalCaseData}
            setFinalCaseData={setFinalCaseData}
            hideComponents={true}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          ""
        )}
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: "flex-end",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <TextButton
          buttonText={activeStep === 0 ? "Exit" : "Back"}
          height="2rem"
          width="8rem"
          marginRight="1rem"
          marginTop=".5rem"
          marginBottom=".5rem"
          onClick={handleBackClick}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Update"
          height="2rem"
          width="8rem"
          marginRight="1rem"
          marginTop=".5rem"
          marginBottom=".5rem"
          onClick={activeStep === 0 ? updateDebtor : updateCreditors}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={buttonLoading}
        />
        {activeStep === 0 && (
          <TextButton
            buttonText="Next"
            height="2rem"
            width="8rem"
            marginRight="1rem"
            marginTop=".5rem"
            marginBottom=".5rem"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(1)}
            backgroundColor={Colors.NAVY_BLUE}
            hoverColor={Colors.NAVY_BLUE}
          />
        )}
      </Grid>
    </Grid>
  );
}
