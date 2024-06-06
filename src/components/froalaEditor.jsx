import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import TextButton from "./button";
import { Colors } from "../config/default";

export default function FroalaEditor({
  froalaEditor,
  setFroalaEditor,
  templateType,
}) {
  const [subject, setSubject] = useState("");

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleChange = (content) => {
    setFroalaEditor(content);
  };

  const handleSave = () => {
    let templateData;
    if ((templateType = "email")) {
      templateData = {
        subject: subject,
        content: froalaEditor,
      };
    } else {
      templateData = {
        content: froalaEditor,
      };
    }
  };

  return (
    <>
      {templateType === "email" && (
        <>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              color: Colors.DARK_GRAY,
              // paddingLeft: "1.5rem",
              width: "20%",
            }}
          >
            Subject
          </Typography>
          <input
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              height: "2.5rem",
              color: Colors.DIM_LIGHT_GRAY,
              paddingLeft: "1rem",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              width: "50%",
              // marginLeft: "1rem",
              marginRight: "1rem",
              marginBottom: "1rem",
            }}
            type="text"
            placeholder="Add Subject"
            value={subject}
            onChange={handleSubjectChange}
          />
        </>
      )}

      <FroalaEditorComponent
        tag="textarea"
        model={froalaEditor}
        onModelChange={handleChange}
      />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          disabled={
            froalaEditor === "" || (templateType === "email" && subject === "")
          }
          buttonText="SAVE"
          height="2rem"
          onClick={handleSave()}
        />
      </Box>
    </>
  );
}
