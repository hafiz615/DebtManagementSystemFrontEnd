import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import Sms from "../components/sms/sms";
function SmsPage() {
  return (
    <PersistentDrawerLeft>
      <Sms />
    </PersistentDrawerLeft>
  );
}

export default SmsPage;
