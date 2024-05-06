import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
// import DebtorDetails from "../components/debtorDetails";
import HorizontalLinearStepper from "../components/stepper";

function DebtorDetailsPage() {
  return (
    <PersistentDrawerLeft>
      {/* <DebtorDetails /> */}
      <HorizontalLinearStepper />
    </PersistentDrawerLeft>
  );
}

export default DebtorDetailsPage;
