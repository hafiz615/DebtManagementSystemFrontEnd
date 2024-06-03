import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import CreditorList from "../components/creditorList";
export default function CreditorListPage() {
  return (
    <PersistentDrawerLeft>
      <CreditorList />
    </PersistentDrawerLeft>
  );
}
