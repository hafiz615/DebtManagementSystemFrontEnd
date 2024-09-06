import React, { useState } from "react";

import { Colors } from "../../config/default";
import { Typography, Grid, Checkbox, FormControlLabel } from "@mui/material";
import TextButton from "../button";
import generatePDF from "../../common";
import { FONT_SIZE_XXL } from "../../constants/appConstants";

function DownloadPDF({ allData, lumpSumpData, fullProfit, handleClose }) {
  const typographyOptions = [
    "Debtor Information",
    "Settlement Range",
    "Scores",
    "Creditors Contract Information",
    "Creditors Contract Details Summary",
    "Strategy 1 Recommendations",
    "Strategy 2 Recommendations",
    "Strategy 3 Recommendations",
  ];

  const [checkboxState, setCheckboxState] = useState({
    "Debtor Information": true,
    "Settlement Range": false,
    Scores: false,
    "Creditors Contract Information": false,
    "Creditors Contract Details Summary": false,
    "Strategy 1 Recommendations": false,
    "Strategy 2 Recommendations": false,
    "Strategy 3 Recommendations": false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        paddingLeft: { xs: "0.5rem", sm: "2rem" },
        paddingRight: { xs: "0.5rem", sm: "2rem" },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontSize: FONT_SIZE_XXL,
          fontWeight: "600",
          marginTop: "1rem",
        }}
      >
        Download Settlement Range data from the following :
      </Typography>
      {typographyOptions?.map((name) => (
        <Grid item xs={12} key={name}>
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                checked={checkboxState[name]}
                onChange={handleCheckboxChange}
                sx={{
                  "&.Mui-checked": {
                    color: Colors.SKY_BLUE, // Checked color
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: "Nunito", fontWeight: "400" }}>
                {name}
              </Typography>
            }
          />
        </Grid>
      ))}
      <Grid
        container
        item
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText={"Download"}
          boxShadow="none"
          height={"2rem"}
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          border={`1px solid ${Colors.SKY_BLUE}`}
          borderRadius="5px"
          onClick={() =>
            generatePDF(allData, lumpSumpData, fullProfit, checkboxState)
          }
        />
      </Grid>
    </Grid>
  );
}

export default DownloadPDF;
