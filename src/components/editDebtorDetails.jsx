import React, { useState } from "react";

import { Grid, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import TextButton from "./button";
import Dropdown from "./dropdown";

export default function EditDebtorDetail({ handleClose }) {
  const [selectedValue, setSelectedValue] = useState("Completed");

  const menuItems = [
    { label: "Completed", value: "Complted" },
    { label: "On Hold", value: "On Hold" },
    { label: "To Do", value: "To Do" },
  ];
  const personDetail = [
    "Full Name",
    "Email",
    "Country",
    "State",
    "Phone",
    "Address",
    "SSN",
    "Status",
    "City",
    "Zip Code",
  ];
  const businessDetail = ["Company", "Category", "EIN", "Phone", "Description"];
  return (
    <Grid>
      <Grid container xs={12} sx={{ justifyContent: "space-between" }}>
        <Typography
          sx={{ m: "1.5rem 0rem", fontWeight: "600", fontFamily: "Nunito" }}
        >
          Personal Details
        </Typography>
        <Box onClick={handleClose} sx={{ cursor: "pointer" }}>
          <Close />
        </Box>
      </Grid>

      <Grid container sx={{ flexWrap: "wrap" }}>
        {personDetail?.map((item) => (
          <Grid xs={3} sx={{ mt: "1rem" }}>
            <Typography sx={{ fontFamily: "Nunito" }}>{item}</Typography>
            {item === "Status" ? (
              <Dropdown
                width="90%"
                height="2rem"
                marginTop="10px"
                menuItems={menuItems}
                defaultSelectedItem={"Completed"}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
              />
            ) : (
              <input
                type="email"
                placeholder={item}
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "90%",
                  marginTop: "10px",
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Grid>
        <Typography
          sx={{ m: "1.5rem 0rem", fontWeight: "600", fontFamily: "Nunito" }}
        >
          Business Detail
        </Typography>
      </Grid>
      <Grid container sx={{ flexWrap: "wrap" }}>
        {businessDetail?.map((item) => (
          <Grid xs={3} sx={{ mt: "1rem" }}>
            <Typography sx={{ fontFamily: "Nunito" }}>{item}</Typography>
            <input
              type="email"
              placeholder={item}
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "90%",
                margin: "10px 0px",
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container sx={{ justifyContent: "right" }}>
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </Grid>
    </Grid>
  );
}
