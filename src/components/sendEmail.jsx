import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Typography, Tooltip, IconButton } from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import { Editor } from "@tinymce/tinymce-react";
import ScrollbarStyles from "./customScroll";
import { SendSettlementEmail } from "../services/services";
import {
  FONT_SIZE_MEDIUM,
  initialHtmlContent,
  TEXT_EDITOR_KEY,
} from "../constants/appConstants";
import Dropdown from "./dropdown";

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
  backgroundColor: Colors.BG_LIGHT_GRAY,
  marginBottom: "1rem",
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
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
  data,
  selectedCreditor,
  lumpSump,
  caseId,
  paymentData,
  debtorId,
  to,
}) {
  const [sendTo, setSendTo] = useState(to || "");
  const [sendFrom, setSendFrom] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [strategy, setStrategy] = useState("Strategy 1");
  const [recommendation, setRecommendation] = useState("recommendation 1");
  const [rangeMinToMax, setRangeMinToMax] = useState("min");
  const [cc, setCc] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const allStrategies = [
    { label: "Strategy 1", value: "Strategy 1" },
    { label: "Strategy 2", value: "Strategy 2" },
    { label: "Strategy 3", value: "Strategy 3" },
  ];

  const allRanges = [
    { label: "Minimum", value: "min" },
    { label: "Maximum", value: "max" },
  ];

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
  const menu = debtorId?.map((name) => ({
    label: name,
    value: name,
  }));

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      from: selectedValue,
      subject: subject,
      content: preview,
      cc: cc,
    };
    const resEmail = await SendSettlementEmail(payload, caseId);
    if (resEmail?.status === 200) {
      showToast(resEmail?.data?.message, "success");
      setCc([]);
      setSendTo("");
      setSubject("");
      setPreview("");
      handleClose();
    } else {
      const errorMessage = resEmail?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const disable = !sendTo || !sendFrom || !subject || !preview;

  useEffect(() => {
    const currentDate = new Date();
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);
    const paymentInterval = "Weekly";

    const payment =
      strategy === "Strategy 1"
        ? data?.settlement_range?.[selectedCreditor]?.["recommendation 1"]?.[
            rangeMinToMax
          ]
        : strategy === "Strategy 2"
        ? lumpSump?.lumpsum_settlement?.[selectedCreditor]
            ?.remaining_principle_amount
        : data?.settlement_range?.[selectedCreditor]?.["recommendation 1"]?.[
            rangeMinToMax
          ];

    const formatedPayment =
      typeof payment === "string"
        ? payment && payment?.includes("$")
          ? payment
          : `$${payment}`
        : `$${payment}`;

    const formatedValue =
      typeof payableAmount === "string"
        ? payableAmount && payableAmount?.includes("$")
          ? payableAmount
          : `$${payableAmount}`
        : `$${payableAmount}`;

    const htmlContent = initialHtmlContent(
      formattedDate,
      debtorInfo,
      creditorInfo,
      formatedValue,
      paymentInterval,
      paymentData ? `$${paymentData}` : formatedPayment
    );
    setPreview(htmlContent);
  }, [strategy, rangeMinToMax, recommendation, paymentData]);

  return (
    <div style={{ width: "100%" }}>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Send Email
        </Typography>
      </Grid>
      <Box sx={lineStyle} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Send To*"
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          style={inputStyling}
        />
        <Dropdown
          height="2.5rem"
          menuItems={menu}
          menuWidth="11.7rem"
          placeholder="Send From*"
          backgroundColor={Colors.BG_LIGHT_GRAY}
          hoverColor={Colors.BG_LIGHT_GRAY}
          width={"48%"}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          emptyMessage="No Verfied Sender"
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
      <div>
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
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        {!paymentData && (
          <Dropdown
            menuWidth="22rem"
            menuItems={allStrategies}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={strategy}
            setSelectedValue={setStrategy}
          />
        )}

        {!paymentData && strategy === "Strategy 1" ? (
          <Dropdown
            menuWidth="22rem"
            menuItems={allRanges}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={rangeMinToMax}
            setSelectedValue={setRangeMinToMax}
          />
        ) : !paymentData && strategy === "Strategy 3" ? (
          <Dropdown
            menuWidth="22rem"
            menuItems={allRanges}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={rangeMinToMax}
            setSelectedValue={setRangeMinToMax}
          />
        ) : (
          ""
        )}
      </div>

      <Grid sx={{ maxHeight: "40vh", overflowY: "auto", ...ScrollbarStyles }}>
        <Editor
          style={{ margin: "0px !important" }}
          apiKey={TEXT_EDITOR_KEY}
          init={{
            menubar: "false",
            toolbar:
              "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
            height: 250,
          }}
          value={preview}
          onEditorChange={(content) => setPreview(content)}
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
