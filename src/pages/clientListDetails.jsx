import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";

import ClientListDetails from "../components/clientListDetails";
export default function ClientListDetailsPage() {
  return (
    <PersistentDrawerLeft>
      <ClientListDetails />
    </PersistentDrawerLeft>
  );
}
