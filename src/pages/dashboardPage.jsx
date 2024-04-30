import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import Dashboard from "../components/dashboard";
function DashboardPage() {
  return (
    <PersistentDrawerLeft>
      <Dashboard />
    </PersistentDrawerLeft>
  );
}

export default DashboardPage;
