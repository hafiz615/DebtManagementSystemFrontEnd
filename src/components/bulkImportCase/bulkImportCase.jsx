import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Typography, Stepper, Step, StepLabel } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../../config/default";
import { PAGE_HEIGHT, UserListPage } from "../../constants/appConstants";
import TextButton from ".././button";
import MappingDetails from "./mappingDetails";
import ClientImport from "./clientImport";
import { createMultipleDebtors } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import ScrollbarStyles from "../customScroll";

function BulkImportCase() {
  const [activeStep, setActiveStep] = useState(0);
  const [dropdownStates, setDropdownStates] = useState();
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(false);

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const steps = ["Mapping", "Preview"];

  const handleBack = () => {
    setActiveStep(0);
  };
  const handleStep = (step) => () => {
    if (
      step === activeStep + 1 ||
      completedSteps?.has(step) ||
      step < activeStep
    ) {
      setActiveStep(step);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
      setCompletedSteps((prevCompletedSteps) =>
        new Set(prevCompletedSteps)?.add(activeStep)
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const caseCreation = await createMultipleDebtors(apiData);
    if (caseCreation?.status === 201) {
      localStorage.removeItem("Columns");
      localStorage.removeItem("csvData");
      localStorage.setItem("route", "Home");
      navigate("/home");
      showToast(caseCreation?.data?.message, "success");
    } else if (caseCreation?.response?.status === 400) {
      const errorMessage = caseCreation?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
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
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          marginTop: ".5rem",
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
          marginTop: ".5rem",
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
          {activeStep === 0 ? "Mapping" : "New Client Import File"}
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
          sx={{ width: { xs: "100%", md: "50%" } }}
        >
          {steps?.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel
                  {...labelProps}
                  sx={{
                    cursor: "pointer",
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
      {activeStep === 0 ? (
        <MappingDetails
          allDropdownStates={dropdownStates}
          setAllDropdownStates={setDropdownStates}
        />
      ) : (
        <ClientImport
          apiData={apiData}
          allDropdownStates={dropdownStates}
          setApiData={setApiData}
        />
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
            width: { xs: "85%", sm: "100%" },
            justifyContent: { xs: "center", sm: "flex-end" },
            backgroundColor: Colors.BG_LIGHT_GRAY,
            position: "fixed",
            bottom: "1px",
            height: "3rem",
            alignItems: "center",
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
              activeStep === 0 ? handleNext() : handleSave();
            }}
            loading={loading}
            marginRight="1rem"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BulkImportCase;
