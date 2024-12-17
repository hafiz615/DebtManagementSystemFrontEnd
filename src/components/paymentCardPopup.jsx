import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import Button from "./button";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import { useToast } from "../toast/toastContext";
import { AddManualPayment, GetAllUpcomingPayments } from "../services/services";
import AmountTextField from "./amountTextField";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../constants/appConstants";
import { formatDollarAmount } from "../common";
import ScrollbarStyles from "./customScroll";

const paymentStyling = {
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_LARGE,
  width: "20%",
};

const textFieldStyling = {
  backgroundColor: Colors.BG_LIGHT_GRAY,
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
  paddingLeft: "1rem",
  outline: "none",
  border: "1px solid transparent",
  borderRadius: "5px",
  marginBottom: "1rem",
  width: "100%",
  fontFamily: "Nunito",
};
function PaymentCardPopup({ debtorId, caseId, handleClose, GetCaseDetails }) {
  const [selectedValue, setSelectedValue] = useState("Wire");
  const [amount, setAmount] = useState();
  const [commission, setCommission] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceId, setReferenceId] = useState("");
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedPayments, setCheckedPayments] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [loadingPayments, setLoadingPayments] = useState(false);
  const { showToast } = useToast();
  const totalSelectedAmount =
    checkedPayments &&
    checkedPayments?.reduce((sum, item) => sum + (item?.amount || 0), 0);

  const menuItems = [
    { label: "Wire", value: "Wire" },
    { label: "Check", value: "Check" },
    { label: "Cash", value: "Cash" },
  ];

  const handleDateChange = (e) => setDate(e.target.value);
  const handleReferenceId = (e) => setReferenceId(e.target.value) || "";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      debtorId: debtorId,
      transactionIds: checkedPayments?.map((item) => item?.id),
      amount: amount,
      commission: commission,
      transactionDate: date,
      referenceId: referenceId,
      transactionType: selectedValue,
    };
    const AddManualPaymentRes = await AddManualPayment(params);
    if (AddManualPaymentRes?.status === 200) {
      showToast(AddManualPaymentRes?.data?.message, "success");
      handleClose();
      GetCaseDetails(caseId);
    } else if (AddManualPaymentRes?.response?.status === 400) {
      const errorMessage = AddManualPaymentRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const handleCheckboxChange = (index, item) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
    setCheckedPayments((prevItems) =>
      checkboxStates[index]
        ? prevItems?.filter((checkedItem) => checkedItem.id !== item.id)
        : [...prevItems, item]
    );
  };

  const getUpcommingPayments = async () => {
    setLoadingPayments(true);
    const res = await GetAllUpcomingPayments(debtorId);
    if (res?.status === 200) {
      setUpcomingPayments(res?.data?.data?.transactions?.upcomingPayments);
    }
    setLoadingPayments(false);
  };

  useEffect(() => {
    getUpcommingPayments();
  }, []);

  useEffect(() => {
    setCommission(amount - totalSelectedAmount);
  }, [amount, checkboxStates]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return `$${new Intl.NumberFormat("en-US").format(value)}`;
  };

  return (
    <Grid item xs={12}>
      <Grid item>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Nunito", mb: "1rem", fontWeight: "600" }}
        >
          Payment Details
        </Typography>
      </Grid>
      <Grid
        xs={12}
        container
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="amount"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Total Amount
          </label>
          <input
            id="amount"
            type="text"
            value={formatCurrency(amount)}
            onChange={(e) =>
              setAmount(Number(e.target.value.replace(/[^0-9]/g, "")))
            }
            placeholder="Enter Amount"
            style={textFieldStyling}
          />
        </div>
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="Selected Amount"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Selected Amount
          </label>
          <input
            readOnly
            id="Selected Amount"
            type="text"
            value={formatCurrency(totalSelectedAmount)}
            placeholder="Selected Amount"
            style={textFieldStyling}
          />
        </div>
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="commission"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Commission{" "}
            {commission <= 0 && (
              <span
                style={{
                  fontFamily: "Nunito",
                  color: Colors.ORANGE_COLOR,
                  fontSize: FONT_SIZE_SMALL,
                }}
              >
                (Commission cannot be In negative)
              </span>
            )}
          </label>
          <input
            readOnly
            id="commission"
            type="text"
            value={formatCurrency(commission)}
            placeholder="Commission"
            style={textFieldStyling}
          />
        </div>
      </Grid>
      <Grid
        xs={12}
        container
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="referenceId"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Reference ID
          </label>
          <input
            id="referenceId"
            type="text"
            value={referenceId}
            onChange={handleReferenceId}
            placeholder="Enter Reference Id"
            style={textFieldStyling}
          />
        </div>
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="date"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="Enter Date"
            style={textFieldStyling}
          />
        </div>
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="paymentType"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Payment Type
          </label>
          <Dropdown
            id="paymentType"
            menuWidth="22rem"
            height="2.5rem"
            menuItems={menuItems}
            placeholder="Select Payment Type"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
      </Grid>
      <Grid item xs={12} sx={{ mb: "1rem" }}>
        {loadingPayments ? (
          <Grid
            xs={12}
            sx={{
              height: "15rem",
              alignItems: "center",
              justifyContent: "center",
            }}
            container
            item
          >
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <Grid
            xs={12}
            sx={{
              height: "15rem",
              overflowY: "auto",
              borderRadius: "10px",
              ...ScrollbarStyles,
              backgroundColor: Colors.BG_LIGHT_GRAY,
            }}
            container
            item
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                mt: "1rem",
                mb: "10px",
                ml: "1rem",
              }}
            >
              Upcoming Payments
            </Typography>
            {upcomingPayments?.length > 0 ? (
              upcomingPayments?.map((payments, index) => (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={checkboxStates[index] || false}
                    onChange={() => handleCheckboxChange(index, payments)}
                    sx={{
                      color: Colors.SKY_BLUE,
                      "&.Mui-checked": {
                        color: Colors.SKY_BLUE,
                      },
                    }}
                  />
                  <Typography sx={paymentStyling}>
                    {formatDate(payments?.dueDate) || "-"}
                  </Typography>
                  <Typography sx={paymentStyling}>
                    {formatDollarAmount(payments?.amount) || "-"}
                  </Typography>
                  <Typography sx={paymentStyling}>
                    {payments?.status}
                  </Typography>
                  <Typography sx={paymentStyling}>
                    {payments?.creditorName || "-"}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                No Upcoming Payments
              </Typography>
            )}
          </Grid>
        )}
      </Grid>

      <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          buttonText="Add Payment"
          width="8rem"
          disabled={!amount || commission <= 0}
          onClick={handleSubmit}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

export default PaymentCardPopup;
