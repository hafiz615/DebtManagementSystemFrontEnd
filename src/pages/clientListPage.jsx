import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import ClientList from "../components/clientList";
export default function ClientListPage() {
  return (
    <PersistentDrawerLeft>
      <ClientList />
    </PersistentDrawerLeft>
  );
}
