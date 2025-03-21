import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import { FONT_SIZE_XL, TEXT_EDITOR_KEY } from "../../constants/appConstants";
import TextButton from "../button";
import { Colors } from "../../config/default";
import { CreateSignature, UpdateSignatureData } from "../../services/services";
import { useToast } from "../../toast/toastContext";

function CreateSignatures({
  handleClose,
  GetAllSignaturesData,
  editSignature,
  signatureData,
}) {
  const [signature, setSignature] = useState(signatureData?.signature || "");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSaveSignature = async () => {
    setLoading(true);
    const payload = {
      signature: signature,
    };
    let res;
    if (editSignature) {
      res = await UpdateSignatureData(payload, signatureData?._id);
    } else {
      res = await CreateSignature(payload);
    }
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetAllSignaturesData();
      handleClose();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: "1rem", width: "100%" }}>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: FONT_SIZE_XL,
          }}
        >
          {editSignature ? "Update Signature" : "Create Signature"}
        </Typography>
        <Close onClick={handleClose} />
      </Box>

      <Editor
        style={{ margin: "0px !important" }}
        apiKey={TEXT_EDITOR_KEY}
        init={{
          menubar: false,
          toolbar:
            "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
          height: 250,
        }}
        value={signature}
        onEditorChange={(content) => setSignature(content)}
      />

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText={editSignature ? "UPDATE" : "CREATE"}
          height="2rem"
          width="8rem"
          onClick={handleSaveSignature}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Box>
    </Box>
  );
}

export default CreateSignatures;
