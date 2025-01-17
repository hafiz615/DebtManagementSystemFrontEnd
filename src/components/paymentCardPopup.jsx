import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Button from "./button";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import { useToast } from "../toast/toastContext";
import {
  AddCheckPayment,
  AddManualPayment,
  GetAllUpcomingPayments,
} from "../services/services";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../constants/appConstants";
import { formatDollarAmount } from "../common";
import ScrollbarStyles from "./customScroll";
import { ArrowLeft, ArrowRight, Close } from "@mui/icons-material";
import { REACT_APP_SECURITY_KEY } from "../constants/appConstants";
import { encrypt } from "n-krypta";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankRouting, setBankRouting] = useState("");
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPage, setTotalPaymentPage] = useState();
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
      commission: parseFloat(commission?.toFixed(2)),
      transactionDate: date,
      referenceId: referenceId,
      transactionType: selectedValue,
    };

    if (selectedValue === "Check") {
      const checkParams = {
        firstName: firstName,
        lastName: lastName,
        bankAccount: bankAccount,
        bankRouting: bankRouting,
      };
      const encryptedData = encrypt(checkParams, REACT_APP_SECURITY_KEY);
      params.data = encryptedData;
      const AddCheckPaymentRes = await AddCheckPayment(params);
      if (AddCheckPaymentRes?.status === 200) {
        showToast(AddCheckPaymentRes?.data?.message, "success");
        handleClose();
        GetCaseDetails(caseId);
      } else if (AddCheckPaymentRes?.response?.status === 400) {
        const errorMessage = AddCheckPaymentRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      const AddManualPaymentRes = await AddManualPayment(params);
      if (AddManualPaymentRes?.status === 200) {
        showToast(AddManualPaymentRes?.data?.message, "success");
        handleClose();
        GetCaseDetails(caseId);
      } else if (AddManualPaymentRes?.response?.status === 400) {
        const errorMessage = AddManualPaymentRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
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
    const res = await GetAllUpcomingPayments(currentPaymentPage, debtorId);
    if (res?.status === 200) {
      let totalPage =
        Math.ceil(res?.data?.data?.transactions?.totalCount / 10) || 0;
      setUpcomingPayments(res?.data?.data?.transactions?.upcomingPayments);
      setTotalPaymentPage(totalPage);
    }
    setLoadingPayments(false);
  };

  useEffect(() => {
    getUpcommingPayments();
  }, [currentPaymentPage]);

  useEffect(() => {
    setCommission(amount - totalSelectedAmount);
  }, [amount, checkboxStates]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return `$${new Intl.NumberFormat("en-US").format(value)}`;
  };

  const isFormValid = () => {
    return (
      amount &&
      commission > 0 &&
      date &&
      selectedValue &&
      referenceId?.trim() !== ""
    );
  };

  const isPaymentFormValid = () => {
    const isBankAccountValid =
      bankAccount &&
      (bankAccount?.length === 4 ||
        (bankAccount?.length > 4 && bankAccount?.length <= 17));
    const isBankRoutingValid = bankRouting?.length === 9;
    return (
      firstName &&
      lastName &&
      bankAccount &&
      bankRouting &&
      isBankAccountValid &&
      isBankRoutingValid
    );
  };

  return (
    <Grid item xs={12}>
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "Nunito", mb: "1rem", fontWeight: "600" }}
        >
          Payment Details
        </Typography>
        <Close onClick={handleClose} />
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
            Total Amount*
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
            Commission*{" "}
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
            Reference ID {selectedValue === "Check" ? "" : "*"}
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
            Date*
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="Enter Date*"
            style={textFieldStyling}
          />
        </div>
        <div style={{ width: "32%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="paymentType"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Payment Type*
          </label>
          <Dropdown
            id="paymentType"
            menuWidth="22rem"
            height="2.5rem"
            menuItems={menuItems}
            placeholder="Select Payment Type*"
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            width="100%"
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
      </Grid>
      <Grid
        container
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {selectedValue === "Check" && (
          <>
            <div
              style={{ width: "48%", display: "flex", flexDirection: "column" }}
            >
              <label
                htmlFor="firstName"
                style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
              >
                First Name*
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                style={textFieldStyling}
              />
            </div>
            <div
              style={{ width: "48%", display: "flex", flexDirection: "column" }}
            >
              <label
                htmlFor="lastName"
                style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
              >
                Last Name*
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                style={textFieldStyling}
              />
            </div>
            <div
              style={{ width: "48%", display: "flex", flexDirection: "column" }}
            >
              <label
                htmlFor="bankAccount"
                style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
              >
                Bank Account*
              </label>
              <input
                id="bankAccount"
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Enter Bank Account"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  outline: "none",
                  border: "1px solid transparent",
                  borderRadius: "5px",
                  width: "100%",
                  fontFamily: "Nunito",
                  marginBottom: ".5rem",
                }}
              />
              {bankAccount &&
                !(
                  bankAccount?.length === 4 ||
                  (bankAccount?.length > 4 && bankAccount?.length <= 17)
                ) && (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: FONT_SIZE_SMALL,
                      fontFamily: "Nunito",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Bank Account must be between 4 and 17 characters.
                  </Typography>
                )}
            </div>
            <div
              style={{ width: "48%", display: "flex", flexDirection: "column" }}
            >
              <label
                htmlFor="bankRouting"
                style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
              >
                Bank Routing*
              </label>
              <input
                id="bankRouting"
                type="text"
                value={bankRouting}
                onChange={(e) => setBankRouting(e.target.value)}
                placeholder="Enter Bank Routing"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  outline: "none",
                  border: "1px solid transparent",
                  borderRadius: "5px",
                  width: "100%",
                  fontFamily: "Nunito",
                  marginBottom: ".5rem",
                }}
              />
              {bankRouting && bankRouting.length !== 9 && (
                <Typography
                  sx={{
                    color: "red",
                    fontSize: FONT_SIZE_SMALL,
                    fontFamily: "Nunito",
                    marginBottom: "0.5rem",
                  }}
                >
                  Bank Routing must be 9 characters.
                </Typography>
              )}
            </div>
          </>
        )}
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
              upcomingPayments
                ?.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate))
                ?.map((payments, index) => (
                  <div
                    key={index}
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
                      {payments?.status || "-"}
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Typography sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}>
          {totalPaymentPage === 0 ? 0 : currentPaymentPage} of{" "}
          {totalPaymentPage}
        </Typography>
        <IconButton
          onClick={() => setCurrentPaymentPage(currentPaymentPage - 1)}
          disabled={currentPaymentPage === 1}
        >
          <ArrowLeft />
        </IconButton>

        <IconButton
          onClick={() => setCurrentPaymentPage(currentPaymentPage + 1)}
          disabled={
            totalPaymentPage === 0 || currentPaymentPage === totalPaymentPage
          }
        >
          <ArrowRight />
        </IconButton>
      </div>
      <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          buttonText="Add Payment"
          width="8rem"
          disabled={
            selectedValue === "Check" ? !isPaymentFormValid() : !isFormValid()
          }
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
