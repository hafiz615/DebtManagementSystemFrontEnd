import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import MuiModels from "../models";

import {
  Grid,
  Typography,
  styled,
  Tabs,
  Tab,
  useMediaQuery,
  IconButton,
  CircularProgress,
  Box,
  Tooltip,
  Card,
  LinearProgress,
  Checkbox,
  Modal,
  Divider,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";

import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import { PeopleAlt, Send } from "@mui/icons-material";
import TextButton from "../button";
import SettlementCards from "./settlementCards";
import {
  GetSummary,
  UpdateCommission,
  GetCaseSummariesById,
  GetSettlementJustifications,
  GetLumpSumJustifications,
  GetFullProfitSettlement,
  GetPaymentIntervals,
} from "../../services/services";

import {
  formatAmountValue,
  formatDateString,
  formatPurchasedPercentage,
  formatWeeklyBudget,
} from "../../common";
import CheckboxAutocomplete from "../checkboxAutocomplete";
import { getWeeksRemainingMessage } from "../../common";
import DataSummaryTable from "../dataSummaryTable";
import SettlementBounds from "./settlementBounds";
import StatementSummaryAccordion from "../statementSummaryAccordion";
import DebtorUploadedFiles from "../debtorUploadedFiles";
import TransactionHistory from "../transactionHistory";
import CashFlowPercentage from "./cashFlowPercentage";
import MCAByMonthAccordion from "../settlementRange/mcaByMonthAccordion";
import SendEmail from "../sendEmail";
import ProfitMarginPerMonth from "./profitMarginPerMonth";
import AggregatedSummaryAccordion from "../aggregatedSummaryAccordion";

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

const commonStyles = {
  backgroundColor: Colors.WHITE,
  height: "17vh",
  borderRadius: "10px",
  paddingLeft: "1%",
  justifyContent: "center",
  flexDirection: "column",
  gap: "10px",
  mb: { xs: "10px", lg: "0" },
};

const commonTextStyles = {
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  fontWeight: "700",
};

const inputStyles = {
  width: "12rem",
  padding: "7px 5px",
  borderRadius: "5px",
  marginRight: "10px",
  marginTop: "10px",
  backgroundColor: Colors.LIGHT_GREY,
  border: "none",
  outline: "none",
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  color: Colors.BLACK,
};

const isNegative = (number) => {
  return number < 0;
};

const GridItem = ({ title, value, rawValue, tooltip }) => (
  <Grid
    item
    xs={12}
    sm={5.8}
    md={3.8}
    lg={2.8}
    container
    sx={{ ...commonStyles, mb: "1rem" }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography sx={commonTextStyles}>{title}</Typography>
      <Tooltip title={tooltip} placement="top">
        <InfoIcon sx={{ fontSize: "17px", color: Colors.SKY_BLUE }} />
      </Tooltip>
    </Box>
    <Typography
      sx={{
        ...commonTextStyles,
        color:
          isNegative(rawValue) || isNegative(rawValue?.value) // Check both conditions
            ? Colors.ORANGE_COLOR // Set orange for negative values
            : Colors.SKY_BLUE, // Default to SKY_BLUE
      }}
    >
      {value}
    </Typography>
  </Grid>
);

const GridItemMessage = ({ title, value, rawValue }) => (
  <Grid item xs={12} sm={12} md={12} lg={12} container sx={commonStyles}>
    <Typography sx={commonTextStyles}>{title}</Typography>
    <Typography
      sx={{
        ...commonTextStyles,
      }}
    >
      {value}
    </Typography>
  </Grid>
);

export default function SettlementRange({
  id,
  getAllRanges,
  settlementloading,
  setSettlementLoading,
  creditorNames,
  allCreditorNames,
  apiData,
  scores,
  debtor,
  commissionPercentage,
  setCommissionPercentage,
  summaryAmount,
  allData,
  verifiedSender,
  statementSummaries,
  statementSummariesLoading,
  aggregatedSummaries,
  aggregatedSummariesLoading,
  lumpSumpData,
  scoresBackend,
  optionStats,
  cashFlow,
  cashFlowLoading,
  tabValue,
  setTabValue,
  setPaymentData,
  selectedCreditorDetails,
  caseData,
  mcaByMonth,
  setMcaByMonth,

  to,
  payableAmount,
  selectedCreditor,
  paymentData,
  debtorInfo,
  creditorInfo,
  fullProfit,
  handleClose,
  showEmailAgreement,
  cc,
}) {
  const caseId = id;
  const [value, setValue] = useState(0);
  const [optionValue, setOptuonValue] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [creditorSelect, setCreditorSelect] = useState([]);
  const [justification, setJustification] = useState();
  const [summary, setSummary] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [paymentChanged, setPaymentChanged] = useState(false);
  const [strategyTab, setStrategyTab] = useState(0);
  const [justificationLoading, setJustificationLoading] = useState(false);
  const [setShow, setSetShow] = useState(false);
  const [transactionKey, setTransactionKey] = useState();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [colorScheme] = useState("Tableau10");
  const [justificationValue, setJustificationValue] = useState(
    "justification_gemini"
  );
  const [selectedOption, setSelectedOption] = useState("percentageReceivable");
  const [checked, setChecked] = useState(false);
  const profitMarginPerMonthData = allData?.profitMarginPerMonth;

  const creditorNamesTabs = allCreditorNames;
  const popUpDebtorData = allData?.debtor;
  const drawerOpen = useSelector((state) => state.drawer.open);
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );
  const scrollRef = useRef(null);
  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

  const handleStrategyChange = (event, newValue) => {
    setStrategyTab(newValue);
    setValue(0);
  };

  const handleCheckboxChange = (id, data) => {
    setCheckboxStates((prev) => {
      const newState = {
        ...prev,
        [id]: !prev[id],
      };

      if (newState[id]) {
        setSelectedData((prevSelected) => [...prevSelected, data]);
      } else {
        setSelectedData((prevSelected) =>
          prevSelected.filter((item) => item !== data)
        );
      }

      return newState;
    });
  };

  const tabs = ["Fixed Amount", "Lump Sum", "Percentage Receivable"];
  const recommendations = ["recommendation 1"];
  const strat3Recommendations = ["recommendation 1"];
  const strat2Recommendations = ["lump Sum"];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOptionTabChange = (event, newValue) => {
    setOptuonValue(newValue);
  };

  const cardData = {
    0: recommendations?.map((item, index) => (
      <>
        <SettlementCards
          strategy="strategy1"
          setPaymentChanged={setPaymentChanged}
          remainingAmount={
            creditorNamesTabs[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.remaining
          }
          caseId={allData?.creditors?.[parseInt(tabValue)]?.caseId}
          title={item}
          weeksTillPaidTitle={getWeeksRemainingMessage(item)}
          settlementRange={
            apiData?.settlement_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          commissionRange={
            apiData?.commission_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          newDefaultRiskScore={apiData?.new_default_risk_score || null}
          percentageSettlementOverWeeklyBudget={
            apiData?.percentage_settlement_over_weekly_budget?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyTrueRevenue={
            apiData?.percentage_settlement_over_weekly_true_revenue?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          weeksTillPaid={
            apiData?.weeks_till_paid?.[creditorNamesTabs[parseInt(tabValue)]] ||
            null
          }
          commission={allData?.maxProfitCommission}
          scoresBackend={scoresBackend}
        />
      </>
    )),
    1: strat2Recommendations?.map((item, index) => (
      <>
        <SettlementCards
          setPaymentChanged={setPaymentChanged}
          breakEven={selectedCreditorDetails?.breakEven}
          remainingAmount={
            creditorNamesTabs[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.remaining
          }
          isLumpSumPayment={true}
          title={item}
          strategy="strategy2"
          weeksTillPaidTitle={
            item === "lump Sum" ? "Amount based on Lump Sum Recommendation" : ""
          }
          settlementRange={
            lumpSumpData?.lumpsum_settlement?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          warning={
            lumpSumpData?.warning?.[creditorNamesTabs[parseInt(tabValue)]] || ""
          }
          caseId={allData?.creditors?.[parseInt(tabValue)]?.caseId}
          commission={allData?.totalCommission}
          scoresBackend={scoresBackend}
        />
      </>
    )),

    2: strat3Recommendations?.map((item, index) => (
      <>
        <SettlementCards
          tabValue={tabValue}
          creditorNamesTabs={creditorNamesTabs}
          strategy="strategy3"
          setPaymentChanged={setPaymentChanged}
          remainingAmount={
            creditorNamesTabs[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.remaining
          }
          caseId={allData?.creditors?.[parseInt(tabValue)]?.caseId}
          isFullPayment={true}
          title={item}
          weeksTillPaidTitle={getWeeksRemainingMessage(item)}
          settlementRange={
            apiData?.settlement_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          commissionRange={
            apiData?.commission_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          newDefaultRiskScore={apiData?.new_default_risk_score || null}
          percentageSettlementOverWeeklyBudget={
            apiData?.percentage_settlement_over_weekly_budget?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyTrueRevenue={
            apiData?.percentage_settlement_over_weekly_true_revenue?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          weeksTillPaid={
            apiData?.weeks_till_paid?.[creditorNamesTabs[parseInt(tabValue)]] ||
            null
          }
          percentageReceivableAmount={
            allData?.creditors?.[parseInt(tabValue)]?.percentageReceivableAmount
          }
          percentageReceivable={
            allData?.creditors?.[parseInt(tabValue)]?.percentageReceivable
          }
          weeklyTrueRevenueAmount={
            allData?.creditors?.[parseInt(tabValue)]?.weeklyTrueRevenueAmount
          }
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          commission={allData?.percentageReceivableCommissionAmount}
          scoresBackend={scoresBackend}
        />
      </>
    )),
    4: recommendations?.map((item, index) => (
      <>
        <SettlementCards
          strategy="strategy1"
          setPaymentChanged={setPaymentChanged}
          remainingAmount={
            creditorNamesTabs[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.remaining
          }
          caseId={allData?.creditors?.[parseInt(tabValue)]?.caseId}
          title={item}
          weeksTillPaidTitle={getWeeksRemainingMessage(item)}
          settlementRange={
            optionStats?.settlement_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          commissionRange={
            optionStats?.commission_range?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyBudget={
            optionStats?.percentage_settlement_over_weekly_budget?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyTrueRevenue={
            optionStats?.percentage_settlement_over_weekly_true_revenue?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          weeksTillPaid={
            optionStats?.weeks_till_paid?.[
              creditorNamesTabs[parseInt(tabValue)]
            ] || null
          }
          optionValue={true}
          commission={allData?.maxProfitCommission}
        />
      </>
    )),
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value === "" || value[0] !== " ") {
      setInputValue(value);
    }
  };

  const handleClick = async () => {
    if (!inputValue) return;
    setChatHistory((prev) => [...prev, { type: "user", text: inputValue }]);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setTableLoading(true);
    const payload = {
      financialHealthSummary: "",
      humanInput: inputValue,
    };
    setInputValue("");
    const resSummary = await GetSummary(payload, caseId);
    if (resSummary?.status === 200) {
      const reasons = resSummary?.data?.data?.[`settlement_range_1`]?.reasons;
      const reason = resSummary?.data?.data?.[`settlement_range_1`]?.reason;
      let formattedReason = "";

      if (Array.isArray(reasons)) {
        formattedReason = reasons.join("\n");
      } else if (typeof reasons === "string") {
        formattedReason = reasons;
      } else if (Array.isArray(reason)) {
        formattedReason = reason.join("\n");
      } else if (typeof reason === "string") {
        formattedReason = reason;
      } else {
        formattedReason = "No reason available";
      }

      setChatHistory((prev) => [
        ...prev,
        {
          type: "bound",
          text: resSummary?.data?.data,
        },
      ]);
    }
    setTableLoading(false);
  };

  const handleCommissionUpdate = async () => {
    try {
      setSettlementLoading(true);
      const selectedCreditorIds = creditorSelect?.map(
        (creditor) => creditor.creditorId
      );
      if (caseId) {
        const payload = {
          commissionPercentage: parseInt(commissionPercentage),
          creditorNames: selectedCreditorIds,
        };
        const resCommission = await UpdateCommission(payload, caseId, false);
        if (resCommission?.status === 200) {
          getAllRanges([], false);
        }
      }
    } catch (err) {}
  };

  const handleUpdate = async (status) => {
    const selectedCreditorIds = creditorSelect?.map(
      (creditor) => creditor.creditorId
    );
    const params = {
      creditorNames: selectedCreditorIds,
    };
    getAllRanges(params, status);
  };

  const getAllSummary = async () => {
    const res = await GetCaseSummariesById(caseId);
    if (res?.status === 200) {
      setSummary(res?.data?.data);
    }
  };

  const getIntervals = async () => {
    const res = await GetPaymentIntervals(caseId);
    if (res?.status === 200) {
      setPaymentData(res?.data?.data);
    }
  };

  const getAllJustification = async (activeStrategy) => {
    setJustificationLoading(true);
    let response;
    switch (activeStrategy) {
      case 0:
        response = await GetSettlementJustifications(caseId);
        break;
      case 1:
        response = await GetLumpSumJustifications(caseId);
        break;
      default:
        response = await GetFullProfitSettlement(caseId);
    }
    if (response?.status === 200) {
      setJustification(response?.data?.data?.justifications);
      setJustificationLoading(false);
    }
    setJustificationLoading(false);
  };

  useEffect(() => {
    getIntervals();
  }, [paymentChanged]);

  useEffect(() => {
    getAllSummary();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTableLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (value === 0) {
      setJustificationValue("justification_gemini");
    } else if (value === 1) {
      setJustificationValue("justification_gpt4_o");
    } else if (value === 2) {
      setJustificationValue("justification_llama");
    } else if (value === 3) {
      setJustificationValue("justification_claude");
    }
  }, [value]);

  useEffect(() => {
    if (creditorNames) {
      setCreditorSelect(creditorNameWithId);
    }
  }, [creditorNames]);

  const creditorNameWithId =
    creditorNames &&
    creditorNames?.map(({ creditorAccountTitle, creditorId }) => ({
      creditorAccountTitle,
      creditorId,
    }));
  const creditorDetails = [
    {
      label: "Purchase Price",
      value: `${selectedCreditorDetails?.contractDetails?.loan_amount}` || "--",
      key: "loan_amount",
      // formatCurrency: true,
    },
    {
      label: "Net Funded Amount",
      value: selectedCreditorDetails?.contractDetails?.funded_amount || "--",
      formatCurrency: true,
      key: "funded_amount",
    },

    {
      label: "Payback Amount",
      value: selectedCreditorDetails?.contractDetails?.payable_amount || "--",
      formatCurrency: true,
      key: "payable_amount",
    },

    {
      label: "Purchased Percentage",
      value: formatPurchasedPercentage(
        selectedCreditorDetails?.contractDetails?.purchased_percentage
      ),
      key: "purchased_percentage",
    },
    {
      label: "Current Payment Amount",

      value:
        selectedCreditorDetails?.contractDetails?.repayment_amount &&
        !isNaN(
          parseFloat(
            selectedCreditorDetails.contractDetails.repayment_amount?.replace(
              /[$,]/g,
              ""
            )
          )
        )
          ? `$${parseFloat(
              selectedCreditorDetails?.contractDetails?.repayment_amount?.replace(
                /[$,]/g,
                ""
              )
            )?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} (daily)`
          : "--",
      key: "repayment_amount",
    },
    {
      label: "Break Even",
      value: selectedCreditorDetails?.breakEven || "--",
      formatCurrency: true,
    },
    {
      label: "Current Balance",
      value:
        selectedCreditorDetails?.totalDebt -
          selectedCreditorDetails?.remainingAmountPaid || "--",
      formatCurrency: true,
    },
  ];

  const formatCurrencyTable = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    })?.format(value);
  };

  const creditorNamesDetails = creditorNames?.map((creditor) => {
    const cleanLoanAmount = creditor?.contractDetails?.loan_amount
      ? creditor?.contractDetails?.loan_amount?.replace(/[$,]/g, "")
      : "--";

    const purchasePrice =
      cleanLoanAmount !== "--" && !isNaN(Number(cleanLoanAmount))
        ? formatCurrencyTable(Number(cleanLoanAmount))
        : "--";

    const cleanFundedAmount = creditor?.contractDetails?.funded_amount
      ? creditor?.contractDetails?.funded_amount?.replace(/[$,]/g, "")
      : "--";

    const fundedAmount =
      cleanFundedAmount !== "--" && !isNaN(Number(cleanFundedAmount))
        ? formatCurrencyTable(Number(cleanFundedAmount))
        : "--";

    const cleanPayableAmount = creditor?.contractDetails?.payable_amount
      ? creditor?.contractDetails?.payable_amount?.replace(/[$,]/g, "")
      : "--";

    const paybackAmount =
      cleanPayableAmount !== "--" && !isNaN(Number(cleanPayableAmount))
        ? formatCurrencyTable(Number(cleanPayableAmount))
        : "--";

    const payableAmount =
      creditor?.totalDebt !== undefined &&
      creditor?.remainingAmountPaid !== undefined
        ? isNaN(
            Number(creditor?.totalDebt) - Number(creditor?.remainingAmountPaid)
          )
          ? "--"
          : formatCurrencyTable(
              Number(creditor?.totalDebt) -
                Number(creditor?.remainingAmountPaid)
            )
        : "--";

    const breakEvenPoint = creditor?.breakEven
      ? isNaN(parseFloat(creditor?.breakEven))
        ? "--"
        : formatCurrencyTable(parseFloat(creditor?.breakEven))
      : "--";

    const purchased_percentage = formatPurchasedPercentage(
      creditor?.contractDetails?.purchased_percentage || "--"
    );

    const repayment_amount = creditor?.contractDetails?.repayment_amount
      ? `$${creditor?.contractDetails?.repayment_amount?.replace(/[$,]/g, "")}`
      : "--";

    return {
      creditorName: creditor?.accountTitleMapping[0]?.accountTitle,
      purchasePrice,
      fundedAmount,
      paybackAmount,
      payableAmount,
      breakEvenPoint,
      purchased_percentage,
      repayment_amount,
    };
  });

  const headerData = [
    { key: "creditorName", heading: "Creditors", width: "11%" },
    { key: "purchasePrice", heading: "Purchase Price", width: "11%" },
    { key: "fundedAmount", heading: "Net Funded Amount", width: "11%" },
    { key: "paybackAmount", heading: "Payback Amount", width: "11%" },
    { key: "payableAmount", heading: "Current Balance", width: "11%" },
    { key: "breakEvenPoint", heading: "Break Even Point", width: "11%" },
    {
      key: "purchased_percentage",
      heading: "Purchased Percentage",
      width: "11%",
    },
    {
      key: "repayment_amount",
      heading: "Current Payment Amount",
      width: "11%",
    },
  ];
  const totalPayableAmount = creditorNames?.reduce((total, creditor) => {
    const payableAmount = creditor?.contractDetails?.payable_amount?.replace(
      /[$,]/g,
      ""
    );
    return total + (parseFloat(payableAmount) || 0);
  }, 0);
  const parseCurrency = (amount) => {
    return parseFloat(amount?.replace(/[$,]/g, "") || 0);
  };
  const formatSummaryDetails = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "--";
    return `$${Number(value)?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const summaryDetails = {
    creditorName: "Summary",

    purchasePrice: formatSummaryDetails(
      creditorNames?.reduce((total, creditor) => {
        const purchasePrice = parseCurrency(
          creditor?.contractDetails?.loan_amount || "0"
        );
        return total + Number(purchasePrice);
      }, 0)
    ),

    fundedAmount: formatSummaryDetails(
      creditorNames?.reduce((total, creditor) => {
        const cleanedAmount = creditor?.contractDetails?.funded_amount
          ? Number(
              creditor?.contractDetails?.funded_amount?.replace(/[$,]/g, "")
            )
          : 0;
        return total + cleanedAmount;
      }, 0)
    ),

    paybackAmount:
      totalPayableAmount > 0 ? formatSummaryDetails(totalPayableAmount) : "--",

    payableAmount: formatSummaryDetails(
      creditorNames?.reduce((total, creditor) => {
        return (
          total +
          (Number(creditor?.totalDebt || 0) -
            Number(creditor?.remainingAmountPaid || 0))
        );
      }, 0)
    ),

    breakEvenPoint: formatSummaryDetails(
      creditorNames?.reduce((total, creditor) => {
        return total + Number(creditor?.breakEven || 0);
      }, 0)
    ),

    purchased_percentage:
      creditorNames
        ?.reduce((total, creditor) => {
          const percentage = parseFloat(
            creditor?.contractDetails?.purchased_percentage || "0"
          );
          return total + percentage;
        }, 0)
        .toFixed(2) + "%",
    repayment_amount: "--",
  };

  const updatedCreditorNamesDetails = creditorNamesDetails && [
    ...creditorNamesDetails,
    summaryDetails,
  ];
  const filteredData =
    updatedCreditorNamesDetails &&
    updatedCreditorNamesDetails?.filter(
      (item) => item.creditorName !== "Summary"
    );

  const isAnyChecked = Object.values(checkboxStates)?.some(
    (checked) => checked
  );

  const topPayees = scores?.Scores?.top_payees;
  const isArray = Array.isArray(topPayees);
  const topPayeesKeys = isArray
    ? {}
    : Object.keys(scores?.Scores?.top_payees || {});

  const countData = isArray
    ? topPayees?.map((item, i) => {
        const label = Object.keys(item)[0];
        const value = Object.values(item)[0];
        return {
          id: i,
          value: value,
          label: label,
        };
      })
    : topPayees?.[selectedMonth || topPayeesKeys[0]]?.map((item, i) => {
        const label = Object.keys(item)[0];
        const value = Object.values(item)[0];
        return {
          id: i,
          value: value,
          label: label,
        };
      });

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const formatCurrencyValue = (value) => {
    if (value === null || value === undefined) return "--";
    const valueStr = typeof value === "number" ? value?.toString() : value;
    const cleanedValue = valueStr?.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(cleanedValue);
    if (!isNaN(numericValue)) {
      return `$${numericValue?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return "--";
  };

  const categories = {
    Tableau10: [
      "#24658D",
      "#429EB0",
      "#F1A230",
      "#E95050",
      "#4E79A7",
      "#F28E2C",
      "#E15759",
      "#76B7B2",
      "#59A14F",
      "#EDC949",
      "#AF7AA1",
      "#FF9DA7",
      "#9C755F",
      "#BAB0AB",
      "#1B9E77",
      "#D95F02",
      "#7570B3",
      "#E7298A",
      "#66A61E",
      "#E6AB02",
      "#A6761D",
      "#666666",
      "#7FC97F",
      "#BEAED4",
      "#FDC086",
      "#FFFF99",
      "#386CB0",
      "#F0027F",
      "#BF5B17",
      "#666666",
      "#377EB8",
      "#4DAF4A",
      "#984EA3",
      "#FF7F00",
      "#FFFF33",
      "#A65628",
      "#F781BF",
      "#999999",
    ],
  };

  const debtorData = [
    { item: "Full Name", value: debtor?.fullName || "--" },
    { item: "Customer Status", value: debtor?.status || "--" },
    { item: "Phone", value: debtor?.phone ? `+1${debtor?.phone}` : "--" },
    {
      item: "Weekly Budget",
      value: debtor?.weeklyBudget
        ? `$${formatWeeklyBudget(debtor?.weeklyBudget)}`
        : "--",
    },
  ];

  const handleItemClick = (event, item) => {
    const newTransactionKey = item?.seriesId?.[item?.dataIndex]?.label;
    setTransactionKey(newTransactionKey);
    if (transactionKey) {
      setSetShow(true);
    }
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
      }}
    >
      <Modal open={setShow} onClose={() => setSetShow(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            maxHeight: "70vh",
            minHeight: "70vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
          }}
        >
          {transactionKey && (
            <TransactionHistory
              transactionKey={transactionKey}
              data={
                scores?.Scores?.transaction_history?.[
                  selectedMonth || topPayeesKeys[0]
                ]
              }
            />
          )}
        </Box>
      </Modal>

      {settlementloading ? (
        <Grid
          container
          sx={{
            height: "90vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={100} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MuiModels
                  buttonIcon="settlementRangeReload"
                  show="WeeklyBudget"
                  iconColor={Colors.BLACK}
                  maxHeight="78vh"
                  caseId={caseId}
                  popUpDebtorData={popUpDebtorData}
                  getAllRanges={getAllRanges}
                />
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                >
                  Reload Settlement Range
                </Typography>
              </Box>
            </Grid>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <PeopleAlt
                sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
              />

              <CheckboxAutocomplete
                options={creditorNameWithId && creditorNameWithId}
                multiSelect={creditorSelect}
                setMultiselect={setCreditorSelect}
                placeholder="Creditors"
                width="10rem"
                update={true}
                handleUpdate={handleUpdate}
              />
            </div>
          </div>
          <Grid
            container
            item
            xs={12}
            sx={{
              justifyContent: "space-between",
              mt: "1rem",
            }}
          >
            <Grid
              item
              xs={4.5}
              sx={{
                backgroundColor: Colors.WHITE,
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  fontFamily: "Nunito",
                }}
              >
                Personal Details
              </p>
              <Divider />
              <Grid
                container
                sx={{
                  height: "70%",
                  alignItems: "center",
                }}
              >
                {debtorData?.map((data, index) => {
                  return (
                    <Grid item xs={5} key={index}>
                      <div
                        style={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                          fontSize: FONT_SIZE_LARGE,
                          marginTop: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {data?.item}
                        {data?.item === "Weekly Budget" && (
                          <MuiModels
                            show="updateWeeklyBudget"
                            data={data}
                            popUpDebtorData={popUpDebtorData}
                            getAllRanges={getAllRanges}
                          />
                        )}
                      </div>
                      <Tooltip title={data?.value} placement="top-end">
                        <span
                          style={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                            color: Colors.DIM_LIGHT_GRAY,
                            marginTop: "0.5rem",
                          }}
                        >
                          {data?.value}
                        </span>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={7}>
              <DebtorUploadedFiles data={caseData} />
            </Grid>
          </Grid>

          <Grid xs={12}>
            <Typography
              sx={{
                fontWeight: "600",
                fontFamily: "Nunito",
                marginTop: "1rem",
              }}
            >
              Update Commission Percentage
            </Typography>
            <input
              min={1}
              max={50}
              style={inputStyles}
              type="number"
              placeholder="Commission Percentage"
              value={commissionPercentage}
              onChange={(e) => setCommissionPercentage(e.target.value)}
            />
            <TextButton
              buttonText="Update"
              height="2rem"
              width="8rem"
              onClick={handleCommissionUpdate}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
              disabled={
                !commissionPercentage ||
                commissionPercentage > 50 ||
                commissionPercentage < 1
              }
            />
          </Grid>

          <Grid xs={12} sx={{ mt: "1rem" }}>
            <AggregatedSummaryAccordion
              data={aggregatedSummaries}
              loading={aggregatedSummariesLoading}
            />
          </Grid>
          <Grid xs={12} sx={{ mt: "1rem" }}>
            <StatementSummaryAccordion
              data={statementSummaries}
              loading={statementSummariesLoading}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: "1rem" }}>
            <MCAByMonthAccordion mcaByMonth={mcaByMonth} />
          </Grid>
          {/* <Grid item xs={12} sx={{ mt: "1rem" }}>
              <ProfitMarginPerMonth
                profitMarginPerMonthData={profitMarginPerMonthData}
              />
            </Grid> */}

          {showEmailAgreement && (
            <Grid
              item
              xs={12}
              id="targetComponent"
              sx={{
                backgroundColor: Colors.WHITE,
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                marginTop: "1rem",
              }}
            >
              <SendEmail
                payableAmount={payableAmount}
                debtorInfo={debtorInfo}
                creditorInfo={creditorInfo}
                data={apiData}
                selectedCreditor={selectedCreditor}
                lumpSump={lumpSumpData}
                fullProfit={fullProfit}
                caseId={id}
                paymentData={paymentData}
                debtorId={verifiedSender}
                to={to}
                handleClose={handleClose}
                cc={cc}
              />
            </Grid>
          )}

          <Grid container item xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            {/* <GridItem
              key="Monthly Profit Excluding Payments"
              title="Monthly Profit Excluding Payments"
              tooltip="Monthly profit by not making the creditor payments."
              value={
                optionValue === 1
                  ? apiData?.option_2_stats?.true_profit
                    ? `$${new Intl.NumberFormat()?.format(
                        apiData?.option_2_stats?.true_profit
                      )}`
                    : "No Data"
                  : apiData?.true_profit
                  ? `$${formatAmountValue(apiData?.true_profit)}`
                  : "No Data"
              }
              rawValue={apiData?.true_profit}
            /> */}

            {/* <GridItem
              key="Profitability"
              title="Profitability Excluding Payments"
              tooltip="Measure of how much profit your business makes after expenses."
              value={
                optionValue === 1
                  ? apiData?.option_2_stats?.profitability
                    ? `${new Intl.NumberFormat()?.format(
                        apiData?.option_2_stats?.profitability
                      )}%`
                    : "No Data"
                  : apiData?.profitability
                  ? `${new Intl.NumberFormat()?.format(
                      apiData?.profitability
                    )}%`
                  : "No Data"
              }
              rawValue={apiData?.profitability}
            /> */}
            {/* <GridItem
              key="Monthly Profit Including Payments"
              title="Monthly Profit Including Payments"
              tooltip="Monthly profit after making the creditor payments."
              value={
                optionValue === 1
                  ? apiData?.option_2_stats?.weekly_profit
                    ? `$${new Intl.NumberFormat()?.format(
                        apiData?.option_2_stats?.weekly_profit
                      )}`
                    : "No Data"
                  : apiData?.weekly_profit
                  ? `$${formatAmountValue(apiData?.weekly_profit)}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_profit}
            /> */}
            {/* <GridItem
              key="Profitability Including Payments"
              title="Profitability Including payments"
              tooltip="Profitability Including the creditor Payment"
              value={
                optionValue === 1
                  ? apiData?.option_2_stats
                      ?.profitability_without_creditor_payments
                    ? `${new Intl.NumberFormat()?.format(
                        apiData?.option_2_stats
                          ?.profitability_without_creditor_payments
                      )}%`
                    : "No Data"
                  : apiData?.profitability_without_creditor_payments
                  ? `${new Intl.NumberFormat()?.format(
                      apiData?.profitability_without_creditor_payments
                    )}%`
                  : "No Data"
              }
              rawValue={apiData?.profitability_without_creditor_payments}
            /> */}
            {/* <GridItem
              key="Monthly True Revenue"
              title="Monthly True Revenue"
              tooltip="Total revenue earned by the business each monthly."
              value={
                optionValue === 1
                  ? apiData?.option_2_stats?.weekly_true_revenue
                    ? `$${new Intl.NumberFormat()?.format(
                        apiData?.option_2_stats?.weekly_true_revenue
                      )}`
                    : "No Data"
                  : apiData?.weekly_true_revenue
                  ? `$${formatAmountValue(apiData?.weekly_true_revenue)}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_true_revenue}
            /> */}

            {/* {strategyTab === 0 && (
              <GridItem
                key="Monthly Receivable Commission"
                title="Monthly Receivable Commission"
                tooltip="Monthly payment Which we receive."
                value={
                  allData?.maxProfitCommission
                    ? `$${formatAmountValue(allData?.maxProfitCommission)}`
                    : "No Data"
                }
                rawValue={allData?.maxProfitCommission}
              />
            )} */}
            {strategyTab === 1 && (
              <GridItem
                key="Total Commission"
                title="Total Commission"
                tooltip="Total Commission which we will collect."
                value={
                  allData?.totalCommission
                    ? `$${formatAmountValue(allData?.totalCommission)}`
                    : "No Data"
                }
                rawValue={allData?.totalCommission}
              />
            )}

            {strategyTab === 2 && (
              <GridItem
                key="Monthly Receivable Commission"
                title="Monthly Receivable Commission"
                tooltip="Monthly Commission which we receive."
                value={
                  allData?.percentageReceivableCommission
                    ? `${allData?.percentageReceivableCommission}%`
                    : "No Data"
                }
                rawValue={allData?.percentageReceivableCommission}
              />
            )}
            <GridItem
              key="Average monthly profit and profit % excluding payments"
              title="Avg. Monthly profit excluding payments"
              tooltip="Average monthly profit and profit % excluding payments"
              value={
                allData?.averageMonthlyProfitExcludingPayments &&
                typeof allData?.averageMonthlyProfitExcludingPayments?.value ===
                  "number" &&
                typeof allData?.averageMonthlyProfitExcludingPayments
                  ?.percentage === "number"
                  ? `$${formatAmountValue(
                      allData.averageMonthlyProfitExcludingPayments?.value
                    )} (${allData?.averageMonthlyProfitExcludingPayments?.percentage?.toFixed(
                      2
                    )}%)`
                  : "No Data"
              }
              rawValue={allData?.averageMonthlyProfitExcludingPayments}
            />
            <GridItem
              key="Average monthly profit and profit % including payments"
              title="Avg. Monthly profit including payments"
              tooltip="Average monthly profit and profit % including payments"
              value={
                allData?.averageMonthlyProfitIncludingPayments &&
                typeof allData?.averageMonthlyProfitIncludingPayments?.value ===
                  "number" &&
                typeof allData?.averageMonthlyProfitIncludingPayments
                  .percentage === "number"
                  ? `$${formatAmountValue(
                      allData?.averageMonthlyProfitIncludingPayments?.value
                    )} (${allData?.averageMonthlyProfitIncludingPayments?.percentage?.toFixed(
                      2
                    )}%)`
                  : "No Data"
              }
              rawValue={allData?.averageMonthlyProfitIncludingPayments}
            />

            <GridItem
              key="Current monthly profit and profit % excluding payments"
              title="Current profit excluding payments"
              tooltip="Current monthly profit and profit % excluding payments"
              value={
                allData?.currentMonthlyProfitExcludingPayments &&
                typeof allData?.currentMonthlyProfitExcludingPayments?.value ===
                  "number" &&
                typeof allData?.currentMonthlyProfitExcludingPayments
                  ?.percentage === "number"
                  ? `$${formatAmountValue(
                      allData?.currentMonthlyProfitExcludingPayments?.value
                    )} (${allData?.currentMonthlyProfitExcludingPayments?.percentage?.toFixed(
                      2
                    )}%)`
                  : "No Data"
              }
              rawValue={allData?.currentMonthlyProfitExcludingPayments}
            />

            <GridItem
              key="Current monthly profit and profit % including payments"
              title="Current profit including payments"
              tooltip="Current monthly profit and profit % including payments"
              value={
                allData?.currentMonthlyProfitIncludingPayments &&
                typeof allData?.currentMonthlyProfitIncludingPayments?.value ===
                  "number" &&
                typeof allData?.currentMonthlyProfitIncludingPayments
                  ?.percentage === "number"
                  ? `$${formatAmountValue(
                      allData?.currentMonthlyProfitIncludingPayments?.value
                    )} (${allData.currentMonthlyProfitIncludingPayments.percentage?.toFixed(
                      2
                    )}%)`
                  : "No Data"
              }
              rawValue={allData?.currentMonthlyProfitIncludingPayments}
            />

            {scores?.Scores && (
              <>
                <GridItem
                  key="UCC Score"
                  title="UCC Score"
                  tooltip="A score representing the creditor's claim on your business assets."
                  value={`${scores?.Scores?.["UCC Score"]}%` ?? "No Data"}
                  rawValue={scores?.Scores?.["UCC Score"]}
                />
                <GridItem
                  key="Default Risk Score"
                  title="Default Risk Score"
                  tooltip="The likelihood of missing a payment or defaulting on your loan."
                  value={
                    `${scores?.Scores?.["Default Risk Score"]}%` ?? "No Data"
                  }
                  rawValue={scores?.Scores?.["Default Risk Score"]}
                />
                <CashFlowPercentage
                  cashFlowLoading={cashFlowLoading}
                  cashFlow={cashFlow}
                />

                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: Colors.WHITE,
                    borderRadius: "10px",
                    mt: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "700",
                      fontFamily: "Nunito",
                      ml: "5%",
                      mt: "1rem",
                    }}
                  >
                    Top Payee
                  </Typography>
                  <Divider sx={{ m: "10px 0px" }} />
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: "35vh",
                      padding: "0px 15%",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {countData ? (
                      <>
                        <div
                          style={{
                            width: "35%",
                            height: "100%",
                          }}
                        >
                          <PieChart
                            series={[
                              {
                                id: countData,
                                data: countData,
                                cx: 100,
                                cy: 120,
                                highlightScope: {
                                  faded: "global",
                                  highlighted: "item",
                                },
                              },
                            ]}
                            onItemClick={handleItemClick}
                            colors={categories[colorScheme]}
                            slotProps={{
                              legend: { hidden: true },
                            }}
                            width={315}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "1em",
                            height: "90%",
                            width: "65%",
                            overflowY: "scroll !important",
                            borderRadius: "15px",
                            backgroundColor: Colors.BG_LIGHT_GRAY,
                          }}
                        >
                          {isArray ? (
                            <Typography
                              sx={{
                                fontFamily: "Nunito",
                                fontSize: FONT_SIZE_LARGE,
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <InfoIcon
                                sx={{ color: Colors.YELLOW, fontSize: "24px" }}
                              />
                              Hard reload to get the latest changes
                            </Typography>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <label
                                style={{
                                  fontFamily: "Nunito",
                                  marginRight: "10px",
                                  fontSize: FONT_SIZE_LARGE,
                                  fontWeight: 600,
                                }}
                              >
                                Select Month:
                              </label>
                              <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                style={{
                                  padding: "10px 1rem",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {topPayeesKeys?.map((key) => (
                                  <option key={key} value={key}>
                                    {key}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <Grid
                            sx={{
                              position: "relative",
                              overflowY: "auto",
                              ...ScrollbarStyles,
                              height: "100%",
                            }}
                          >
                            {countData?.map((item, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: ".5rem",
                                }}
                              >
                                <div
                                  style={{
                                    width: "1rem",
                                    height: "16px",
                                    backgroundColor:
                                      categories[colorScheme][item?.id],
                                    marginRight: "5px",
                                  }}
                                />
                                <Tooltip
                                  title={item?.label}
                                  placement="top"
                                  arrow
                                >
                                  <span
                                    style={{
                                      fontSize: FONT_SIZE_MEDIUM,
                                    }}
                                  >
                                    {item?.label}
                                  </span>
                                </Tooltip>
                              </div>
                            ))}
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                              }}
                            ></div>
                          </Grid>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        No Data
                      </div>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>

          {scores?.message && (
            <Grid container item xs={6} sx={{ gap: "2%", mt: "1rem" }}>
              <GridItemMessage
                key="No Score Reason"
                title="No Score Reason"
                value="Mca companies not found, data calculated based on weekly budget"
                rawValue="Mca companies not found, data calculated based on weekly budget"
              />
            </Grid>
          )}

          <Grid
            container
            item
            xs={12}
            sx={{
              width: widthStyling,
              mt: "1rem",
              backgroundColor: Colors.WHITE,
            }}
          >
            <AntTabs
              value={strategyTab}
              onChange={handleStrategyChange}
              aria-label="strategy tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minWidth: "100%",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              {tabs?.map((item, index) => (
                <AntTab
                  key={index}
                  sx={{
                    bgcolor: Colors.WHITE,
                    width: "max-content",
                    fontWeight: "600",
                    height: "3.5rem",
                  }}
                  label={item}
                />
              ))}
            </AntTabs>
          </Grid>

          {strategyTab === 0 && (
            <Grid container sx={{ backgroundColor: Colors.WHITE, mt: "1rem" }}>
              <AntTabs
                value={optionValue}
                onChange={handleOptionTabChange}
                aria-label="options tabs"
              >
                <AntTab
                  sx={{
                    bgcolor: Colors.WHITE,
                    width: "max-content",
                    fontWeight: "600",
                    height: "3.5rem",
                  }}
                  label="Clients Weekly Budget"
                />

                <AntTab
                  sx={{
                    bgcolor: Colors.WHITE,
                    width: "max-content",
                    fontWeight: "600",
                    height: "3.5rem",
                  }}
                  label="Clients Profit Margin"
                />
              </AntTabs>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sx={{
              width: widthStyling,
              mt: "1rem",
              backgroundColor: Colors.WHITE,
            }}
          >
            <AntTabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="ant example"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minWidth: "100%",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              {creditorSelect &&
                creditorSelect?.map((item, i) => (
                  <AntTab
                    key={i}
                    sx={{
                      bgcolor: Colors.WHITE,
                      width: "max-content",
                      fontWeight: "600",
                      height: "3.5rem",
                    }}
                    label={item?.creditorAccountTitle}
                  />
                ))}

              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: "max-content",
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="Summary"
              />
            </AntTabs>
          </Grid>
          <Grid container>
            <Typography
              sx={{
                fontWeight: "600",
                fontFamily: "Nunito",
                marginTop: "1rem",
              }}
            >
              {creditorNamesTabs[tabValue] === "Summary"
                ? "Summary Contract Information"
                : "Creditors Contract Information"}
            </Typography>
            {selectedCreditorDetails &&
              selectedCreditorDetails?.contractDetails && (
                <>
                  <Grid container item xs={12} sx={{ gap: "1rem", mt: "1rem" }}>
                    {creditorDetails?.map((detail, index) => {
                      if (
                        detail?.label === "Percentage Receivables" &&
                        strategyTab !== 2
                      ) {
                        return null;
                      }

                      const formattedValue = (() => {
                        if (
                          detail?.label === "Current Payment Amount" ||
                          detail?.label === "Purchased Percentage"
                        ) {
                          return String(detail?.value) || "--";
                        } else {
                          return formatCurrencyValue(detail?.value);
                        }
                      })();

                      const tooltipContent = {
                        "Purchase Price":
                          "This is the amount being paid for the Receivables Purchased Amount.",
                        "Net Funded Amount":
                          "This is the net amount being paid after deduction of applicable fees, if any.",
                        "Payback Amount": " This is the amount of Receivables.",
                        "Break Even":
                          "1.2x of Net Funded Amount Minus Amount Paid Back.",
                        "Current Balance":
                          "The remaining amount you owe to the creditor.",
                        "Monthly Budget":
                          "Your profit before making any debt payments.",
                        "Purchased Percentage":
                          "The percentage of the loan amount that has been repaid.",
                        "Current Payment Amount":
                          "The initial amount borrowed before any repayments.",
                        "Payment Frequency": "Payment Frequency.",
                      };

                      return (
                        <Grid
                          item
                          xs={12}
                          sm={5.8}
                          md={3.8}
                          lg={2.8}
                          container
                          sx={commonStyles}
                          key={index}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginRight: "0.5rem",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Typography sx={commonTextStyles}>
                                {detail?.label}
                              </Typography>

                              <Tooltip
                                title={tooltipContent[detail?.label] || ""}
                                placement="top"
                              >
                                <InfoIcon
                                  sx={{
                                    fontSize: "17px",
                                    color: Colors.SKY_BLUE,
                                  }}
                                />
                              </Tooltip>
                            </div>
                            <div>
                              {detail?.label !== "Current Balance" &&
                                detail?.label !== "Break Even" &&
                                detail?.label !== "Payment Frequency" && (
                                  <div>
                                    <MuiModels
                                      show="editSettlementContractCard"
                                      creditorDetails={formattedValue || ""}
                                      selectedCreditorDetailsKey={detail?.key}
                                      caseId={selectedCreditorDetails?.caseId}
                                      getAllRanges={getAllRanges}
                                    />
                                  </div>
                                )}
                            </div>
                          </Box>

                          <Typography
                            sx={{
                              ...commonTextStyles,
                              color: Colors.SKY_BLUE,
                            }}
                          >
                            {formattedValue}
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            {creditorNamesTabs[tabValue] === "Summary" && (
              <>
                <Grid item xs={12} sx={{ mt: "1rem" }}>
                  <DataSummaryTable
                    headerData={headerData}
                    data={filteredData}
                    show={true}
                    summaryDetails={summaryDetails}
                  />
                </Grid>
              </>
            )}

            {apiData?.warnings?.[creditorNamesTabs[tabValue]] && (
              <Grid
                sx={{
                  mt: "10px",
                  backgroundColor: Colors.WHITE,
                  borderRadius: "10px",
                  padding: "16px",
                  maxWidth: "50%",
                  border: `2px solid ${Colors.ORANGE_COLOR}`,
                }}
              >
                <Typography sx={commonTextStyles}>Warning!</Typography>
                <Typography sx={{ ...commonTextStyles, fontWeight: "500" }}>
                  {apiData?.warnings?.[creditorNamesTabs[tabValue]]}
                </Typography>
              </Grid>
            )}
          </Grid>

          {strategyTab === 0 && optionValue === 1 ? (
            <Grid
              container
              item
              xs={12}
              sx={{
                borderRadius: "10px",
                mt: "1rem",
                justifyContent: "space-between",
              }}
            >
              {cardData[4]}
            </Grid>
          ) : (
            <Grid
              container
              item
              xs={12}
              sx={{
                borderRadius: "10px",
                mt: "1rem",
                justifyContent: "space-between",
              }}
            >
              {cardData[strategyTab]}
            </Grid>
          )}

          <Grid
            item
            xs={12}
            container
            sx={{
              backgroundColor: Colors.WHITE,
              borderRadius: "10px",
              mt: "2rem",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AntTabs
              value={value}
              onChange={handleChange}
              aria-label="ant example"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: "max-content",
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="Gemini"
              />
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: "max-content",
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="GPT-04"
              />
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: "max-content",
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="llama"
              />
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: "max-content",
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="Claude"
              />
            </AntTabs>

            <div style={{ marginRight: "16px" }}>
              <div style={{ display: "flex", gap: "2%" }}>
                <TextButton
                  buttonText="GET JUSTIFICATION"
                  height="2.5rem"
                  width="12rem"
                  backgroundColor={Colors.SKY_BLUE}
                  onClick={() => getAllJustification(strategyTab)}
                />
                <MuiModels
                  show="sendEmailJustification"
                  disabled={!isAnyChecked}
                  data={selectedData}
                  caseId={caseId}
                  debtorId={verifiedSender}
                  cc={cc}
                />
              </div>
            </div>
          </Grid>

          <Grid xs={12}>
            <Grid
              item
              xs={12}
              sx={{
                height: "50vh",
                overflowY: "auto",
                backgroundColor: "white",
                padding: "16px",
                ...ScrollbarStyles,
              }}
            >
              <Grid
                xs={12}
                container
                justifyContent="flex-start"
                sx={{ marginBottom: "8px" }}
              >
                <div>
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: Colors.SKY_BLUE,
                      },
                    }}
                    disabled={
                      !justification?.[justificationValue]?.[
                        creditorNamesTabs[tabValue]
                      ]
                    }
                    checked={checkboxStates["justification"]}
                    onChange={() =>
                      handleCheckboxChange(
                        "justification",
                        justification?.[justificationValue]?.[
                          creditorNamesTabs[tabValue]
                        ]
                      )
                    }
                  />
                </div>
                <Card
                  sx={{
                    maxWidth: "60%",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    boxShadow: "none",
                  }}
                >
                  {justificationLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
                  ) : (
                    <Typography variant="body1">
                      <ReactMarkdown>
                        {justification?.[justificationValue]?.[
                          creditorNamesTabs[tabValue]
                        ] || "No Justifications"}
                      </ReactMarkdown>
                    </Typography>
                  )}
                </Card>
              </Grid>
              {summary?.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid
                    xs={12}
                    container
                    justifyContent="flex-end"
                    sx={{ marginBottom: "8px" }}
                  >
                    <Card
                      sx={{
                        maxWidth: "70%",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        backgroundColor: Colors.BG_LIGHT_GRAY,
                        boxShadow: "none",
                      }}
                    >
                      <Typography variant="body1">
                        <ReactMarkdown>{item?.prompt}</ReactMarkdown>
                      </Typography>
                      <p
                        style={{
                          textAlign: "right",
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_SMALL,
                        }}
                      >
                        {formatDateString(item?.updatedAt)}
                      </p>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    container
                    justifyContent="flex-start"
                    sx={{ marginBottom: "8px" }}
                  >
                    <div>
                      <Checkbox
                        sx={{
                          "&.Mui-checked": {
                            color: Colors.SKY_BLUE,
                          },
                        }}
                        checked={checkboxStates[`summary_${index}`]}
                        onChange={() =>
                          handleCheckboxChange(`summary_${index}`, item?.chat)
                        }
                      />
                    </div>
                    <Card
                      sx={{
                        maxWidth: "70%",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        backgroundColor: Colors.BG_LIGHT_GRAY,
                        boxShadow: "none",
                      }}
                    >
                      <SettlementBounds data={item?.chat} />
                      <p
                        style={{
                          textAlign: "left",
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_SMALL,
                        }}
                      >
                        {formatDateString(item?.updatedAt)}
                      </p>
                    </Card>
                  </Grid>
                </React.Fragment>
              ))}

              {chatHistory?.map((message, index) => (
                <Grid
                  xs={12}
                  key={index}
                  container
                  justifyContent={
                    message.type === "user" ? "flex-end" : "flex-start"
                  }
                  sx={{ marginBottom: "8px" }}
                >
                  {message.type === "bound" && (
                    <div>
                      <Checkbox
                        sx={{
                          "&.Mui-checked": {
                            color: Colors.SKY_BLUE,
                          },
                        }}
                        checked={checkboxStates[`chatHistory_${index}`]}
                        onChange={() =>
                          handleCheckboxChange(
                            `chatHistory_${index}`,
                            message?.text
                          )
                        }
                      />
                    </div>
                  )}
                  <Card
                    sx={{
                      maxWidth: "70%",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      backgroundColor: Colors.BG_LIGHT_GRAY,
                      boxShadow: "none",
                    }}
                  >
                    {message.type === "bound" ? (
                      <div>
                        <SettlementBounds data={message?.text} />
                      </div>
                    ) : (
                      <Typography variant="body1">
                        <ReactMarkdown>{message?.text}</ReactMarkdown>
                      </Typography>
                    )}
                    <p
                      style={{
                        textAlign: "right",
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_SMALL,
                      }}
                    >
                      {formatDateString("now")}
                    </p>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {tableLoading && (
              <Grid xs={12}>
                <LinearProgress sx={{ backgroundColor: Colors.SKY_BLUE }} />
              </Grid>
            )}

            <Grid
              container
              item
              xs={12}
              sx={{
                backgroundColor: Colors.WHITE,
                borderRadius: "10px",
                height: "6vh",
                m: "2rem 0rem",
                alignItems: "center",
                padding: "0 0.5rem",
              }}
            >
              <input
                type="text"
                placeholder="Write Text..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue) {
                    handleClick();
                  }
                }}
                style={{
                  backgroundColor: Colors.WHITE,
                  color: Colors.BLACK,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px 0 0 5px",
                  flex: 1,
                  height: "95%",
                }}
              />
              <IconButton
                onClick={handleClick}
                disabled={!inputValue}
                sx={{
                  backgroundColor: Colors.SKY_BLUE,
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                  width: "40px",
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: Colors.SKY_BLUE,
                    color: Colors.WHITE,
                  },
                }}
              >
                <Send
                  sx={{
                    color: Colors.WHITE,
                    fontSize: "1.5rem",
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}
