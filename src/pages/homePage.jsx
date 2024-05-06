import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import HomeDetails from "../components/homeDetails";
function HomePage() {
  return (
    <PersistentDrawerLeft>
      <HomeDetails />
    </PersistentDrawerLeft>
  );
}

export default HomePage;
