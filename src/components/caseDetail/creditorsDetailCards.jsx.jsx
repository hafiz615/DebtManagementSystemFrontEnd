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
  Add,
} from "@mui/icons-material";

import { Colors } from "../../config/default";
import avatar from "../../assets/Ellipse 12.png";
import MuiModels from "../models";

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

export default function CreditorsDetailCards() {
  const personDetail = {
    name: "rummaz",
    email: "ruma@gmail.com",
    phone: "03211017632",
  };
  const businessDetail = {
    company: "pathan",
    category: "tech",
    notes: "hey hey hey hey hey hey",
  };
  return (
    <Grid
      container
      sx={{
        height: "13rem",
        gap: "1%",
      }}
    >
      <Grid
        item
        xs={2}
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Person Details
          </p>
          <MuiModels
            show="creditorDetail"
            button="create"
            iconColor={Colors.BLACK}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Full Name
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            {personDetail?.name}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Email
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            {personDetail?.email}
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Phone #
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            {personDetail?.phone}
          </Typography>
        </div>
      </Grid>
      <Grid
        item
        xs={2}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Company
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            {businessDetail?.company}
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Category
          </Typography>
          <Typography
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            {businessDetail?.category}
          </Typography>
        </div>
        <div>
          <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>Notes</p>
          <p
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAYm,
              fontFamily: "Nunito",
            }}
          >
            {businessDetail?.notes}
          </p>
        </div>
      </Grid>
      <Grid
        item
        xs={1.5}
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
          Funded
        </p>
        <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>
          Last Funded Date
        </p>
        <p style={{ fontSize: "11px", color: Colors.DIM_LIGHT_GRAY }}>
          25/12/2024
        </p>
        <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>
          Historical Range
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: Colors.DIM_LIGHT_GRAY,
          }}
        >
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Min
          </Typography>
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            $2000
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: Colors.DIM_LIGHT_GRAY,
          }}
        >
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            Max
          </Typography>
          <Typography style={{ fontSize: "11px", fontFamily: "Nunito" }}>
            $2500
          </Typography>
        </div>
      </Grid>
      <Grid
        item
        xs={3.5}
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
            style={{ display: "flex", fontSize: "11px", alignItems: "center" }}
          >
            <IconButton>
              <KeyboardArrowLeft
                sx={{ fontSize: "16px", fontFamily: "Nunito" }}
              />
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
                {personDetail?.name}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {personDetail?.email}
              </Typography>
              <Typography
                style={{
                  fontSize: "11px",
                  color: Colors.DIM_LIGHT_GRAY,
                  fontFamily: "Nunito",
                }}
              >
                {personDetail?.phone}
              </Typography>
            </div>
          </Card>
        </div>
      </Grid>
      <Grid
        item
        xs={2.5}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px",
          padding: "0px 10px",
          height: "13rem",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E5E5E5",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: Colors.WHITE,
            borderRadius: "8px",
          },
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
            }}
          >
            Other Creditors
          </p>
          <IconButton>
            <Add sx={{ fontSize: "16px", color: Colors.BLACK }} />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "11px", fontFamily: "Nunito" }}>Name</p>
          <p
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            $10000
          </p>
          <p
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            Case Code
          </p>
          <p
            style={{
              fontSize: "11px",
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
            }}
          >
            On Hold
          </p>
        </div>
      </Grid>
    </Grid>
  );
}
