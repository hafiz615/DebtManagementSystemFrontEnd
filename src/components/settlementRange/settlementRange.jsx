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
import { Download, PeopleAlt, Send } from "@mui/icons-material";
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
import CheckboxAutocomplete from "../checkboxAutocomplete";

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
  <Grid item xs={12} sm={5.8} md={3.8} lg={2.8} container sx={commonStyles}>
    <Typography sx={commonTextStyles}>{title}</Typography>
    <Typography sx={{ ...commonTextStyles, color: Colors.SKY_BLUE }}>
      {value}
    </Typography>
  </Grid>
);

export default function SettlementRange() {
  const { showToast } = useToast();
  const [value, setValue] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [creditorNames, setCreditorNames] = useState([]);
  const [creditorSelect, setCreditorSelect] = useState([]);
  const [scores, setScores] = useState(null);
  const [justifications, setJustifications] = useState({
    justifications1: "",
    justifications2: "",
    justifications3: "",
  });
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const caseId = useSelector((state) => state.caseId.id);
  const initialCreditorId = useSelector((state) => state.creditorCaseId.id);
  const drawerOpen = useSelector((state) => state.drawer.open);
  const { AUTHORITY_TEXT } = UserListPage;
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  console.log(tabValue);

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
            resRanges?.data?.data?.justifications?.justification_1 ?? "",
          justifications2:
            resRanges?.data?.data?.justifications?.justification_2 ?? "",
          justifications3:
            resRanges?.data?.data?.justifications?.justification_3 ?? "",
        });
      }
    }
  };

  const GetAllRanges = async () => {
    if (caseId) {
      // setLoading(true);
      const resCreditors = await GetCreditorNames("", caseId);
      if (resCreditors?.status === 200) {
        const allCreditors = resCreditors?.data?.data;
        setCreditorNames(allCreditors);
        if (allCreditors?.length === 0) {
          showToast(
            "Recheck And Confirm That Creditor Account Title Is Matching As On Statement And Not Null",
            "error"
          );
          setLoading(false);
        } else if (allCreditors?.length > 0) {
          showToast("Creditors Fetched Successfully", "success");
          const params = {
            creditorNames: initialCreditorId,
          };
          showToast("Fetching Scores...", "success");
          const resScores = await GetScores(params, caseId);
          if (resScores?.status === 200) {
            console.log(resScores, "resScores");
            setScores(resScores?.data?.data); //set tabs creditor names here
            showToast(resScores?.data?.message, "success");
            const resRanges = await GetSettlementRange("", caseId);
            if (resRanges?.status === 200) {
              setLoading(false);
              setApiData(resRanges?.data?.data);
              showToast(resRanges?.data?.message, "success");
              setJustifications({
                justifications1:
                  resRanges?.data?.data?.justifications?.justification_1 ?? "",
                justifications2:
                  resRanges?.data?.data?.justifications?.justification_2 ?? "",
                justifications3:
                  resRanges?.data?.data?.justifications?.justification_3 ?? "",
              });
            }
          }
        }
      }
    }
  };

  const handleUpdate = async () => {
    const selectedCreditorIds = creditorSelect?.map(
      (creditor) => creditor.creditorId
    );
    console.log(selectedCreditorIds);
    const params = {
      creditorNames: selectedCreditorIds,
    };
    const resScores = await GetScores(params, caseId);
    setLoading(true);
    if (resScores?.status === 200) {
      setScores(resScores?.data?.data);
      showToast(resScores?.data?.message, "success");
      const resRanges = await GetSettlementRange("", caseId);
      if (resRanges?.status === 200) {
        setLoading(false);
        setApiData(resRanges?.data?.data);
        showToast(resRanges?.data?.message, "success");
        setJustifications({
          justifications1:
            resRanges?.data?.data?.justifications?.justification_1 ?? "",
          justifications2:
            resRanges?.data?.data?.justifications?.justification_2 ?? "",
          justifications3:
            resRanges?.data?.data?.justifications?.justification_3 ?? "",
        });
      }
    }
  };

  useEffect(() => {
    GetAllRanges();
  }, []);

  const handleGeneratePdf = () => {
    generatePdfFromApiData(apiData);
  };

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

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
                  options={creditorNames}
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
              {creditorNames?.map(
                (
                  names //map tab names from get scores here
                ) => (
                  <AntTab
                    sx={{
                      bgcolor: Colors.WHITE,
                      width: "max-content",
                      fontWeight: "600",
                      height: "3.5rem",
                    }}
                    label={names}
                  />
                )
              )}
            </AntTabs>
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
              value={apiData?.weekly_profit ?? "No Data"}
            />
            <GridItem
              key="Weekly Budget"
              title="Weekly Budget"
              value={
                scores?.Scores?.["Weekly Budget"]?.[
                  creditorNames[parseInt(tabValue)]
                ] ?? "No Data"
              }
            />
            <GridItem
              key="Weekly True Revenue"
              title="Weekly True Revenue"
              value={apiData?.weekly_true_revenue ?? "No Data"}
            />
            <GridItem
              key="Profitability"
              title="Profitability"
              value={apiData?.profitability ?? "No Data"}
            />
          </Grid>
          <Grid item container xs={12} sx={{ gap: "2%", mt: "1rem" }}>
            <GridItem
              key="UCC Score"
              title="UCC Score"
              value={scores?.Scores?.["UCC Score"] ?? "No Data"}
            />
            <GridItem
              key="Default Risk Score"
              title="Default Risk Score"
              value={scores?.Scores?.["Default Risk Score"] ?? "No Data"}
            />
          </Grid>
          <Grid
            item
            container
            xs={12}
            sx={{
              borderRadius: "10px",
              mt: "1rem",
              justifyContent: "space-between",
            }}
          >
            {["recommendation 1", "recommendation 2", "recommendation 3"]?.map(
              (item, index) => {
                return (
                  <SettlementCards
                    key={index}
                    title={item}
                    settlementRange={
                      apiData?.settlement_range?.[
                        creditorNames[parseInt(tabValue)]
                      ] || null
                    }
                    commissionRange={
                      apiData?.commission_range?.[
                        creditorNames[parseInt(tabValue)]
                      ] || null
                    }
                    newDefaultRiskScore={
                      apiData?.new_default_risk_score || null
                    }
                    percentageSettlementOverWeeklyBudget={
                      apiData?.percentage_settlement_over_weekly_budget?.[
                        creditorNames[parseInt(tabValue)]
                      ] || null
                    }
                    percentageSettlementOverWeeklyTrueRevenue={
                      apiData?.percentage_settlement_over_weekly_true_revenue?.[
                        creditorNames[parseInt(tabValue)]
                      ] || null
                    }
                  />
                );
              }
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
                label="Laima"
              />
            </AntTabs>
          </Grid>
          <Grid
            item
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
