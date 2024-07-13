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
import { Download, Email, PeopleAlt, Send } from "@mui/icons-material";
import TextButton from "../button";
import SettlementCards from "./settlementCards";
import CheckboxAutocomplete from "../checkboxAutocomplete";
import { GetSettlementRange } from "../../services/services";
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
  //   const [creditors, setCreditors] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(false);
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

  //   const allCreditors = ["Rummaz", "Tamoor", "Usama"];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value === "" || value[0] !== " ") {
      setInputValue(value);
    }
  };

  const handleClick = () => {};

  const GetAllRanges = async () => {
    if (caseId) {
      setLoading(true);
      const resRanges = await GetSettlementRange(caseId);

      if (resRanges?.status === 200) {
        setApiData(resRanges?.data?.data);
        showToast(resRanges?.data?.message, "success");
        setJustifications({
          justifications1: apiData?.["get-settlement-range"]?.justification_1,
          justifications2: apiData?.["get-settlement-range"]?.justification_2,
          justifications3: apiData?.["get-settlement-range"]?.justification_3,
        });
      } else {
        // const errorMessage = resRanges?.response?.data?.message;
        showToast("Unable To Fetch Data", "error");
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllRanges();
  }, []);

  const handleGeneratePdf = () => {
    generatePdfFromApiData(apiData);
  };

  const settlments = apiData?.["get-settlement-range"];
  const scores = apiData?.["get-scores"]?.Scores;

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
                buttonText={"Download"}
                boxShadow="none"
                height={"2.5rem"}
                width={extraSmallScreen ? "2rem" : "8rem"}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                fontColor={Colors.BLACK}
                hoverColor={Colors.BG_LIGHT_GRAY}
                onClick={handleGeneratePdf}
                startIcon={
                  extraSmallScreen ? (
                    ""
                  ) : (
                    <Download
                      sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
                    />
                  )
                }
              />
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleAlt
                  sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
                />

                <CheckboxAutocomplete
                  options={allCreditors}
                  multiSelect={creditors}
                  setMultiselect={setCreditors}
                  placeholder="All Creditors"
                  width="8rem"
                />
              </div> */}
            </div>
          </Grid>
          <Grid
            container
            xs={12}
            sx={{ justifyContent: "space-between", mt: "1rem" }}
          >
            <GridItem
              title="Weekly Profit"
              value={settlments?.weekly_profit ?? "No Data"}
            />
            <GridItem
              title="Weekly Budget"
              value={
                settlments?.weekly_budget?.["Everest Businss Funding"] ??
                "No Data"
              }
            />
            <GridItem
              title="Weekly True Revenue"
              value={settlments?.weekly_true_revenue ?? "No Data"}
            />
            <GridItem
              title="Profitability"
              value={settlments?.profitability ?? "No Data"}
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
            <SettlementCards
              title="Settlement Range"
              data={settlments?.settlement_range["Everest Businss Funding"]}
            />
            <SettlementCards
              title="Weekly Budget %"
              data={
                settlments?.percentage_settlement_over_weekly_budget[
                  "Everest Businss Funding"
                ]
              }
            />
            <SettlementCards title="Weekly True Revenue" data={""} />
            <SettlementCards
              title="Settlement Weekly True Revenue %"
              data={settlments?.settlement_range["Everest Businss Funding"]}
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
            <SettlementCards
              title="New Default Risk Score"
              data={
                settlments?.new_default_risk_score["Everest Businss Funding"]
              }
            />
            <SettlementCards
              title="Weeks Till Paid"
              data={settlments?.weeks_till_paid["Everest Businss Funding"]}
            />
            <SettlementCards
              title="Commission Range"
              data={settlments?.commission_range["Everest Businss Funding"]}
            />
            <SettlementCards title="Likely to be Accepted" data={""} />
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
            <div
              style={{ color: "black" }}
              dangerouslySetInnerHTML={{
                __html: justifications[`justifications${value + 1}`],
              }}
            />
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
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
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
