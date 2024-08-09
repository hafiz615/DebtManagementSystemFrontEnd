import React, { useEffect, useState } from "react";
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
  Paper,
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
import { Download, PeopleAlt, Send, WifiFind } from "@mui/icons-material";
import TextButton from "../button";
import SettlementCards from "./settlementCards";
import {
  GetSettlementRangeWithScores,
  GetScores,
  GetSettlementRange,
  GetSummary,
  GetLumpSumAmount,
  GetFullProfit,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { generatePdfFromApiData } from "../../common";
import MuiModels from "../models";
import CheckboxAutocomplete from "../checkboxAutocomplete";
import { useParams } from "react-router-dom";
import { ErrorOutline } from "@mui/icons-material";
import { isEmpty } from "lodash";
import CaseCustomField from "../caseCustomField";
import LumpsumpCard from "./lumpsumpCard";
import FullProfitCard from "./fullProfitCard";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const dummyData = [
  { id: 1, sender: "bot", message: "Hello! How can I help you today?" },
  {
    id: 2,
    sender: "user",
    message: " Sure! We offer a variety ",
  },
  {
    id: 3,
    sender: "bot",
    message: "Sure! We offer a variety of services including...",
  },
];

const ScrollbarStyles1 = {
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "10px",
    border: "3px solid #f1f1f1",
  },
};

