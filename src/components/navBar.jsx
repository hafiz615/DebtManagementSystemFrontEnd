import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { Box, Tooltip } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Colors } from "../config/default";
import { Logout } from "../services/services";
import { Typography } from "@mui/material";
import { FONT_SIZE_XXL } from "../constants/appConstants";
import AppLogo from "../../src/assets/FC White.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";

export default function NavBar({ onClick }) {
  const navigate = useNavigate();
  const drawerOpen = useSelector((state) => state.drawer.open);

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const widthStyling = drawerOpen
    ? "calc(100vw - 250px - 4rem)"
    : "calc(100vw - 70px - 4rem)";

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
          background: Colors.GRADIENT,
          height: "4rem",
          zIndex: 1,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <div
            style={{
              display: "flex",
              width: widthStyling,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={AppLogo}
              alt="laptopImage"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
            />

            <Tooltip title="logout" placement="top-end">
              <IconButton
                onClick={handleLogout}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                sx={{
                  color: Colors.WHITE,
                }}
              >
                <LogoutIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
