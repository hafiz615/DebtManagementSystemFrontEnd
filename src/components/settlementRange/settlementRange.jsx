import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Typography,
  Button,
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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import { Download, Info, PeopleAlt, Send } from "@mui/icons-material";
import TextButton from "../button";
import SettlementCards from "./settlementCards";
import {
  GetSettlementRangeWithScores,
  GetSummary,
  GetLumpSumAmount,
  GetFullProfit,
  UpdateCommission,
  GetCaseSummariesById,
  GetSettlementJustifications,
  GetLumpSumJustifications,
  GetFullProfitSettlement,
  GetPaymentIntervals,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { formatDateString, generatePdfFromApiData } from "../../common";
import MuiModels from "../models";
import CheckboxAutocomplete from "../checkboxAutocomplete";
import { useParams } from "react-router-dom";
import { ErrorOutline } from "@mui/icons-material";
import { isEmpty } from "lodash";
import { getWeeksRemainingMessage } from "../../common";
import DataSummaryTable from "../dataSummaryTable";
import SettlementBounds from "./settlementBounds";

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
  height: "15vh",
  borderRadius: "10px",
  paddingLeft: "2%",
  justifyContent: "center",
  flexDirection: "column",
  gap: "10px",
  mb: { xs: "10px", lg: "0" },
};

