import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Grid,
  Typography,
  styled,
  Tabs,
  Tab,
  Box,
  useMediaQuery,
} from "@mui/material";

import {
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import ListTable from "../listTable";
import { Download, Email, Send } from "@mui/icons-material";
import TextButton from "../button";

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

export default function SettlementRange() {
  const [value, setValue] = useState(0);
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );
  const { AUTHORITY_TEXT } = UserListPage;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
  const headers = ["", "Recommendation1", "Recommendation2", "Recommendation3"];
  const rows = [
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
  ];

  const scoreHeaders = [
    "Creditor",
    "UCC Score",
    "Default Risk Score",
    "Weekly Budget",
  ];

  const scoreRows = [
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
    ["Weekly Budget", "Recommendation1", "Recommendation1", "Recommendation1"],
  ];

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
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          justifyContent: "space-between",
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
          <TextButton
            buttonText={
              extraSmallScreen ? (
                <Email
                  sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
                />
              ) : (
                "Send Email"
              )
            }
            boxShadow="none"
            height={"2.5rem"}
            width={extraSmallScreen ? "2rem" : "10rem"}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            fontColor={Colors.BLACK}
            hoverColor={Colors.BG_LIGHT_GRAY}
            // onClick={handleOpen}
            startIcon={
              extraSmallScreen ? (
                ""
              ) : (
                <Email
                  sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
                />
              )
            }
          />
          <TextButton
            buttonText={
              extraSmallScreen ? (
                <Download
                  sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
                />
              ) : (
                "Download"
              )
            }
            boxShadow="none"
            height={"2.5rem"}
            width={extraSmallScreen ? "2rem" : "8rem"}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            fontColor={Colors.BLACK}
            hoverColor={Colors.BG_LIGHT_GRAY}
            // onClick={handleOpen}
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
        </div>
      </Grid>
      <Grid
        container
        xs={12}
        sx={{ justifyContent: "space-between", mt: "1rem" }}
      >
        <GridItem title="Weekly Profit" value="273.30" />
        <GridItem title="Weekly Budget" value="273.30" />
        <GridItem title="Weekly True Revenue" value="273.30" />
        <GridItem title="Profitability" value="273.30" />
      </Grid>
      <Grid
        xs={12}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          height: "40vh",
          mt: "1rem",
        }}
      >
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            marginLeft: "25px",
          }}
        >
          <Typography sx={commonTextStyles}>Settlment Range</Typography>
        </div>
        <ListTable data={rows} headerData={headers} />
      </Grid>
      <Grid
        xs={12}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          height: "40vh",
          mt: "2rem",
        }}
      >
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            marginLeft: "25px",
          }}
        >
          <Typography sx={commonTextStyles}>Scores</Typography>
        </div>
        <ListTable data={scoreRows} headerData={scoreHeaders} />
      </Grid>
      <Grid
        xs={12}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          height: "40vh",
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
          style={{
            backgroundColor: Colors.WHITE,
            color: Colors.DIM_LIGHT_GRAY,
            paddingLeft: "1rem",
            border: "none",
            outline: "none",
            borderRadius: "5px 0 0 5px",
            flex: 1,
            height: "95%",
          }}
        />
        <Box
          //   onClick={handleClick}
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
        </Box>
      </Grid>
    </Grid>
  );
}
