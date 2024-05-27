import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Stepper, Step, StepLabel } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Colors } from "../../config/default";
import { UserListPage } from "../../constants/appConstants";
import TextButton from ".././button";
import MappingDetails from "./mappingDetails";
import ClientImport from "./clientImport";

function BulkImportCase() {
  const [activeStep, setActiveStep] = useState(0);

  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  const steps = ["Mapping", "Preview"];

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    }
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
      {activeStep === 0 ? <MappingDetails /> : <ClientImport />}

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: { xs: "space-between", sm: "flex-end" },
          margin: "1rem 0rem",
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
            handleNext();
          }}
          marginRight="1rem"
        />
      </Grid>
    </Grid>
  );
}

export default BulkImportCase;
