import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import TextButton from "../button";
import { Close } from "@mui/icons-material";
import StrategyOne from "./StrategyOne";
import StrategyThree from "./StrategyThree";
import { GetSettlementRangeWithScores } from "../../services/services";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../toast/toastContext";

function CommissionDetails({
  handleClose,
  data,
  caseId,
  popUpDebtorData,
  getAllRanges,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [customValue, setCustomValue] = useState(
    data?.debtor?.strategy1BudgetCustom ||
      popUpDebtorData?.strategy1BudgetCustom ||
      ""
  );
  const [selectedOptionThree, setSelectedOptionThree] = useState("");
  const [customValueThree, setCustomValueThree] = useState(
    data?.debtor?.strategy3BudgetCustom ||
      popUpDebtorData?.strategy3BudgetCustom ||
      ""
  );
  const [isStrategyOneSaved, setIsStrategyOneSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const debtorDetails = data?.debtor?.basicInformation;
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isStrategyOneSaved) {
      setSelectedOption(
        data?.debtor?.weeklyBudgetKeyStrategy1 ||
          popUpDebtorData?.weeklyBudgetKeyStrategy1 ||
          ""
      );
    } else {
      setSelectedOptionThree(
        data?.debtor?.weeklyBudgetKeyStrategy3 ||
          popUpDebtorData?.weeklyBudgetKeyStrategy3 ||
          ""
      );
    }
  }, [data, popUpDebtorData, isStrategyOneSaved]);

  const payload = {
    strategy1Profit:
      selectedOption === "strategy1Profit"
        ? debtorDetails?.strategy1MaxProfit
        : 0,
    strategy1Weekly:
      selectedOption === "strategy1Weekly"
        ? debtorDetails?.weeklyBudgetStrategy1
        : 0,
    strategy1Custom:
      selectedOption === "strategy1Custom"
        ? Number(customValue)
        : 0 || debtorDetails?.strategy1BudgetCustom,

    strategy1Choosen: selectedOption, // This value reflects the selected option
    strategy3Profit:
      selectedOptionThree === "strategy3Profit"
        ? debtorDetails?.strategy3MaxProfit
        : 0,
    strategy3ProfitMargin:
      selectedOptionThree === "strategy3ProfitMargin"
        ? debtorDetails?.weeklyBudgetStrategy3
        : 0,
    strategy3Custom:
      selectedOptionThree === "strategy3Custom"
        ? Number(customValueThree)
        : 0 || debtorDetails?.strategy3BudgetCustom,
    strategy3Choosen: selectedOptionThree, // This value reflects the selected option for StrategyThree
  };

  const handleSave = async () => {
    setLoading(true);
    if (!isStrategyOneSaved) {
      setIsStrategyOneSaved(true);
    } else {
      const settlementRangeData = await GetSettlementRangeWithScores(
        payload,
        popUpDebtorData ? caseId : data?._id,
        true,
        true
      );
      if (settlementRangeData?.status === 200) {
        showToast(settlementRangeData?.data?.message, "success");
        const settlementId = popUpDebtorData ? caseId : data?._id;
        navigate(`/settlementRange/${settlementId}`);
        getAllRanges && getAllRanges([], false);
        handleClose();
      } else {
        const errorMessage = settlementRangeData?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    setLoading(false);
  };

  // Check if the button should be disabled
  const isButtonDisabled = !(
    (isStrategyOneSaved && (selectedOptionThree || customValueThree)) ||
    (!isStrategyOneSaved && (selectedOption || customValue))
  );

  return (
    <Grid container>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: "600", fontFamily: "Nunito" }}>
          {isStrategyOneSaved
            ? "Percentage Receivable to be used for Percentage Receivable Strategy"
            : "Weekly Budget to be used for Max Profit Strategy"}
        </Typography>
        <Close onClick={handleClose} sx={{ marginRight: "1rem" }} />
      </Box>

      {!isStrategyOneSaved ? (
        <StrategyOne
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          customValue={customValue}
          setCustomValue={setCustomValue}
          data={data}
          popUpDebtorData={popUpDebtorData}
        />
      ) : (
        <StrategyThree
          selectedOptionThree={selectedOptionThree}
          setSelectedOptionThree={setSelectedOptionThree}
          customValueThree={customValueThree}
          setCustomValueThree={setCustomValueThree}
          data={data}
          popUpDebtorData={popUpDebtorData}
        />
      )}

      <Grid
        container
        item
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {isStrategyOneSaved && (
          <TextButton
            buttonText="BACK"
            height="2rem"
            marginRight="1rem"
            width="6rem"
            onClick={() => setIsStrategyOneSaved(false)}
            backgroundColor={Colors.ORANGE_COLOR}
            hoverColor={Colors.ORANGE_COLOR}
          />
        )}

        <TextButton
          buttonText={isStrategyOneSaved ? "Save" : "Save and Next"}
          boxShadow="none"
          height="2rem"
          width={isStrategyOneSaved ? "6rem" : "10rem"}
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          borderRadius="5px"
          onClick={handleSave}
          loading={loading}
          disabled={isButtonDisabled}
        />
      </Grid>
    </Grid>
  );
}

export default CommissionDetails;
