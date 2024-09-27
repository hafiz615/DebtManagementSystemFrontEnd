import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import UpdateCreditorCase from "../components/updateCreditorCases/updateCreditorCase";
function UpdateCase() {
  return (
    <PersistentDrawerLeft>
      <UpdateCreditorCase />
    </PersistentDrawerLeft>
  );
}

export default UpdateCase;
