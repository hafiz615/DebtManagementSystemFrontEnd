import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { Colors } from "../../config/default";
import TextButton from "../button";
import { Close } from "@mui/icons-material";
import StrategyOne from "./StrategyOne";
import StrategyThree from "./StrategyThree";

function CommissionDetails({ handleClose, data }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [selectedOptionThree, setSelectedOptionThree] = useState("");
  const [customValueThree, setCustomValueThree] = useState("");

  const [isStrategyOneSaved, setIsStrategyOneSaved] = useState(false); // New state to track save progress

  const weeklyBudget = data?.debtor?.basicInformation?.weeklyBudget;

  const handleSave = () => {
    if (!isStrategyOneSaved) {
      let keyChoosen = "";

      if (selectedOption === "profit") {
        keyChoosen = "profit";
      } else if (selectedOption === "weekly") {
        keyChoosen = "weekly";
      } else if (selectedOption === "choose" && customValue) {
        keyChoosen = "custom";
      }

      const strategyOneDetails = {
        profit: selectedOption === "profit" ? weeklyBudget : 0,
        weekly: selectedOption === "weekly" ? weeklyBudget : 0,
        custom: selectedOption === "choose" ? Number(customValue) : 0,
        keyChoosen,
      };

      console.log("Strategy 1 Details: ", strategyOneDetails);
      setIsStrategyOneSaved(true);
    } else {
      let keyChoosen = "";

      if (selectedOptionThree === "profit") {
        keyChoosen = "profit";
      } else if (selectedOptionThree === "weekly") {
        keyChoosen = "weekly";
      } else if (selectedOptionThree === "choose" && customValueThree) {
        keyChoosen = "custom";
      }

      const strategyThreeDetails = {
        profit: selectedOptionThree === "profit" ? weeklyBudget : 0,
        weekly: selectedOptionThree === "weekly" ? weeklyBudget : 0,
        custom: selectedOptionThree === "choose" ? Number(customValueThree) : 0,
        keyChoosen,
      };

      console.log("Strategy 3 Details: ", strategyThreeDetails);
    }
  };

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
            ? "Weekly Commission for Strategy 3"
            : "Weekly Commission for Strategy 1"}
        </Typography>
        <Close onClick={handleClose} sx={{ marginRight: "1rem" }} />
      </Box>

      {!isStrategyOneSaved ? (
        <StrategyOne
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          customValue={customValue}
          setCustomValue={setCustomValue}
        />
      ) : (
        <StrategyThree
          selectedOptionThree={selectedOptionThree}
          setSelectedOptionThree={setSelectedOptionThree}
          customValueThree={customValueThree}
          setCustomValueThree={setCustomValueThree}
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
        />
      </Grid>
    </Grid>
  );
}

export default CommissionDetails;
