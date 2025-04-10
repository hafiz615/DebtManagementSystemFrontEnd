import { Close } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import TextButton from "../button";
import { Colors } from "../../config/default";
import dayjs from "dayjs";
import { UpdatePaymentDate } from "../../services/services";
import { useToast } from "../../toast/toastContext";

export default function ShowUpdateDate({
  handleClose,
  transactionId,
  selectedDueDate,
  caseData,
  GetCasePaymentDetails,
}) {
  const { showToast } = useToast();
  const [date, setDate] = useState(
    selectedDueDate ? dayjs(selectedDueDate).format("YYYY-MM-DD") : ""
  );
  const [loading, setLoading] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);

  const handleUpdateDate = async () => {
    if (isWeekend) return;

    setLoading(true);
    const payload = {
      date: date,
    };
    const res = await UpdatePaymentDate(transactionId, payload);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetCasePaymentDetails(caseData._id);
      handleClose();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }

    setLoading(false);
  };

  const handleDateChange = (e) => {
    const selectedValue = e.target.value;
    const selectedDate = dayjs(selectedValue);
    const dayOfWeek = selectedDate.day(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      showToast("Weekends are not allowed. Please select a weekday.", "error");
      setIsWeekend(true);
    } else {
      setIsWeekend(false);
    }

    setDate(selectedValue);
  };

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: "700",
            marginBottom: "1em",
            fontFamily: "Nunito",
          }}
        >
          Update Date
        </Typography>
        <Close
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        />
      </Box>

      <Box
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 2,
          px: { xs: 2, sm: 0 },
        }}
      >
        <input
          type="date"
          name="dueDate"
          value={date}
          onChange={handleDateChange}
          min={dayjs().format("YYYY-MM-DD")}
          disabled={loading}
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            height: "2.5rem",
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "1px solid transparent",
            outline: "none",
            borderRadius: "5px",
            width: "100%",
          }}
        />

        <TextButton
          buttonText={"Update"}
          height="2.5rem"
          width="8rem"
          onClick={handleUpdateDate}
          loading={loading}
          disabled={isWeekend || loading || !date}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </Box>
    </>
  );
}
