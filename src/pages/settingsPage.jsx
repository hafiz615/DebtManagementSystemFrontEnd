import React from "react";

import PersistentDrawerLeft from "../components/openDrawer";
import SettingsScreen from "../components/settingsScreen/settingsScreen";

export default function SettingsPage() {
  return (
    <PersistentDrawerLeft>
      <SettingsScreen />
    </PersistentDrawerLeft>
  );
}
