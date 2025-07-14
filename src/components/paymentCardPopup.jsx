import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  styled,
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

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
      fontSize: "14px !important",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: FONT_SIZE_SMALL,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

function PaymentCardPopup({ debtorId, caseId, handleClose, GetCaseDetails }) {
  const [selectedValue, setSelectedValue] = useState("Wire");
  const [activeTab, setActiveTab] = useState("client");
  const [amount, setAmount] = useState();
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

  const menuItems = [
    { label: "Wire", value: "Wire" },
    { label: "Check", value: "Check" },
    { label: "Cash", value: "Cash" },
  ];

  const handleDateChange = (e) => setDate(e.target.value);

  const handleReferenceId = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
    setReferenceId(cleanedValue);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
      transactionIds: checkedPayments?.map((item) => item?._id),
      amount: amount,
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
      const AddCheckPaymentRes = await AddCheckPayment(params, activeTab);
      if (AddCheckPaymentRes?.status === 200) {
        showToast(AddCheckPaymentRes?.data?.message, "success");
        handleClose();
        GetCaseDetails(caseId);
      } else if (AddCheckPaymentRes?.response?.status === 400) {
        const errorMessage = AddCheckPaymentRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    } else {
      const AddManualPaymentRes = await AddManualPayment(params, activeTab);
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
    setCheckboxStates((prevState) => {
      const newChecked = !prevState[index];

      const updatedCheckedPayments = newChecked
        ? [...checkedPayments, item]
        : checkedPayments.filter(
            (checkedItem) => checkedItem?._id !== item?._id
          );

      const totalAmount = updatedCheckedPayments.reduce(
        (sum, payment) => sum + (Number(payment?.amount) || 0),
        0
      );

      setCheckedPayments(updatedCheckedPayments);
      setAmount(totalAmount);

      return {
        ...prevState,
        [index]: newChecked,
      };
    });
  };

  const getUpcommingPayments = async () => {
    setLoadingPayments(true);
    const res = await GetAllUpcomingPayments(
      currentPaymentPage,
      debtorId,
      activeTab
    );
    if (res?.status === 200) {
      let totalPage =
        Math.ceil(res?.data?.data?.transactions?.totalCount / 20) || 0;
      setUpcomingPayments(res?.data?.data?.transactions?.upcomingPayments);
      setTotalPaymentPage(totalPage);
    }
    setLoadingPayments(false);
  };

  useEffect(() => {
    getUpcommingPayments();
  }, [currentPaymentPage, activeTab]);

  useEffect(() => {
    setCheckedPayments([]);
    setCheckboxStates({});
    setAmount(0);
    setReferenceId("");
    setDate("");
  }, [activeTab]);

  const formatCurrency = (value) => {
    if (value === "") return "";
    const strValue = value.toString();
    const parts = strValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleChange = (e) => {
    const input = e.target.value.replace(/[^0-9.]/g, "");
    const regex = /^\d*\.?\d{0,2}$/;
    if (input === "" || regex.test(input)) {
      setAmount(input);
    }
  };

  const isFormValid = () => {
    return (
      upcomingPayments?.length > 0 &&
      amount &&
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
      upcomingPayments?.length > 0 &&
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
        <div style={{ width: "24%", display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="amount"
            style={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
          >
            Total Amount*
          </label>
          <input
            id="amount"
            type="text"
            value={amount ? `$${formatCurrency(amount)}` : ""}
            onChange={handleChange}
            placeholder="$0.00"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              ...textFieldStyling,
            }}
          />
        </div>
        <div style={{ width: "24%", display: "flex", flexDirection: "column" }}>
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
        <div style={{ width: "24%", display: "flex", flexDirection: "column" }}>
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
        <div style={{ width: "24%", display: "flex", flexDirection: "column" }}>
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
      <AntTabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="ant example"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          width: "100%",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <AntTab
          sx={{
            bgcolor: Colors.WHITE,
            fontWeight: "600",
            height: "3.5rem",
          }}
          label="Client"
          value="client"
        />

        <AntTab
          sx={{
            bgcolor: Colors.WHITE,
            fontWeight: "600",
            height: "3.5rem",
          }}
          label="Creditor"
          value="creditor"
        />
      </AntTabs>

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
                      {payments?.creditorName || payments?.debtorName}
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