const Colors1 = {
  WHITE: "#ffffff",
  LIGHT_GREY: "#f1f1f1",
  BOT_MESSAGE_BG: "#e1f5fe",
  USER_MESSAGE_BG: "#c8e6c9",
};

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
const isNegative = (number) => {
  return number < 0;
};
const GridItem = ({ title, value, rawValue }) => (
  <Grid item xs={12} sm={5.8} md={3.8} lg={2.8} container sx={commonStyles}>
    <Typography sx={commonTextStyles}>{title}</Typography>
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
  const [justificationValue, setJustificationValue] = useState(
    "justification_gemini"
  );

  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [creditorNames, setCreditorNames] = useState([]);
  const [allCreditorNames, setAllCreditorsNames] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [creditorSelect, setCreditorSelect] = useState([]);
  const [scores, setScores] = useState(null);
  const [debtor, setDebtor] = useState({});
  const [debtorId, setDebtorId] = useState("");
  const [lumpSumpData, setLumpSumpData] = useState({});

  const [fullProfit, setFullProfit] = useState({});

  const [justifications, setJustifications] = useState({
    justification_claude: "",
    justification_gemini: "",
    justification_gpt4_o: "",
    justification_llama: "",
  });

  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const drawerOpen = useSelector((state) => state.drawer.open);
  const { AUTHORITY_TEXT } = UserListPage;
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );

  const [messages, setMessages] = useState([]);

  const [strategyTab, setStrategyTab] = useState(0);

  // const [strategyTabVal, setStrategyTabVal] = useState(0);
  const handleStrategyChange = (event, newValue) => {
    setStrategyTab(newValue);
    setValue(0);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMessages(dummyData);
      setTableLoading(false);
    }, 2000);
  }, []);

  const GetLumpSumAmountData = async () => {
    if (debtorId) {
      const GetLumpSumDataRes = await GetLumpSumAmount(debtorId);

      if (GetLumpSumDataRes?.status === 200) {
        setLumpSumpData(GetLumpSumDataRes?.data?.data);
      } else {
        const errorMessage = GetLumpSumDataRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
  };
  const GetFullProfitData = async () => {
    if (debtorId) {
      const GetFullProfitDataRes = await GetFullProfit(debtorId);
      if (GetFullProfitDataRes?.status === 200) {
        setFullProfit(GetFullProfitDataRes?.data?.data);
      } else {
        const errorMessage = GetFullProfitDataRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
  };
  useEffect(() => {
    GetLumpSumAmountData();
    GetFullProfitData();
  }, [debtorId]);
  const tabs = ["Strategy 1", "Strategy 2", "Strategy 3"];
  const recommendations = [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3",
  ];
  const strat2Recommendatons = ["recommendation 1"];
  const strat3Recommendations = ["recommendation 1"];

  const cardStyles = {
    backgroundColor: Colors.WHITE,
    borderRadius: "10px",
    flexDirection: "column",
    gap: "10px",
    mb: "1rem",
    pb: "1.2rem",
  };
  const commTextStyles = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    fontWeight: "700",
  };

  const textStyles = {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: "Nunito",
    color: Colors.DARK_GRAY,
  };

  const lineStyle = {
    width: "100%",
    height: "1px",
    backgroundColor: "#EAEBEB",
    margin: "8px 0",
  };
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
      // <Grid item lg={12} key={index}>
      <>
        <SettlementCards
          remainingAmount={
            selectedCreditorDetails?.contractDetails?.loan_amount
          }
          caseId={caseId}
          title={item}
          weeksTillPaidTitle={
            item === "recommendation 1"
              ? "Weeks remaining based on recommendation 1"
              : item === "recommendation 2"
              ? "Weeks remaining based on recommendation 2"
              : item === "recommendation 3"
              ? "Weeks remaining based on recommendation 3"
              : ""
          }
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
    1: (
      <>
        <LumpsumpCard lumpSumpData={lumpSumpData} />
      </>
    ),

    2: strat3Recommendations?.map((item, index) => (
      <>
        {!isEmpty(fullProfit) && (
          <SettlementCards
            remainingAmount={
              selectedCreditorDetails?.contractDetails?.loan_amount
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
    setTableLoading(true);
    const payload = {
      financialHealthSummary: "",
      humanInput: inputValue,
    };
    setInputValue("");
    const resSummary = await GetSummary(payload, caseId);
    if (resSummary?.status === 200) {
      setTableLoading(false);
      const resRanges = await GetSettlementRange("", caseId);
      if (resRanges?.status === 200) {
        showToast(resRanges?.data?.message, "success");
        setJustifications({
          justifications1:
            resRanges?.data?.data?.justifications?.justification_gemini ?? "",
          justifications2:
            resRanges?.data?.data?.justifications?.justification_gpt4_o ?? "",
          justifications3:
            resRanges?.data?.data?.justifications?.justification_llama ?? "",
          justifications4:
            resRanges?.data?.data?.justifications?.justification_claude ?? "",
        });
      }
    } else if (
      resSummary?.response?.status === 401 ||
      resSummary?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
  };

  const GetAllRanges = async (creditors, status) => {
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
          setDebtor(settlementRangeData?.data?.data?.debtor?.basicInformation);
          setDebtorId(settlementRangeData?.data?.data?.debtor?._id);
          setApiData(settlementRangeData?.data?.data?.settlementRange);
          setJustifications({
            justifications1:
              settlementRangeData?.data?.data?.settlementRange?.justifications
                ?.justification_gemini ?? "",
            justifications2:
              settlementRangeData?.data?.data?.settlementRange?.justifications
                ?.justification_gpt4_o ?? "",
            justifications3:
              settlementRangeData?.data?.data?.settlementRange?.justifications
                ?.justification_llama ?? "",
            justifications4:
              settlementRangeData?.data?.data?.settlementRange?.justifications
                ?.justification_claude ?? "",
          });
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

  const handleUpdate = async (status) => {
    const selectedCreditorIds = creditorSelect?.map(
      (creditor) => creditor.creditorId
    );
    const params = {
      creditorNames: selectedCreditorIds,
    };
    GetAllRanges(params, status);
  };

  useEffect(() => {
    GetAllRanges([], false);
  }, []);

  const handleGeneratePdf = () => {
    generatePdfFromApiData(apiData);
  };

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

  const creditorNameWithId =
    creditorNames &&
    creditorNames?.map(({ name, creditorId }) => ({
      creditorId,
      name,
    }));

  if (errorMessage) {
    // Render Error Page component if errorMessage exists
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
          {/* Adjust icon size and color */}
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
          <IconButton
            onClick={() => handleUpdate(true)}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <CircularProgress size={24} sx={{ color: Colors.SKY_BLUE }} />
            ) : (
              <RefreshIcon sx={{ color: Colors.SKY_BLUE, fontSize: "2rem" }} />
            )}
          </IconButton>
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
          xs={12}
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
              <MuiModels show="sendEmail" />
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
              <Grid item xs={12} lg={6}>
                <Box
                  key={key}
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

                  <span
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      marginTop: "0.5rem",
                    }}
                  >
                    {debtor[key]}
                  </span>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            item
            xs={12}
            sx={{ justifyContent: "space-between", mt: "1rem" }}
          >
            <GridItem
              key="Weekly Profit"
              title="Weekly Profit"
              value={
                apiData?.weekly_profit
                  ? `$ ${new Intl.NumberFormat().format(apiData.weekly_profit)}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_profit}
            />
            <GridItem
              key="Weekly Budget"
              title="Weekly Budget"
              value={
                apiData?.weekly_budget?.[allCreditorNames[parseInt(tabValue)]]
                  ? `$ ${new Intl.NumberFormat().format(
                      apiData?.weekly_budget?.[
                        allCreditorNames[parseInt(tabValue)]
                      ]
                    )}`
                  : "No Data"
              }
              rawValue={apiData?.weekly_budget}
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
          </Grid>
          <Grid
            item
            container
            xs={12}
            lg={12}
            md={12}
            xl={12}
            sm={12}
            sx={{ gap: "2%", mt: "1rem" }}
          >
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
          {/* <Grid container xs={12} spacing={2} sx={{ padding: "1rem" }}> */}
          {/* <>{cardData[strategyTab]}</> */}
          {/* </Grid> */}
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
              {allCreditorNames &&
                allCreditorNames?.map((item) => (
                  <AntTab
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
          <Grid container xs={12}>
            <Typography
              sx={{
                fontWeight: "600",
                fontFamily: "Nunito",
                marginTop: "1rem",
              }}
            >
              Creditors Contract Information
            </Typography>
            {selectedCreditorDetails &&
              selectedCreditorDetails?.contractDetails && (
                <>
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{ justifyContent: "space-between", mt: "1rem" }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={5.8}
                      md={3.8}
                      lg={2.8}
                      container
                      sx={commonStyles}
                    >
                      <Typography sx={commonTextStyles}>
                        {" "}
                        Loan Amount
                      </Typography>
                      <Typography
                        sx={{
                          ...commonTextStyles,
                          color: Colors.SKY_BLUE,
                        }}
                      >
                        {selectedCreditorDetails?.contractDetails?.loan_amount
                          ? selectedCreditorDetails.contractDetails.loan_amount.includes(
                              "$"
                            )
                            ? selectedCreditorDetails.contractDetails
                                .loan_amount
                            : `$${selectedCreditorDetails.contractDetails.loan_amount}`
                          : "--"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5.8}
                      md={3.8}
                      lg={2.8}
                      container
                      sx={commonStyles}
                    >
                      <Typography sx={commonTextStyles}>
                        Payable Amount
                      </Typography>
                      <Typography
                        sx={{
                          ...commonTextStyles,
                          color: Colors.SKY_BLUE,
                        }}
                      >
                        {selectedCreditorDetails?.contractDetails
                          ?.payable_amount
                          ? `${selectedCreditorDetails.contractDetails.payable_amount}`.includes(
                              "$"
                            )
                            ? selectedCreditorDetails.contractDetails
                                .payable_amount
                            : `$${selectedCreditorDetails.contractDetails.payable_amount}`
                          : "--"}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={5.8}
                      md={3.8}
                      lg={2.8}
                      container
                      sx={commonStyles}
                    >
                      <Typography sx={commonTextStyles}>
                        Purchase price
                      </Typography>
                      <Typography
                        sx={{
                          ...commonTextStyles,
                          color: Colors.SKY_BLUE,
                        }}
                      >
                        {selectedCreditorDetails?.contractDetails[
                          "purchase price"
                        ]
                          ? `${selectedCreditorDetails.contractDetails["purchase price"]}`.includes(
                              "$"
                            )
                            ? selectedCreditorDetails.contractDetails[
                                "purchase price"
                              ]
                            : `$${selectedCreditorDetails.contractDetails["purchase price"]}`
                          : "--"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5.8}
                      md={3.8}
                      lg={2.8}
                      container
                      sx={commonStyles}
                    >
                      <Typography sx={commonTextStyles}>
                        Purchased Percentage
                      </Typography>
                      <Typography
                        sx={{
                          ...commonTextStyles,
                          color: Colors.SKY_BLUE,
                        }}
                      >
                        {selectedCreditorDetails?.contractDetails
                          ?.purchased_percentage || "--"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5.8}
                      md={3.8}
                      lg={2.8}
                      style={{ marginTop: "1rem" }}
                      container
                      sx={commonStyles}
                    >
                      <Typography sx={commonTextStyles}>
                        Repayment Amount
                      </Typography>
                      <Typography
                        sx={{
                          ...commonTextStyles,
                          color: Colors.SKY_BLUE,
                        }}
                      >
                        {selectedCreditorDetails?.contractDetails
                          ?.repayment_amount || "--"}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
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
            {/* {["recommendation 1", "recommendation 2", "recommendation 3"]?.map(
              (item, index) => {
                return (
                  <SettlementCards
                    key={index}
                    title={item}
                    weeksTillPaidTitle={
                      item === "recommendation 1"
                        ? "Weeks remaining based on recommendation 1"
                        : item === "recommendation 2"
                        ? "Weeks remaining based on recommendation 2"
                        : item === "recommendation 3"
                        ? "Weeks remaining based on recommendation 3"
                        : ""
                    }
                    settlementRange={
                      apiData?.settlement_range?.[
                        allCreditorNames[parseInt(tabValue)]
                      ] || null
                    }
                    commissionRange={
                      apiData?.commission_range?.[
                        allCreditorNames[parseInt(tabValue)]
                      ] || null
                    }
                    newDefaultRiskScore={
                      apiData?.new_default_risk_score || null
                    }
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
                      apiData?.weeks_till_paid?.[
                        allCreditorNames[parseInt(tabValue)]
                      ] || null
                    }
                  />
                );
              }
            )} */}
          </Grid>
          <Grid
            item
            container
            xs={12}
            lg={12}
            md={12}
            xl={12}
            sm={12}
            sx={{ gap: "2%", mt: "1rem" }}
          >
            {/* {scores?.Scores && (
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
            )} */}
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
            sx={{
              backgroundColor: Colors.WHITE,
              borderRadius: "10px",
              mt: "2rem",
            }}
          >
            <AntTabs
              value={value}
              onChange={handleChange}
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
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              height: "40vh",
              overflowY: "auto",
              backgroundColor: Colors1.WHITE,
              ...ScrollbarStyles1,
              padding: "16px",
            }}
          >
            {tableLoading ? (
              <Grid
                container
                item
                xs={12}
                sx={{
                  height: "37vh",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Grid>
            ) : (
              <ReactMarkdown>
                {strategyTab === 2
                  ? fullProfit?.justifications?.[justificationValue] ||
                    "No justifications available"
                  : strategyTab === 1
                  ? lumpSumpData?.justifications?.[justificationValue] ||
                    "No justifications available"
                  : justifications?.[`justifications${value + 1}`] ||
                    "No justifications available"}
              </ReactMarkdown>

              // <Grid container direction="column" spacing={2}>
              //   {messages.map((msg) => (
              //     <Grid item key={msg.id}>
              //       <Paper
              //         sx={{
              //           padding: "10px",
              //           backgroundColor:
              //             msg.sender === "bot"
              //               ? Colors1.BOT_MESSAGE_BG
              //               : Colors1.USER_MESSAGE_BG,
              //           alignSelf:
              //             msg.sender === "bot" ? "flex-start" : "flex-end",
              //           maxWidth: "80%",
              //         }}
              //       >
              //         <Typography variant="body1">{msg.message}</Typography>
              //       </Paper>
              //     </Grid>
              //   ))}
              // </Grid>
            )}
          </Grid>
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
              onChange={(e) => handleInputChange(e)}
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
        </>
      )}
    </Grid>
  );
}
