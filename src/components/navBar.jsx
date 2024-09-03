import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Colors } from "../config/default";
import { Logout } from "../services/services";
import { Typography } from "@mui/material";
import { FONT_SIZE_XXL } from "../constants/appConstants";

export default function NavBar({ onClick }) {
  const navigate = useNavigate();
  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  // Function to clear all cache (localStorage, sessionStorage)
  const clearAllCache = () => {
    localStorage.clear();
    sessionStorage.clear();
  };
  const handleLogout = async () => {
    const response = await Logout();
    if (response.status === 200) {
      localStorage.clear();
      navigate("/");
    }

    clearAllCache();
    deleteAllCookies();
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: Colors.NAVY_BLUE,
          height: "4rem",
          zIndex: 1,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={handleLogout}
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            sx={{
              color: Colors.WHITE,
              borderRadius: "50%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_XXL,
                fontWeight: "600",
              }}
              onClick={handleLogout}
            >
              LOGOUT
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
