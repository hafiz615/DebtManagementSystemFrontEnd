import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Typography,
  styled,
  Tabs,
  Tab,
  useMediaQuery,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import { Download, Send } from "@mui/icons-material";
import TextButton from "../button";
import SettlementCards from "./settlementCards";
import {
  GetCreditorNames,
  GetScores,
  GetSettlementRange,
  GetSummary,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { generatePdfFromApiData } from "../../common";
import MuiModels from "../models";

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

const GridItem = ({ title, value }) => (
  <Grid xs={12} sm={5.8} md={3.8} lg={2.8} container sx={commonStyles}>
    <Typography sx={commonTextStyles}>{title}</Typography>
    <Typography sx={{ ...commonTextStyles, color: Colors.SKY_BLUE }}>
      {value}
    </Typography>
  </Grid>
);

export default function SettlementRange() {
  const { showToast } = useToast();
  const [value, setValue] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [creditorId, setCreditorId] = useState("");
  const [creditorNames, setCreditorNames] = useState([]);
  const [scores, setScores] = useState(null);
  const [justifications, setJustifications] = useState({
    justifications1: "",
    justifications2: "",
    justifications3: "",
  });
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const caseId = useSelector((state) => state.caseId.id);
  const { AUTHORITY_TEXT } = UserListPage;
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value === "" || value[0] !== " ") {
      setInputValue(value);
    }
  };

  const handleClick = () => {
    setTableLoading(true);
    const payload = {
      financialHealthSummary: "",
      humanInput: inputValue,
    };
    setInputValue("");
    const resSummary = GetSummary(payload, caseId);
    if (resSummary?.status === 200) {
      setTableLoading(false);
      GetAllRanges();
    }
  };

  const GetAllRanges = async () => {
    if (caseId) {
      setLoading(true);
      const resRanges = await GetSettlementRange("", caseId);
      if (resRanges?.status === 200) {
        setLoading(false);
        setApiData(resRanges?.data?.data);
        setCreditorId(resRanges?.data?.data?.creditors_id);
        showToast(resRanges?.data?.message, "success");
        setJustifications({
          justifications1:
            resRanges?.data?.data?.justifications?.justification_1 ?? "",
          justifications2:
            resRanges?.data?.data?.justifications?.justification_2 ?? "",
          justifications3:
            resRanges?.data?.data?.justifications?.justification_3 ?? "",
        });
        const resCreditors = GetCreditorNames("", caseId);
        if (resCreditors?.status === 200) {
          setCreditorNames(resCreditors?.data?.data);
          if (creditorNames) {
            const params = {
              creditorNames: creditorNames,
            };
            const resScores = GetScores(params, caseId);
            if (resScores?.status === 200) {
              setScores(resScores?.data?.data);
              showToast(resScores?.data?.message, "success");
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    GetAllRanges();
  }, []);

  const handleGeneratePdf = () => {
    generatePdfFromApiData(apiData);
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
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          marginTop: "1.5rem",
        }}
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
            <div style={{ display: "flex" }}>
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
                    <Download sx={{ color: Colors.SKY_BLUE }} />
                  )
                }
                onClick={handleGeneratePdf}
              />
            </div>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ justifyContent: "space-between", mt: "1rem" }}
          >
            <GridItem
              title="Weekly Profit"
              value={apiData?.weekly_profit ?? "No Data"}
            />
            <GridItem
              title="Weekly Budget"
              value={
                apiData?.weekly_budget?.["Everest Businss Funding"] ?? "No Data"
              }
            />
            <GridItem
              title="Weekly True Revenue"
              value={apiData?.weekly_true_revenue ?? "No Data"}
            />
            <GridItem
              title="Profitability"
              value={apiData?.profitability ?? "No Data"}
            />
          </Grid>

          <Grid container xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            <GridItem
              title="UCC Score"
              value={scores?.["UCC Score"] ?? "No Data"}
            />
            <GridItem
              title="Default Risk Score"
              value={scores?.["Default Risk Score"] ?? "No Data"}
            />
          </Grid>

          <Grid
            container
            xs={12}
            sx={{
              borderRadius: "10px",
              mt: "1rem",
              justifyContent: "space-between",
            }}
          >
            {apiData
              ? [
                  "recommendation 1",
                  "recommendation 2",
                  "recommendation 3",
                ].map((item, index) => {
                  return (
                    <SettlementCards
                      title={item}
                      settlementRange={
                        apiData?.settlement_range?.[
                          "Everest Businss Funding"
                        ] || null
                      }
                      commissionRange={
                        apiData?.commission_range?.[
                          "Everest Businss Funding"
                        ] || null
                      }
                      newDefaultRiskScore={
                        apiData?.new_default_risk_score || null
                      }
                      percentageSettlementOverWeeklyBudget={
                        apiData?.percentage_settlement_over_weekly_budget?.[
                          "Everest Businss Funding"
                        ] || null
                      }
                      percentageSettlementOverWeeklyTrueRevenue={
                        apiData
                          ?.percentage_settlement_over_weekly_true_revenue?.[
                          "Everest Businss Funding"
                        ] || null
                      }
                    />
                  );
                })
              : "No Data"}
          </Grid>

          <Grid
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
                  width: { xs: "30%", sm: "max-content" },
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="Gemini"
              />
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: { xs: "30%", sm: "max-content" },
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="GPT-04"
              />
              <AntTab
                sx={{
                  bgcolor: Colors.WHITE,
                  width: { xs: "30%", sm: "max-content" },
                  fontWeight: "600",
                  height: "3.5rem",
                }}
                label="Laima"
              />
            </AntTabs>
          </Grid>

          <Grid
            xs={12}
            sx={{
              height: "40vh",
              overflowY: "auto",
              backgroundColor: Colors.WHITE,
              ...ScrollbarStyles,
              padding: "16px",
            }}
          >
            {tableLoading ? (
              <Grid
                container
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
              <div
                style={{ color: "black" }}
                dangerouslySetInnerHTML={{
                  __html: justifications[`justifications${value + 1}`],
                }}
              />
            )}
          </Grid>

          <Grid
            container
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
