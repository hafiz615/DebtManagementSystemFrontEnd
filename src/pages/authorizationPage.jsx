import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import AuthorizationDetails from "../components/authorizationDetails";
function AuthorizationPage() {
  return (
    <PersistentDrawerLeft>
      <AuthorizationDetails />
    </PersistentDrawerLeft>
  );
}

export default AuthorizationPage;
