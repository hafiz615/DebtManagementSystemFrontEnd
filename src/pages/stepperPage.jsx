import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import HorizontalLinearStepper from "../components/stepper";

function HorizontalLinearStepperPage() {
  return (
    <PersistentDrawerLeft>
      <HorizontalLinearStepper />
    </PersistentDrawerLeft>
  );
}

export default HorizontalLinearStepperPage;
