import React from "react";

import PersistentDrawerLeft from "../components/openDrawer";
import DashboardContent from "../components/dashboard/dashboardContent";

export default function DashboardPage() {
  return (
    <PersistentDrawerLeft>
      <DashboardContent />
    </PersistentDrawerLeft>
  );
}
