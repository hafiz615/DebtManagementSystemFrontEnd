import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import ClientList from "../components/clientList";
import ClientListDetails from "../components/clientListDetails";
export default function ClientListPage() {
  return (
    <PersistentDrawerLeft>
      <ClientListDetails />
      {/* <ClientList /> */}
    </PersistentDrawerLeft>
  );
}
