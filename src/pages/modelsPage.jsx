import React from "react";
import MuiModels from "../components/models";

export default function ModelsPage() {
  return (
    <div>
      <MuiModels buttonName="Add Task" show="addTask" />
      <MuiModels buttonName="Tasks" show="task" />
      <MuiModels buttonName="Edit Fields" show="editField" />
      <MuiModels buttonName="Add Custom Fields" show="addCustomField" />
    </div>
  );
}
