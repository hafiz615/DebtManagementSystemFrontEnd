import React from "react";

import PersistentDrawerLeft from "../components/openDrawer";
import BulkImportCase from "../components/bulkImportCase/bulkImportCase";

export default function BulkCases() {
  return (
    <PersistentDrawerLeft>
      <BulkImportCase />
    </PersistentDrawerLeft>
  );
}
