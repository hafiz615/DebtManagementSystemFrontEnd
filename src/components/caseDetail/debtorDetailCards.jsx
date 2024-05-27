import React from "react";

import {
  Grid,
  Typography,
  Card,
  IconButton,
  styled,
  InputBase,
} from "@mui/material";
import {
  Search,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import avatar from "../../assets/Ellipse 12.png";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: Colors.BG_LIGHT_GRAY,
  "&:hover": {
    backgroundColor: Colors.BG_LIGHT_GRAY,
  },
  fontSize: "10px",
  width: "40%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    fontSize: "10px",
    paddingLeft: `calc(1em + ${theme.spacing(2.5)})`,
    transition: theme.transitions.create("width"),
  },
}));

export default function DebtorDetailsCards() {
  const personDetail = {
    Name: "rummaz",
    Email: "ruma@gmail.com",
    Country: "Pakistan",
    State: "Punjab",
    Phone: "03211017632",
    Address: "ghazi road lahore",
    SSN: "99921291",
    Status: "customer",
    City: "lahore",
    ZipCode: "50000",
  };
  const businessDetail = {
    Company: "pathan",
    EIN: "32132312",
    Category: "tech",
    Country: "Pakistan",
    State: "Punjab",
    City: "lahore",
    ZipCode: "50000",
    Phone: "03211017632",
    Address: "ghazi road lahore",
    Description: "none",
  };
  return (
    <Grid
      container
      sx={{
        height: "13rem",
        justifyContent: "space-between",
      }}
    >
      <Grid
        item
        xs={3.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
        }}
      >
        <p
          style={{ fontWeight: "600", fontSize: "13px", fontFamily: "Nunito" }}
        >
          Person Details
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10%" }}>
          {Object.entries(personDetail)?.map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                marginBottom: "8px",
              }}
            >
              <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                {key}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {value}
              </Typography>
            </div>
          ))}
        </div>
      </Grid>
      <Grid
        item
        xs={3.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
        }}
      >
        <p
          style={{ fontWeight: "600", fontSize: "13px", fontFamily: "Nunito" }}
        >
          Business Details
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10%" }}>
          {Object.entries(businessDetail)?.map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "45%",
                marginBottom: "8px",
              }}
            >
              <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                {key}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {value}
              </Typography>
            </div>
          ))}
        </div>
      </Grid>
      <Grid
        item
        xs={3.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Contacts
          </p>
          <SearchContainer>
            <SearchIconWrapper>
              <Search sx={{ fontSize: "16px", color: Colors.DIM_LIGHT_GRAY }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Contact..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchContainer>
          <div
            style={{
              display: "flex",
              fontSize: "11px",
              alignItems: "center",
              fontFamily: "Nunito",
            }}
          >
            <IconButton>
              <KeyboardArrowLeft sx={{ fontSize: "16px" }} />
            </IconButton>
            1 of 4
            <IconButton>
              <KeyboardArrowRight sx={{ fontSize: "16px" }} />
            </IconButton>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4%" }}>
          <Card
            sx={{
              height: "5rem",
              display: "flex",
              boxShadow: "none",
              border: "1px solid lightgrey",
              borderRadius: "10px",
              width: "48%",
              padding: "0px 8px",
              marginBottom: "4%",
            }}
          >
            <div
              style={{
                width: "30%",
                marginTop: "10%",
              }}
            >
              <img
                style={{ borderRadius: "50%" }}
                width={25}
                height={25}
                src={avatar}
                alt=""
              />
            </div>
            <div
              style={{
                width: "70%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
                {personDetail?.Name}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {personDetail?.Email}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {personDetail?.Phone}
              </Typography>
            </div>
          </Card>
        </div>
      </Grid>
    </Grid>
  );
}