const commonTextStyles = {
  fontSize: FONT_SIZE_XL,
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
    <Tooltip title={tooltip} placement="top-start">
      <Typography sx={commonTextStyles}>{title}</Typography>
      <Typography
        sx={{
          ...commonTextStyles,
          color: isNegative(rawValue) ? Colors.ORANGE_COLOR : Colors.SKY_BLUE,
        }}
      >
        {value}
      </Typography>
    </Tooltip>
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

export default function SettlementRange() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { showToast } = useToast();
  const [value, setValue] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [creditorNames, setCreditorNames] = useState([]);
  const [allCreditorNames, setAllCreditorsNames] = useState([]);
  const [creditorSelect, setCreditorSelect] = useState([]);
  const [scores, setScores] = useState(null);
  const [debtor, setDebtor] = useState({});
  const [debtorInfo, setDebtorInfo] = useState({});
  const [lumpSumpData, setLumpSumpData] = useState({});
  const [errorLumpSumMessage, setErrorLumSumtMessage] = useState("");
  const [fullProfit, setFullProfit] = useState({});
  const [errorfullProfitMessage, setErrorFullProfitMessage] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [summaryAmount, setSummaryAmount] = useState({});
  const [justification, setJustification] = useState();
  const [summary, setSummary] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [paymentData, setPaymentData] = useState();
  const [paymentChanged, setPaymentChanged] = useState(false);
  const [allData, setAllData] = useState();
  const [strategyTab, setStrategyTab] = useState(0);
  const [justificationLoading, setJustificationLoading] = useState(false);
  const [justificationValue, setJustificationValue] = useState(
    "justification_gemini"
  );
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const drawerOpen = useSelector((state) => state.drawer.open);
  const { AUTHORITY_TEXT } = UserListPage;
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

  const tabs = ["Strategy 1", "Strategy 2", "Strategy 3"];
  const recommendations = [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3",
  ];
  const strat3Recommendations = ["recommendation 1"];
  const strat2Recommendations = ["lump Sum"];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const currentCreditor = allCreditorNames[tabValue];

  const selectedCreditorDetails = creditorNames?.find(
    (item) => item?.creditorAccountTitle === currentCreditor
  );

  const cardData = {
    0: recommendations?.map((item, index) => (
      <>
        <SettlementCards
          setPaymentChanged={setPaymentChanged}
          remainingAmount={
            allCreditorNames[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.contractDetails?.loan_amount
          }
          caseId={caseId}
          title={item}
          weeksTillPaidTitle={getWeeksRemainingMessage(item)}
          settlementRange={
            apiData?.settlement_range?.[allCreditorNames[parseInt(tabValue)]] ||
            null
          }
          commissionRange={
            apiData?.commission_range?.[allCreditorNames[parseInt(tabValue)]] ||
            null
          }
          newDefaultRiskScore={apiData?.new_default_risk_score || null}
          percentageSettlementOverWeeklyBudget={
            apiData?.percentage_settlement_over_weekly_budget?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyTrueRevenue={
            apiData?.percentage_settlement_over_weekly_true_revenue?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          weeksTillPaid={
            apiData?.weeks_till_paid?.[allCreditorNames[parseInt(tabValue)]] ||
            null
          }
        />
      </>
    )),
    1: strat2Recommendations?.map((item, index) => (
      <>
        {!isEmpty(lumpSumpData) ? (
          <SettlementCards
            setPaymentChanged={setPaymentChanged}
            remainingAmount={
              allCreditorNames[tabValue] === "Summary"
                ? summaryAmount?.loanAmount.toString()
                : selectedCreditorDetails?.contractDetails?.loan_amount
            }
            isLumpSumPayment={true}
            title={item}
            strategy="strategy2"
            weeksTillPaidTitle={
              item === "lump Sum"
                ? "Amount based on Lump Sum Recommendation"
                : ""
            }
            settlementRange={
              lumpSumpData?.lumpsum_settlement?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
            warning={
              lumpSumpData?.warning?.[allCreditorNames[parseInt(tabValue)]] ||
              ""
            }
            caseId={caseId}
          />
        ) : (
          <Grid
            item
            xs={12}
            container
            sx={{
              backgroundColor: Colors.WHITE,
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            {errorLumpSumMessage}
          </Grid>
        )}
      </>
    )),

    2: strat3Recommendations?.map((item, index) => (
      <>
        {!isEmpty(fullProfit) ? (
          <SettlementCards
            setPaymentChanged={setPaymentChanged}
            remainingAmount={
              allCreditorNames[tabValue] === "Summary"
                ? summaryAmount?.loanAmount.toString()
                : selectedCreditorDetails?.contractDetails?.loan_amount
            }
            caseId={caseId}
            isFullPayment={true}
            title={item}
            weeksTillPaidTitle={
              item === "recommendation 1"
                ? "Weeks remaining based on recommendation 1"
                : ""
            }
            settlementRange={
              fullProfit?.settlement_range?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
            commissionRange={
              fullProfit?.commission_range?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
            newDefaultRiskScore={
              fullProfit?.new_default_risk_score || {
                "recommendation 1": ["-", "-"],
              }
            }
            percentageSettlementOverWeeklyBudget={
              fullProfit?.percentage_settlement_over_weekly_budget?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
            percentageSettlementOverWeeklyTrueRevenue={
              fullProfit?.percentage_settlement_over_weekly_true_revenue?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
            weeksTillPaid={
              fullProfit?.weeks_till_paid?.[
                allCreditorNames[parseInt(tabValue)]
              ] || null
            }
          />
        ) : (
          <Grid
            item
            xs={12}
            container
            sx={{
              backgroundColor: Colors.WHITE,
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            {errorfullProfitMessage}
          </Grid>
        )}
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
      setLoading(true);
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
          setLoading(false);
          if (typeof resCommission?.data?.data?.getScores === "string") {
            setScores({ message: resCommission?.data?.data?.getScores });
            showToast(
              resCommission?.data?.data?.getScores + " Couldn't fetch scores",
              "error"
            );
          } else {
            setScores(resCommission?.data?.data?.getScores);
          }
          setSummaryAmount(
            resCommission?.data?.data?.creditorsContractDetailsSum
          );
          setAllData(resCommission?.data?.data);

          setDebtor(resCommission?.data?.data?.debtor?.basicInformation);
          setDebtorInfo(resCommission?.data?.data?.debtor?.businessInformation);
          setApiData(resCommission?.data?.data?.settlementRange);
          setCommissionPercentage(
            resCommission?.data?.data?.debtor?.commissionPercentage
          );

          const allCreditors = resCommission?.data?.data?.creditors;
          setCreditorNames(allCreditors);
          const creditorAccountTitles = allCreditors?.map(
            (item) => item.creditorAccountTitle
          );
          if (!isEmpty(creditorAccountTitles)) {
            creditorAccountTitles.push("Summary");
          }
          setAllCreditorsNames(creditorAccountTitles);
          showToast(resCommission?.data?.message, "success");
          getLumpSumAmountData();
          getFullProfitData();
        } else if (
          resCommission?.response?.status === 401 ||
          resCommission?.response?.status === 403
        ) {
          localStorage.clear();
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMessage(err);
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
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

  const handleGeneratePdf = () => {
    const credDetail =
      allCreditorNames[tabValue] === "Summary"
        ? "Summary"
        : selectedCreditorDetails?.name;

    const summaryPayable = summaryAmount?.payableAmount;

    generatePdfFromApiData(
      selectedCreditorDetails,
      credDetail,
      debtorInfo,
      summaryPayable
    );
  };

  const getAllRanges = async (creditors, status) => {
    setLoading(true);
    try {
      if (caseId) {
        const settlementRangeData = await GetSettlementRangeWithScores(
          creditors,
          caseId,
          status
        );
        if (settlementRangeData?.status === 200) {
          setLoading(false);
          if (typeof settlementRangeData?.data?.data?.getScores === "string") {
            setScores({ message: settlementRangeData?.data?.data?.getScores });
            showToast(
              settlementRangeData?.data?.data?.getScores +
                " Couldn't fetch scores",
              "error"
            );
          } else {
            setScores(settlementRangeData?.data?.data?.getScores);
          }
          setAllData(settlementRangeData?.data?.data);
          setDebtor(settlementRangeData?.data?.data?.debtor?.basicInformation);
          setDebtorInfo(
            settlementRangeData?.data?.data?.debtor?.businessInformation
          );
          setApiData(settlementRangeData?.data?.data?.settlementRange);
          setCommissionPercentage(
            settlementRangeData?.data?.data?.debtor?.commissionPercentage
          );
          setSummaryAmount(
            settlementRangeData?.data?.data?.creditorsContractDetailsSum
          );

          const allCreditors = settlementRangeData?.data?.data?.creditors;
          setCreditorNames(allCreditors);
          const creditorAccountTitles = allCreditors?.map(
            (item) => item.creditorAccountTitle
          );
          if (!isEmpty(creditorAccountTitles)) {
            creditorAccountTitles.push("Summary");
          }
          setAllCreditorsNames(creditorAccountTitles);
          showToast(settlementRangeData?.data?.message, "success");

          getLumpSumAmountData();
          getFullProfitData();
        } else if (
          settlementRangeData?.response?.status === 401 ||
          settlementRangeData?.response?.status === 403
        ) {
          localStorage.clear();
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMessage(err);
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
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

  const getLumpSumAmountData = async () => {
    if (caseId) {
      const GetLumpSumDataRes = await GetLumpSumAmount(caseId);

      if (GetLumpSumDataRes?.status === 200) {
        setLumpSumpData(GetLumpSumDataRes?.data?.data);
      } else {
        const errorMessage = GetLumpSumDataRes?.response?.data?.message;
        setErrorLumSumtMessage(errorMessage);
        showToast(errorMessage, "error");
      }
    }
  };

  const getFullProfitData = async () => {
    if (caseId) {
      const GetFullProfitDataRes = await GetFullProfit(caseId);
      if (GetFullProfitDataRes?.status === 200) {
        setFullProfit(GetFullProfitDataRes?.data?.data);
      } else {
        const errorMessage = GetFullProfitDataRes?.response?.data?.message;
        setErrorFullProfitMessage(errorMessage);
        showToast(errorMessage, "error");
      }
    }
  };

  const getAllJustifications = async (activeStrategy) => {
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
  };

  useEffect(() => {
    getIntervals();
  }, [paymentChanged]);

  useEffect(() => {
    getAllRanges([], false);
    getAllSummary();
  }, []);

  useEffect(() => {
    getAllJustifications(strategyTab);
  }, [strategyTab]);

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

  if (errorMessage) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={Colors.BG_LIGHT_GRAY} // Adjust to your color scheme
      >
        <Grid item textAlign="center">
          <ErrorOutline sx={{ fontSize: 80, color: Colors.RED }} />{" "}
          <Typography variant="h4" color={Colors.DARK_GRAY} gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" color={Colors.DARK_GRAY} gutterBottom>
            {errorMessage || "An unexpected error occurred."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate(`/home`);
            }}
          >
            Go to Home Page
          </Button>
        </Grid>
      </Grid>
    );
  }

  const creditorDetails = [
    {
      label: "Loan Amount",
      value: selectedCreditorDetails?.contractDetails?.loan_amount,
      formatCurrency: true,
    },
    {
      label: "Payable Amount",
      value: selectedCreditorDetails?.contractDetails?.payable_amount,
      formatCurrency: true,
    },
    {
      label: "Weekly Budget",
      value: (() => {
        const weeklyBudget =
          apiData?.weekly_budget?.[allCreditorNames[parseInt(tabValue)]];
        return weeklyBudget != null
          ? `$${new Intl.NumberFormat().format(weeklyBudget)}`
          : "--";
      })(),
      formatCurrency: false,
    },
    {
      label: "Purchased Percentage",
      value: selectedCreditorDetails?.contractDetails?.purchased_percentage,
    },
    {
      label: "Repayment Amount",
      value: selectedCreditorDetails?.contractDetails?.repayment_amount,
    },
  ];

  const headerData = [
    { key: "creditorName", heading: "Creditors", width: "15%" },
    { key: "loanAmount", heading: "Loan Amount", width: "15%" },
    { key: "payableAmount", heading: "Payable Amount", width: "15%" },
    { key: "weeklyBudget", heading: "Weekly Budget", width: "15%" },
    {
      key: "purchased_percentage",
      heading: "Purchased Percentage",
      width: "15%",
    },
    {
      key: "repayment_amount",
      heading: "Repayment Amount",
      width: "15%",
    },
  ];

  const formatSummaryCurrency = (value) => {
    if (value === "--" || typeof value !== "string") return value;
    return !value.startsWith("$") ? `$${value}` : value;
  };

  const formatSummary = (value) => {
    if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    if (typeof value === "string" && !value.includes("$")) {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    return value || "--";
  };

  const creditorNamesDetails = creditorNames?.map((creditor) => {
    const weeklyBudget =
      apiData?.weekly_budget?.[
        creditor?.accountTitleMapping[0]?.accountTitle
      ] != null
        ? `$${new Intl.NumberFormat().format(
            apiData?.weekly_budget?.[
              creditor?.accountTitleMapping[0]?.accountTitle
            ]
          )}`
        : "--";
    const loanAmount = formatSummaryCurrency(
      creditor?.contractDetails?.loan_amount || "--"
    );
    const payableAmount = formatSummaryCurrency(
      creditor?.contractDetails?.payable_amount || "--"
    );
    const purchased_percentage =
      creditor?.contractDetails?.purchased_percentage || "--";
    const repayment_amount =
      creditor?.contractDetails?.repayment_amount || "--";

    return {
      creditorName: creditor?.accountTitleMapping[0]?.accountTitle,
      loanAmount,
      payableAmount,
      weeklyBudget,
      purchased_percentage,
      repayment_amount,
    };
  });

  const summaryDetails = {
    creditorName: "Summary",
    loanAmount: formatSummary(summaryAmount?.loanAmount),
    payableAmount: formatSummary(summaryAmount?.payableAmount),
    weeklyBudget: formatSummary(apiData?.weekly_budget?.Summary),
    purchased_percentage: "--",
    repayment_amount: "--",
  };

  const updatedCreditorNamesDetails = [...creditorNamesDetails, summaryDetails];
  const filteredData = updatedCreditorNamesDetails.filter(
    (item) => item.creditorName !== "Summary"
  );

  const isAnyChecked = Object.values(checkboxStates).some((checked) => checked);

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0rem 2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          marginTop: "1.5rem",
        }}
      >
        <Grid item xs={12} lg={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => handleUpdate(true)}>
              <RefreshIcon sx={{ color: Colors.SKY_BLUE, fontSize: "2rem" }} />
            </IconButton>
            <Typography
              sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
            >
              Reload Settlement Range
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "500",
              color: Colors.DARK_GRAY,
            }}
          >
            {AUTHORITY_TEXT} <span>{role}</span>
          </Typography>
        </Grid>
      </Grid>
      {loading ? (
        <Grid
          container
          sx={{
            height: "inherit",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={100} />
        </Grid>
      ) : (
        <>
          <Grid
            container
            item
            xs={12}
            sx={{
              marginTop: "1.5rem",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "2rem",
                fontFamily: "Nunito",
                color: Colors.BLACK,
              }}
            >
              Settlement Range
            </Typography>

            <div style={{ display: "flex", gap: "10px" }}>
              <MuiModels
                show="downloadPDF"
                buttonName="downloadPDF"
                maxHeight="85vh"
                allData={allData}
                lumpSumpData={lumpSumpData}
                fullProfit={fullProfit}
                disabled={!apiData}
              />

              <MuiModels
                show="sendEmail"
                creditorInfo={
                  allCreditorNames[tabValue] === "Summary"
                    ? "Summary"
                    : selectedCreditorDetails?.name
                }
                debtorInfo={debtorInfo}
                payableAmount={
                  allCreditorNames[tabValue] === "Summary"
                    ? summaryAmount?.payableAmount
                    : selectedCreditorDetails?.contractDetails?.payable_amount
                }
                data={apiData}
                selectedCreditor={allCreditorNames[tabValue]}
                lumpSump={lumpSumpData}
                fullProfit={fullProfit}
                caseId={caseId}
                paymentData={paymentData}
              />
              <TextButton
                disabled={!apiData}
                buttonText={"Download"}
                boxShadow="none"
                height={"2.5rem"}
                width={extraSmallScreen ? "2rem" : "8rem"}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                fontColor={Colors.BLACK}
                hoverColor={Colors.BG_LIGHT_GRAY}
                border={`1px solid ${Colors.SKY_BLUE}`}
                borderRadius="5px"
                startIcon={
                  extraSmallScreen ? null : (
                    <Download
                      sx={{
                        color: apiData ? Colors.BLACK : Colors.DIM_LIGHT_GRAY,
                      }}
                    />
                  )
                }
                onClick={handleGeneratePdf}
              />
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
                  options={creditorNameWithId}
                  multiSelect={creditorSelect}
                  setMultiselect={setCreditorSelect}
                  placeholder="Creditors"
                  width="10rem"
                  update={true}
                  handleUpdate={handleUpdate}
                />
              </div>
            </div>
          </Grid>
          <Grid
            container
            item
            xs={12}
            lg={8}
            sx={{ justifyContent: { xs: "left", md: "space-between" } }}
          >
            {Object?.keys(debtor)?.map((key) => (
              <Grid item xs={12} lg={6} key={key}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "space-between", md: "unset" },
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "600",
                      color: Colors.DARK_GRAY,
                      width: "10rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {key?.charAt(0)?.toUpperCase() + key?.slice(1)}
                  </div>

                  <Tooltip title={debtor[key]?.toString()} placement="top-end">
                    <span
                      style={{
                        fontFamily: "Nunito",
                        fontWeight: "300",
                        fontSize: "0.9rem",
                        color: Colors.DIM_LIGHT_GRAY,
                        marginTop: "0.5rem",
                      }}
                    >
                      {allData?.debtor?.weeklyBudgetUpdated &&
                      key === "weeklyBudget"
                        ? `$${debtor[key]} (Calculated)`
                        : key === "weeklyBudget"
                        ? `$${debtor[key]}`
                        : `${debtor[key]?.toString().slice(0, 15)}${
                            debtor[key]?.toString().length > 15 ? "..." : ""
                          }`}
                    </span>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
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
              min={0}
              max={100}
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
              disabled={!commissionPercentage || commissionPercentage < 20}
            />
          </Grid>

          <Grid container item xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            <GridItem
              key="Weekly Profit"
              title="Weekly Profit"
              tooltip="Weekly Profit With Payment"
              value={
                apiData?.weekly_profit
                  ? `$ ${new Intl.NumberFormat().format(apiData.weekly_profit)}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_profit}
            />

            <GridItem
              key="Weekly True Revenue"
              title="Weekly True Revenue"
              value={
                apiData?.weekly_true_revenue
                  ? `$ ${new Intl.NumberFormat().format(
                      apiData?.weekly_true_revenue
                    )}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_true_revenue}
            />
            <GridItem
              key="Profitability"
              title="Profitability"
              value={
                apiData?.profitability
                  ? `${new Intl.NumberFormat().format(
                      apiData?.profitability
                    )} %`
                  : "No Data"
              }
              rawValue={apiData?.profitability}
            />
            {scores?.Scores && (
              <>
                <GridItem
                  key="UCC Score"
                  title="UCC Score"
                  value={scores?.Scores?.["UCC Score"] ?? "No Data"}
                  rawValue={scores?.Scores?.["UCC Score"]}
                />
                <GridItem
                  key="Default Risk Score"
                  title="Default Risk Score"
                  value={scores?.Scores?.["Default Risk Score"] ?? "No Data"}
                  rawValue={scores?.Scores?.["Default Risk Score"]}
                />
              </>
            )}
          </Grid>

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
              {allCreditorNames[tabValue] === "Summary"
                ? "Summary Contract Information"
                : "Creditors Contract Information"}
            </Typography>
            {selectedCreditorDetails &&
              selectedCreditorDetails?.contractDetails && (
                <>
                  <Grid container item xs={12} sx={{ gap: "1rem", mt: "1rem" }}>
                    {creditorDetails?.map((detail, index) => {
                      const formattedValue = detail?.value
                        ? detail?.formatCurrency &&
                          !detail?.value?.includes("$")
                          ? `$${detail?.value}`
                          : detail?.value
                        : "--";

                      return (
                        <Tooltip
                          title={
                            detail?.label === "Weekly Budget"
                              ? "Weekly Profit without Payment"
                              : ""
                          }
                          placement="top-start"
                        >
                          <Grid
                            key={index}
                            item
                            xs={12}
                            sm={5.8}
                            md={3.8}
                            lg={2.8}
                            container
                            sx={commonStyles}
                          >
                            <Typography sx={commonTextStyles}>
                              {detail?.label}
                            </Typography>
                            <Typography
                              sx={{
                                ...commonTextStyles,
                                color: Colors.SKY_BLUE,
                              }}
                            >
                              {formattedValue}
                            </Typography>
                          </Grid>
                        </Tooltip>
                      );
                    })}
                  </Grid>
                </>
              )}

            {allCreditorNames[tabValue] === "Summary" && (
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

            {apiData?.warnings?.[allCreditorNames[tabValue]] && (
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
                  {apiData?.warnings?.[allCreditorNames[tabValue]]}
                </Typography>
              </Grid>
            )}
          </Grid>
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
          <Grid container item xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            {scores?.message && (
              <GridItemMessage
                key="No Score Reason"
                title="No Score Reason"
                value={scores?.message}
                rawValue={scores?.message}
              />
            )}
          </Grid>

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
              <MuiModels
                show="sendEmailJustification"
                disabled={!isAnyChecked}
                data={selectedData}
                caseId={caseId}
              />
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
                    checked={checkboxStates["justification"]}
                    onChange={() =>
                      handleCheckboxChange(
                        "justification",
                        justification?.[justificationValue]?.[
                          allCreditorNames[tabValue]
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
                    <CircularProgress size={20} />
                  ) : (
                    <Typography variant="body1">
                      <ReactMarkdown>
                        {justification?.[justificationValue]?.[
                          allCreditorNames[tabValue]
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
                <LinearProgress />
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
