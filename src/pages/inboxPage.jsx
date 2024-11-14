import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import Inbox from "../components/inbox";
function InboxPage() {
  return (
    <PersistentDrawerLeft>
      <Inbox />
    </PersistentDrawerLeft>
  );
}

export default InboxPage;
