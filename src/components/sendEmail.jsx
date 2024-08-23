import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Typography, Tooltip } from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import FroalaEditorComponent from "react-froala-wysiwyg";
import ScrollbarStyles from "./customScroll";
import { SendSettlementEmail } from "../services/services";
import { FONT_SIZE_MEDIUM } from "../constants/appConstants";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

const inputContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "5px",
  marginBottom: "10px",
  borderRadius: "10px",
};

const emailChipStyle = {
  backgroundColor: "#EAEBEB",
  borderRadius: "3px",
  padding: "5px 10px",
  marginRight: "5px",
  display: "flex",
  alignItems: "center",
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_MEDIUM,
  borderRadius: "10px",
};

const removeIconStyle = {
  marginLeft: "8px",
  cursor: "pointer",
  color: "#888",
};

const inputStyling = {
  backgroundColor: "#f0f0f0",
  marginBottom: "1rem",
  height: "2.5rem",
  color: "#333",
  paddingLeft: "1rem",
  border: "none",
  outline: "none",
  borderRadius: "5px",
  width: "48%",
};
export default function SendEmail({
  handleClose,
  payableAmount,
  debtorInfo,
  creditorInfo,
}) {
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState("");
  const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();

      if (trimmedValue && validateEmail(trimmedValue)) {
        setCc([...cc, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRemoveEmail = (index) => {
    setCc(cc?.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      from: sendFrom,
      subject: subject,
      content: preview,
      cc: cc,
    };
    const resEmail = await SendSettlementEmail(payload);
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
      setCc([]);
      setSendTo("");
      setSubject("");
      setPreview("");
    } else {
      const errorMessage = resEmail?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
    handleClose();
  };

  const disable = !sendTo || !sendFrom || !subject || !preview;

  const editorRef = useRef(null);

  useEffect(() => {
    const currentDate = new Date();
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    const initialHtmlContent = `
    <p style="margin-left: 240px;"><strong>Settlement Agreement</strong></p><!--[if !supportLineBreakNewLine]--><p style="margin-bottom:10.0pt;line-height:normal;">This Debt Settlement Agreement (the "Agreement") is entered into as of <b>${formattedDate}</b>.</p><p style="margin-bottom:10.0pt;line-height:normal;">The parties to this Agreement are as follows:</p><p style="margin-bottom:10.0pt;line-height:normal;"></p><p style="margin-bottom:10.0pt;line-height:normal;">Debtor: <b style="mso-bidi-font-weight:normal;">&nbsp&nbsp${debtorInfo?.companyName}</b></p><p style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt; line-height:normal;"><span style="mso-bidi-font-weight:normal;">Address:&nbsp<b>${debtorInfo?.address}</b></span></p><p style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;  margin-left:36.0pt;line-height:normal;"><br></p><p style="margin-bottom:10.0pt;line-height:normal;">Creditor: <b style="mso-bidi-font-weight:normal;">${creditorInfo?.name}</b></p><p style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt; line-height:normal;"><span style="mso-bidi-font-weight:normal;">Address:&nbsp<b>[ADDRESS OF THE BUSINESS]</b></span></p><p style="margin-bottom:10.0pt;line-height:normal;" id="isPasted">The Creditor and Debtor(s) agree to negotiate and settle the debt under the following terms and</p><p style="margin-bottom:10.0pt;line-height:normal;">Conditions.</p><p style="margin-bottom:10.0pt;line-height:normal;">The Creditor and Debtor(s) agree that the current outstanding debt is <strong>${payableAmount}</strong>.</p><p style="margin-bottom:10.0pt;line-height:normal;">All parties agree that the Creditor will accept a payment of ___________________ toward set</p><p style="margin-bottom:10.0pt;line-height:normal;">settlement of the debt in full. The Creditor agrees to compromise the debt under the condition</p><p style="margin-bottom:10.0pt;line-height:normal;">that they will receive the payment by _____________________.</p><p style="margin-bottom:10.0pt;line-height:normal;">This Agreement for debt settlement shall be binding upon the Creditor, Debtor(s) and their</p><p style="margin-bottom:10.0pt;line-height:normal;">successors and assignees.</p><p style="margin-bottom:10.0pt;line-height:normal;">The parties have agreed to settle finally and forever any and all claims between them of any</p><p style="margin-bottom:10.0pt;line-height:normal;">nature whatsoever from any and all liability or damages of any kind, known or unknown, in</p><p style="margin-bottom:10.0pt;line-height:normal;">contract or in tort.</p><p style="margin-bottom:10.0pt;line-height:normal;">The parties agree that the terms of this Agreement is the result of negotiations between the</p><p style="margin-bottom:10.0pt;line-height:normal;">parties, and constitute a final accord and satisfaction concerning all disputes between them.</p><p style="margin-bottom:10.0pt;line-height:normal;">All settlement terms herein are dependent upon receipt of final payment via</p><p style="margin-bottom:10.0pt;line-height:normal;">ACH in the amount of _____________________to the Creditor's account.<br><br><br></p><p style="margin-bottom:10.0pt;line-height:normal;" id="isPasted">Except only to enforce the terms of this Agreement, each party agrees not to bring any claim of</p><p style="margin-bottom:10.0pt;line-height:normal;">any kind against the other party to this Agreement concerning any matter released by this</p><p style="margin-bottom:10.0pt;line-height:normal;">Agreement. Each party further agrees that this Agreement constitutes a bar to any such future</p><p style="margin-bottom:10.0pt;line-height:normal;">claim.</p><p style="margin-bottom:10.0pt;line-height:normal;">All parties agree the other parties are free of any liability or wrongdoing. Any liability or</p><p style="margin-bottom:10.0pt;line-height:normal;">wrongdoing is expressly denied, Furthermore, the parties each agree that neither shall</p><p style="margin-bottom:10.0pt;line-height:normal;">disparage the other to any third party at any time.</p><p style="margin-bottom:10.0pt;line-height:normal;">No modification to any provisions contained in this Agreement shall be binding upon any party</p><p style="margin-bottom:10.0pt;line-height:normal;">unless made in writing and signed by all parties.</p><p style="margin-bottom:10.0pt;line-height:normal;">If any provision of this Agreement is held to be unenforceable for any reason, the remaining</p><p style="margin-bottom:10.0pt;line-height:normal;">parts of the Agreement shall remain in full force and effect.</p><p style="margin-bottom:10.0pt;line-height:normal;">Each party represents he/she/it has not assigned any portion of the claims released under this</p><p style="margin-bottom:10.0pt;line-height:normal;">Agreement to any third party.</p><p style="margin-bottom:10.0pt;line-height:normal;">This Agreement constitutes a single, integrated written contract expressing the entire agreement</p><p style="margin-bottom:10.0pt;line-height:normal;">of the parties to this Agreement. Any other agreements, discussions, promises, and</p><p style="margin-bottom:10.0pt;line-height:normal;">representations have been and are integrated into and superseded by this Agreement.</p><p style="margin-bottom:10.0pt;line-height:normal;">Each party represents he/she/it has authority to enter into this Agreement on behalf of</p><p style="margin-bottom:10.0pt;line-height:normal;">him/her/itself or his/her/its respective organization.</p><p style="margin-bottom:10.0pt;line-height:normal;">Upon receipt and subsequent clearance of the agreed upon payment, all parties release each</p><p style="margin-bottom:10.0pt;line-height:normal;">other from any further claim or liability.</p><p><br></p><p>Printed Name: _____________________ </p><p>Signature: _____________________ Date: _____________________</p><p><br></p><p>Printed Name: _____________________ </p><p>Signature: _____________________ Date: _____________________</p><p style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;  margin-left:36.0pt;line-height:normal;"><br></p>
    `;
    setPreview(initialHtmlContent);
  }, []);

  return (
    <div>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Send Email
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Send To*"
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          style={inputStyling}
        />
        <input
          type="text"
          placeholder="Send From*"
          value={sendFrom}
          onChange={(e) => setSendFrom(e.target.value)}
          style={inputStyling}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Subject*"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={inputStyling}
        />
        <Tooltip title="Press Enter To Save An Email" placement="top">
          <input
            type="text"
            placeholder="Enter CC"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inputStyling}
          />
        </Tooltip>
      </div>
      {cc?.length > 0 && (
        <div style={inputContainerStyle}>
          {cc?.map((email, index) => (
            <div key={index} style={emailChipStyle}>
              {email}
              <span
                onClick={() => handleRemoveEmail(index)}
                style={removeIconStyle}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}

      <Grid sx={{ maxHeight: "40vh", overflowY: "auto", ...ScrollbarStyles }}>
        <FroalaEditorComponent
          tag="textarea"
          model={preview}
          onModelChange={setPreview}
          ref={editorRef}
        />
      </Grid>

      <Box sx={lineStyle} />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="SEND"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleSend}
          disabled={disable}
          loading={loading}
        />
      </Box>
    </div>
  );
}
