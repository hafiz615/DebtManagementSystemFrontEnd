import React from "react";

import PersistentDrawerLeft from "../components/openDrawer";
import CaseDetail from "../components/caseDetail/caseDetail";

export default function CaseCodeDetail() {
  return (
    <PersistentDrawerLeft>
      <CaseDetail />
    </PersistentDrawerLeft>
  );
}
