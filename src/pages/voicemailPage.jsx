import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import VoiceMail from "../components/voicemail/voicemail";
function VoiceMailPage() {
  return (
    <PersistentDrawerLeft>
      <VoiceMail />
    </PersistentDrawerLeft>
  );
}

export default VoiceMailPage;
