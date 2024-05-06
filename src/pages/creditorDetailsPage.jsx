import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import CreditorDetails from "../components/creditorDetails";
export default function CreditorDetailsPage() {
  return (
    <PersistentDrawerLeft>
      <CreditorDetails />
    </PersistentDrawerLeft>
  );
}
