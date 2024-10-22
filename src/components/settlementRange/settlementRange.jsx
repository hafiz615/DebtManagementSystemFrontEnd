import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

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
import { PieChart } from "@mui/x-charts";

import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
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
import {
  formatDateString,
  formatPurchasedPercentage,
  generatePdfFromApiData,
} from "../../common";
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
  paddingLeft: "1%",
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
        color: isNegative(rawValue) ? Colors.ORANGE_COLOR : Colors.SKY_BLUE,
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

export default function SettlementRange() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { showToast } = useToast();
  const [value, setValue] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const [optionValue, setOptuonValue] = useState(0);
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

  const debtorCompanyName = allData?.debtor?.businessInformation?.companyName;
  const popUpDebtorData = allData?.debtor;
  const [strategyTab, setStrategyTab] = useState(0);
  const [optionStats, setOptionStats] = useState();
  const [justificationLoading, setJustificationLoading] = useState(false);
  const [colorScheme] = useState("Tableau10");
  const [justificationValue, setJustificationValue] = useState(
    "justification_gemini"
  );
  const [selectedOption, setSelectedOption] = useState("percentageReceivable");
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

  const tabs = ["Max Profit", "Lump Sum", "Percentage Recievable"];
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
  const currentCreditor = allCreditorNames[tabValue];

  const selectedCreditorDetails = creditorNames?.find(
    (item) => item?.creditorAccountTitle === currentCreditor
  );

  const cardData = {
    0: recommendations?.map((item, index) => (
      <>
        <SettlementCards
          strategy="strategy1"
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
        {/* {!isEmpty(fullProfit) ? ( */}
        <SettlementCards
          tabValue={tabValue}
          allCreditorNames={allCreditorNames}
          strategy="strategy3"
          setPaymentChanged={setPaymentChanged}
          remainingAmount={
            allCreditorNames[tabValue] === "Summary"
              ? summaryAmount?.loanAmount.toString()
              : selectedCreditorDetails?.contractDetails?.loan_amount
          }
          caseId={caseId}
          isFullPayment={true}
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
        />
        {/* ) : ( */}
        {/* <Grid
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
          </Grid> */}
        {/* )} */}
      </>
    )),
    4: recommendations?.map((item, index) => (
      <>
        <SettlementCards
          strategy="strategy1"
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
            optionStats?.settlement_range?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          commissionRange={
            optionStats?.commission_range?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyBudget={
            optionStats?.percentage_settlement_over_weekly_budget?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          percentageSettlementOverWeeklyTrueRevenue={
            optionStats?.percentage_settlement_over_weekly_true_revenue?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          weeksTillPaid={
            optionStats?.weeks_till_paid?.[
              allCreditorNames[parseInt(tabValue)]
            ] || null
          }
          optionValue={true}
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
          setOptionStats(
            resCommission?.data?.data?.settlementRange?.option_2_stats
          );
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
          setOptionStats(
            settlementRangeData?.data?.data?.settlementRange?.option_2_stats
          );
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
      label: "Purchase Price",
      value: `${selectedCreditorDetails?.contractDetails?.loan_amount}` || "--",
      formatCurrency: true,
    },
    {
      label: "Net Funded Amount",
      value: selectedCreditorDetails?.contractDetails?.funded_amount || "--",
      formatCurrency: true,
    },

    {
      label: "Purchased Amount",
      value: selectedCreditorDetails?.contractDetails?.payable_amount || "--",
      formatCurrency: true,
    },
    {
      label: "Current Balance",
      value:
        selectedCreditorDetails?.totalDebt -
          selectedCreditorDetails?.remainingAmountPaid || "--",
      formatCurrency: true,
    },
    {
      label: "Break Even",
      value: selectedCreditorDetails?.breakEven || "--",
      formatCurrency: true,
    },
    {
      label: "Purchased Percentage",
      value: formatPurchasedPercentage(
        selectedCreditorDetails?.contractDetails?.purchased_percentage
      ),
    },
    {
      label: "Current Payment Amount",

      value: selectedCreditorDetails?.contractDetails?.repayment_amount
        ? `$${selectedCreditorDetails?.contractDetails?.repayment_amount?.replace(
            /[$,]/g,
            ""
          )}`
        : "--",
    },
  ];

  const creditorNamesDetails = creditorNames?.map((creditor) => {
    const cleanLoanAmount = creditor?.contractDetails?.loan_amount
      ? creditor?.contractDetails?.loan_amount?.replace(/[$,]/g, "")
      : "--";

    const purchasePrice =
      cleanLoanAmount !== "--" && !isNaN(Number(cleanLoanAmount))
        ? `$${Number(cleanLoanAmount)?.toFixed(2)}`
        : "--";

    const cleanFundedAmount = creditor?.contractDetails?.funded_amount
      ? creditor?.contractDetails?.funded_amount?.replace(/[$,]/g, "")
      : "--";

    const fundedAmount =
      cleanFundedAmount !== "--" && !isNaN(Number(cleanFundedAmount))
        ? `$${Number(cleanFundedAmount)?.toFixed(2)}`
        : "--";

    const cleanPayableAmount = creditor?.contractDetails?.payable_amount
      ? creditor?.contractDetails?.payable_amount.replace(/[$,]/g, "")
      : "--";

    const paybackAmount =
      cleanPayableAmount !== "--" && !isNaN(Number(cleanPayableAmount))
        ? `$${Number(cleanPayableAmount).toFixed(2)}`
        : "--";

    const payableAmount =
      creditor?.totalDebt !== undefined &&
      creditor?.remainingAmountPaid !== undefined
        ? isNaN(
            Number(creditor?.totalDebt) - Number(creditor?.remainingAmountPaid)
          )
          ? "--"
          : `$${(
              Number(creditor?.totalDebt) -
              Number(creditor?.remainingAmountPaid)
            ).toFixed(2)}`
        : "--";

    const breakEvenPoint = creditor?.breakEven
      ? isNaN(parseFloat(creditor?.breakEven))
        ? "--"
        : `$${parseFloat(creditor?.breakEven).toFixed(2)}`
      : "--";

    const purchased_percentage = formatPurchasedPercentage(
      creditor?.contractDetails?.purchased_percentage || "--"
    );

    const repayment_amount = creditor?.contractDetails?.repayment_amount
      ? `$${creditor?.contractDetails?.repayment_amount.replace(/[$,]/g, "")}`
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
    { key: "paybackAmount", heading: "Purchased Amount ", width: "11%" },
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
  const summaryDetails = {
    creditorName: "Summary",

    purchasePrice:
      creditorNames?.reduce((total, creditor) => {
        const purchasePrice = parseCurrency(
          creditor?.contractDetails?.loan_amount || "0"
        );
        return total + Number(purchasePrice);
      }, 0) > 0
        ? `$${creditorNames
            ?.reduce((total, creditor) => {
              const purchasePrice = parseCurrency(
                creditor?.contractDetails?.loan_amount || "0"
              );
              return total + Number(purchasePrice);
            }, 0)
            ?.toFixed(2)}`
        : "--",

    fundedAmount:
      creditorNames?.reduce((total, creditor) => {
        const cleanedAmount = creditor?.contractDetails?.funded_amount
          ? Number(
              creditor?.contractDetails?.funded_amount?.replace(/[$,]/g, "")
            )
          : 0;
        return total + cleanedAmount;
      }, 0) > 0
        ? `$${creditorNames
            ?.reduce((total, creditor) => {
              const cleanedAmount = creditor?.contractDetails?.funded_amount
                ? Number(
                    creditor?.contractDetails?.funded_amount?.replace(
                      /[$,]/g,
                      ""
                    )
                  )
                : 0;
              return total + cleanedAmount;
            }, 0)
            ?.toFixed(2)}`
        : "--",

    paybackAmount:
      totalPayableAmount > 0
        ? `$${Number(totalPayableAmount)?.toFixed(2)}`
        : "--",

    payableAmount:
      creditorNames?.reduce((total, creditor) => {
        return (
          total +
          (Number(creditor?.totalDebt || 0) -
            Number(creditor?.remainingAmountPaid || 0))
        );
      }, 0) > 0
        ? `$${creditorNames
            ?.reduce((total, creditor) => {
              return (
                total +
                (Number(creditor?.totalDebt || 0) -
                  Number(creditor?.remainingAmountPaid || 0))
              );
            }, 0)
            ?.toFixed(2)}`
        : "--",

    breakEvenPoint:
      creditorNames?.reduce((total, creditor) => {
        return total + Number(creditor?.breakEven || 0);
      }, 0) > 0
        ? `$${creditorNames
            ?.reduce((total, creditor) => {
              return total + Number(creditor?.breakEven || 0);
            }, 0)
            ?.toFixed(2)}`
        : "--",

    purchased_percentage: "--",
    repayment_amount: "--",
  };

  const updatedCreditorNamesDetails = [...creditorNamesDetails, summaryDetails];
  const filteredData = updatedCreditorNamesDetails?.filter(
    (item) => item.creditorName !== "Summary"
  );

  const isAnyChecked = Object.values(checkboxStates).some((checked) => checked);

  const countData =
    scores &&
    scores?.Scores?.top_payees?.map((item, i) => {
      const label = Object.keys(item)[0];
      const value = Object.values(item)[0];
      return {
        id: i,
        value: value,
        label: label,
      };
    });

  const formatCurrencyValue = (value) => {
    if (value === null || value === undefined) return "--";

    // Convert to string if the value is a number
    const valueStr = typeof value === "number" ? value?.toString() : value;

    // Remove any unwanted characters, but keep numeric values
    const cleanedValue = valueStr?.replace(/[^0-9.-]/g, "");

    // Check if cleanedValue is a valid number
    const numericValue = parseFloat(cleanedValue);
    if (!isNaN(numericValue)) {
      return `$${numericValue?.toFixed(2)}`; // Format to two decimal places
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
          <CircularProgress size={100} sx={{ color: Colors.SKY_BLUE }} />
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
                fontSize: "1.5rem",
                fontFamily: "Nunito",
                color: Colors.BLACK,
              }}
            >
              {`${debtorCompanyName} - Settlement Range`}
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
            {Object?.keys(debtor)?.map((key) => {
              // Replace "weeklyBudget" with "monthlyBudget"
              const displayKey = key === "weeklyBudget" ? "monthlyBudget" : key;

              return (
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
                      {displayKey?.charAt(0)?.toUpperCase() +
                        displayKey?.slice(1)}
                    </div>

                    <Tooltip
                      title={debtor[key]?.toString()}
                      placement="top-end"
                    >
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
                          ? `$${parseFloat(debtor[key]).toFixed(2)}`
                          : key === "weeklyBudget"
                          ? `$${parseFloat(debtor[key]).toFixed(2)}`
                          : `${debtor[key]?.toString().slice(0, 15)}${
                              debtor[key]?.toString().length > 15 ? "..." : ""
                            }` || "--"}
                      </span>
                    </Tooltip>
                  </Box>
                </Grid>
              );
            })}
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

          <Grid container item xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            <GridItem
              key="Weekly Profit"
              title="Monthly Profit With Payments"
              tooltip="Your net profit after making debt payments."
              value={
                apiData?.true_profit
                  ? `$ ${new Intl.NumberFormat().format(apiData?.true_profit)}`
                  : "No Data"
              }
              rawValue={apiData?.true_profit}
            />

            <GridItem
              key="Weekly True Revenue"
              title="Monthly True Revenue"
              tooltip="Total revenue earned by the business each monthly."
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
              title="Profitability with Payments"
              tooltip=" Measure of how much profit your business makes after expenses."
              value={
                apiData?.profitability
                  ? `${new Intl.NumberFormat().format(
                      apiData?.profitability
                    )} %`
                  : "No Data"
              }
              rawValue={apiData?.profitability}
            />
            <GridItem
              key="Monthly Profit Without Payments"
              title="Monthly Profit Without Payments"
              tooltip="Your net profit after making debt payments."
              value={
                apiData?.weekly_profit
                  ? `$ ${new Intl.NumberFormat().format(
                      apiData?.weekly_profit
                    )}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_profit}
            />
            <GridItem
              key="Profitability Without Payments"
              title="Profitability without payments"
              tooltip=" Measure of how much profit your business makes after expenses."
              value={
                apiData?.profitability_without_creditor_payments
                  ? `${new Intl.NumberFormat().format(
                      apiData?.profitability_without_creditor_payments
                    )} %`
                  : "No Data"
              }
              rawValue={apiData?.profitability_without_creditor_payments}
            />

            {strategyTab === 2 && (
              <GridItem
                key="percentageReceivableCommission"
                title="Receivable Commission"
                tooltip="Receivable Commission"
                value={
                  allData?.percentageReceivableCommission !== undefined
                    ? `${allData.percentageReceivableCommission}%`
                    : "--"
                }
                rawValue={scores?.Scores?.["Default Risk Score"]}
              />
            )}

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

                <Grid
                  container
                  item
                  xs={5}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    backgroundColor: Colors.WHITE,
                    borderRadius: "10px",
                    height: "30vh",
                    marginBottom: "0.5rem",
                  }}
                >
                  {countData ? (
                    <>
                      <div
                        style={{
                          width: "40%",
                          height: "100%",
                        }}
                      >
                        <PieChart
                          series={[
                            {
                              data: countData,
                              cx: 100,
                              cy: 100,
                              highlightScope: {
                                faded: "global",
                                highlighted: "item",
                              },
                            },
                          ]}
                          colors={categories[colorScheme]}
                          slotProps={{
                            legend: { hidden: true },
                          }}
                          width={250}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "1em",
                          height: "80%",
                          width: "40%",
                          overflowY: "scroll !important",
                          borderRadius: "15px",
                          backgroundColor: Colors.BG_LIGHT_GRAY,
                        }}
                      >
                        <Grid
                          sx={{
                            overflowY: "auto",
                            ...ScrollbarStyles,
                          }}
                        >
                          {countData?.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
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
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px",
                                  }}
                                >
                                  {`${item?.label?.substring(0, 15)}${
                                    item?.label?.length > 10 ? "..." : ""
                                  }`}
                                </span>
                              </Tooltip>
                            </div>
                          ))}
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
                  label="Negotiation manager Weekly budget"
                />
                <AntTab
                  sx={{
                    bgcolor: Colors.WHITE,
                    width: "max-content",
                    fontWeight: "600",
                    height: "3.5rem",
                  }}
                  label="Weekly budget as per Bank statement"
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
              {allCreditorNames[tabValue] === "Summary"
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

                      // Use the formatCurrencyValue function to format detail.value
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
                        "Purchased Amount":
                          " This is the amount of Receivables.",
                        "Break Even":
                          "1.2x of Net Funded Amount Minus Amount Paid Back.",
                        "Current Balance":
                          "The remaining amount you owe to the creditor.",
                        "Weekly Budget":
                          "Your profit before making any debt payments.",
                        "Purchased Percentage":
                          "The percentage of the loan amount that has been repaid.",
                        "Current Payment Amount":
                          "The initial amount borrowed before any repayments.",
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
                            }}
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
                    <CircularProgress
                      size={20}
                      sx={{ color: Colors.SKY_BLUE }}
                    />
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
