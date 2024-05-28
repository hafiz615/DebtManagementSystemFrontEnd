import React from "react";
import { Box } from "@mui/material";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import TextButton from "./button";
export default function FroalaEditor({ froalaEditor, setFroalaEditor }) {
  const handleChange = (e) => {
    setFroalaEditor(e);
  };
  return (
    <>
      <FroalaEditorComponent tag="textarea" onModelChange={handleChange} />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton buttonText="SAVE" height="2rem" />
      </Box>
    </>
  );
}
