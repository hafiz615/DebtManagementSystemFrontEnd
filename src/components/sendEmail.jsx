import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Typography, Tooltip } from "@mui/material";
import { useToast } from "../toast/toastContext";
import { Colors } from "../config/default";
import TextButton from "./button";
import FroalaEditorComponent from "react-froala-wysiwyg";
import ScrollbarStyles from "./customScroll";
import { GetPaymentIntervals, SendSettlementEmail } from "../services/services";
import {
  FONT_SIZE_MEDIUM,
  initialHtmlContent,
} from "../constants/appConstants";
import Dropdown from "./dropdown";
import { useParams } from "react-router-dom";

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
  data,
  selectedCreditor,
  lumpSump,
  fullProfit,
  caseId,
  paymentData,
}) {
  const [sendTo, setSendTo] = useState("");
  const [sendFrom, setSendFrom] = useState("");
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

  const allRecommendation = [
    { label: "Recommendation 1", value: "recommendation 1" },
    { label: "Recommendation 2", value: "recommendation 2" },
    { label: "Recommendation 3", value: "recommendation 3" },
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

  const handleSend = async () => {
    setLoading(true);
    const payload = {
      sendTo: sendTo,
      from: sendFrom,
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
    const paymentInterval = "Weekly";

    const payment =
      strategy === "Strategy 1"
        ? data?.settlement_range?.[selectedCreditor]?.[recommendation]?.[
            rangeMinToMax
          ]
        : strategy === "Strategy 2"
        ? lumpSump?.lumpsum_settlement?.[selectedCreditor]
            ?.remaining_principle_amount
        : fullProfit?.settlement_range?.[selectedCreditor]?.[
            "recommendation 1"
          ]?.[rangeMinToMax];

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
            menuItems={allRecommendation}
            placeholder="Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="48%"
            selectedValue={recommendation}
            setSelectedValue={setRecommendation}
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
      <div style={{ margin: "16px 0px" }}>
        {!paymentData && strategy === "Strategy 1" && recommendation && (
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
        )}
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
