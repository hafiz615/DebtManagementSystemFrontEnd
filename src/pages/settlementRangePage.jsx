import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import SettlementRange from "../components/settlementRange/settlementRange";
function SettlementRangePage() {
  return (
    <PersistentDrawerLeft>
      <SettlementRange />
    </PersistentDrawerLeft>
  );
}

export default SettlementRangePage;
