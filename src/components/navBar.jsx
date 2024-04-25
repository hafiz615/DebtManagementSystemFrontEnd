import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

import { Colors } from "../config/default";

export default function NavBar({ onClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new info" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

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

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new info"
              sx={{ color: Colors.SKY_BLUE }}
            >
              <Badge badgeContent={4} color="error">
                <InfoOutlinedIcon
                  sx={{
                    color: Colors.WHITE,
                    backgroundColor: Colors.SKY_BLUE,
                    padding: "0.3rem",
                    borderRadius: "50%",
                    fontSize: "2.5rem",
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              sx={{ color: Colors.SKY_BLUE }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsNoneOutlinedIcon
                  sx={{
                    color: Colors.WHITE,
                    backgroundColor: Colors.SKY_BLUE,
                    padding: "0.3rem",
                    borderRadius: "50%",
                    fontSize: "2.5rem",
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
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
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              sx={{ color: Colors.SKY_BLUE }}
            >
              <MoreIcon
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
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
