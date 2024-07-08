import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import PipelineDetail from "../components/pipelines/pipelineDetail";
export default function PipelinesPage() {
  return (
    <PersistentDrawerLeft>
      <PipelineDetail />
    </PersistentDrawerLeft>
  );
}
