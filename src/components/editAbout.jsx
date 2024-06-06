import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import TextButton from "./button";
import { GetAllUsers } from "../services/services";

export default function EditAbout({ handleClose }) {
  const menuItems = [{ label: "Case", value: "case" }];
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const GetUsers = async () => {
    setLoading(true);
    const users = await GetAllUsers();
    if (users?.status === 200) {
      setUserArray(users?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetUsers();
  }, []);
  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>
      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: 20,
            marginBottom: "1rem",
          }}
        >
          Edit Information
        </Typography>
        <Grid container item xs={12} sx={{ justifyContent: "space-between" }}>
          <Grid item xs={12} md={5.5}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Status
            </Typography>
            <Dropdown
              menuWidth="20.5rem"
              menuItems={menuItems}
              placeholder="Status"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="100%"
              selectedValue={status}
              setSelectedValue={setStatus}
            />
          </Grid>
          <Grid item xs={12} md={5.5}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Case Owner
            </Typography>
            <Dropdown
              menuWidth="20.5rem"
              menuItems={menuItems}
              placeholder="Case Owner"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="100%"
              selectedValue={status}
              setSelectedValue={setStatus}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{ justifyContent: "space-between", marginTop: ".5rem" }}
        >
          <Grid item xs={12} md={5.5}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Negotiator
            </Typography>
            <Dropdown
              menuWidth="20.5rem"
              menuItems={menuItems}
              placeholder="Negotiator"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="100%"
              selectedValue={status}
              setSelectedValue={setStatus}
            />
          </Grid>
          <Grid item xs={12} md={5.5}>
            <Typography
              sx={{
                fontWeight: "500",
                fontFamily: "Nunito",
                marginLeft: "1rem",
                color: Colors.DARK_GRAY,
              }}
            >
              Manager
            </Typography>
            <Dropdown
              menuWidth="20.5rem"
              menuItems={menuItems}
              placeholder="Manager"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="100%"
              selectedValue={status}
              setSelectedValue={setStatus}
            />
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          sx={{
            marginTop: "1.5rem",
            marginBottom: "1rem",
            justifyContent: "right",
          }}
        >
          <TextButton
            buttonText="UPDATE"
            height="2rem"
            width="8rem"
            onClick={handleClose}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
          />
        </Grid>
      </Grid>
    </>
  );
}
