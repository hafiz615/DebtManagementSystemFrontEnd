import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import DebtorDetails from "../components/debtorDetails";

function DebtorDetailsPage() {
  return (
    <PersistentDrawerLeft>
      <DebtorDetails />
    </PersistentDrawerLeft>
  );
}

export default DebtorDetailsPage;
