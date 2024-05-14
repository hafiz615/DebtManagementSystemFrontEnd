import * as React from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { Colors } from "../config/default";

export default function NavBar({ onClick }) {
  const navigate = useNavigate();
  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: Colors.NAVY_BLUE,
          height: "4rem",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            onClick={onClick}
            sx={{ color: Colors.SKY_BLUE }}
          >
            <MenuIcon
              sx={{
                color: Colors.WHITE,
                backgroundColor: Colors.SKY_BLUE,
                padding: "0.3rem",
                borderRadius: "50%",
                fontSize: "2.5rem",
              }}
            />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <IconButton
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              sx={{ color: Colors.SKY_BLUE }}
            >
              <AccountCircle
                sx={{
                  color: Colors.WHITE,
                  backgroundColor: Colors.SKY_BLUE,
                  padding: "0.3rem",
                  borderRadius: "50%",
                  fontSize: "2.5rem",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
