import React, { useEffect, useState } from "react";
import { Box, Grid, Switch, Typography } from "@mui/material";
import TextButton from "../button";
import { Colors } from "../../config/default";
import dayjs from "dayjs";
import { UpdatePayment } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import AmountTextField from "../amountTextField";
import { FONT_SIZE_MEDIUM } from "../../constants/appConstants";
import Dropdown from "../dropdown";

const menuItems = [
  { label: "Custom", value: "Custom" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Fortnightly", value: "Fortnightly" },
  { label: "Monthly", value: "Monthly" },
];

export default function EditPayment({
  handleClose,
  data,
  GetCasePaymentDetails,
}) {
  const { showToast } = useToast();
  const [date, setDate] = useState(
    data ? dayjs(data.dueDate).format("YYYY-MM-DD") : ""
  );
  const [amount, setAmount] = useState(data?.amount || 0);
  const [timePeriod, setTimePeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [intervalChecked, setIntervalChecked] = useState(false);

  const handleUpdateDate = async () => {
    if (isWeekend) return;
    setLoading(true);
    const payload = {
      amount: amount,
      date: date,
      timePeriod: timePeriod,
    };
    const res = await UpdatePayment(
      data?.id,
      paymentChecked,
      intervalChecked,
      payload
    );
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      GetCasePaymentDetails(true);
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
    const dayOfWeek = selectedDate.day();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      showToast("Weekends are not allowed. Please select a weekday.", "error");
      setIsWeekend(true);
    } else {
      setIsWeekend(false);
    }

    setDate(selectedValue);
  };

  useEffect(() => {
    setTimePeriod(data?.timePeriod);
  }, []);

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
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
          Update Payment
        </Typography>
      </Box>

      <Box
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 2,
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          sx={{
            m: "10px 0px",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
          }}
        >
          Amount
        </Typography>
        <AmountTextField
          width="100%"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <Typography
          sx={{
            m: "10px 0px",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
          }}
        >
          Due Date
        </Typography>
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
        <Typography
          sx={{
            m: "10px 0px",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
          }}
        >
          Time Period
        </Typography>
        <Dropdown
          menuWidth="30vw"
          menuItems={menuItems}
          backgroundColor={Colors.BG_LIGHT_GRAY}
          width="100%"
          height="2.5rem"
          selectedValue={timePeriod}
          setSelectedValue={setTimePeriod}
        />
      </Box>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
            mt: "10px",
          }}
        >
          Whole Payment
        </Typography>
        <Switch
          size="medium"
          checked={paymentChecked}
          onChange={(e) => setPaymentChecked(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: Colors.SKY_BLUE,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: Colors.SKY_BLUE,
            },
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_MEDIUM,
            mt: "10px",
          }}
        >
          Whole Interval
        </Typography>
        <Switch
          size="medium"
          disabled={!paymentChecked}
          checked={intervalChecked}
          onChange={(e) => setIntervalChecked(e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: Colors.SKY_BLUE,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: Colors.SKY_BLUE,
            },
          }}
        />
      </div>
      <Grid
        xs={12}
        container
        item
        sx={{ justifyContent: "flex-end", mt: "1rem", gap: "10px" }}
      >
        <TextButton
          buttonText="Cancel"
          height="2.25rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Update"
          height="2.25rem"
          width="8rem"
          onClick={handleUpdateDate}
          loading={loading}
          disabled={isWeekend || loading || !date}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </Grid>
    </>
  );
}
