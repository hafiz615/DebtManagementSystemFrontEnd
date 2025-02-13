import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  AccountCircle,
  Window,
  Settings,
  Group,
  Home,
  ChevronLeft,
  ChevronRight,
  People,
  Handyman,
  Mail,
  Sms,
} from "@mui/icons-material";

import ListItemText from "@mui/material/ListItemText";

import NavBar from "./navBar";
import { Colors } from "../config/default";
import BasicMenu from "./menuSimple";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, openDrawer } from "../redux/action/action";
import AppLogo from "../../src/assets/FC White.png";

const drawerWidth = 240;
const closedDrawerWidth = 60;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen * 2,
    }),
    marginLeft: `-${closedDrawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen * 2,
      }),
      marginLeft: `0`,
    }),
    ...(!open && {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen * 2,
      }),
      marginLeft: `0`,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  background: "linear-gradient(140deg, #9333EA, #1E3A8A)",
}));

export default function PersistentDrawerLeft({ children }) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const analytics = useSelector(
    (state) => state?.permissions?.permissions?.analytics
  );
  const theme = useTheme();
  const routeFound = localStorage.getItem("route");
  const [selectedItem, setSelectedItem] = useState(routeFound || "Home");
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const open = useSelector((state) => state.drawer.open);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { smsCount, emailCount } = useSelector((state) => state.counts);

  useEffect(() => {
    if (smallScreen) {
      dispatch(closeDrawer());
    } else {
      dispatch(openDrawer());
    }
  }, [smallScreen, dispatch]);

  const handleDrawerOpen = () => {
    dispatch(openDrawer());
  };

  const handleDrawerClose = () => {
    dispatch(closeDrawer());
  };

  useEffect(() => {
    const handleItemClick = (text) => {
      if (text !== "bulk-cases") {
        localStorage.removeItem("Columns");
        localStorage.removeItem("dropdownState");
        localStorage.removeItem("csvData");
      }
      localStorage.setItem("route", text);
      switch (text) {
        case "Home":
          navigate("/home");
          break;
        case "User Listing":
          navigate("/user-listing");
          break;
        case "Create New Case":
          navigate("/case-details");
          break;
        case "Settings":
          navigate("/settings");
          break;
        case "Clients":
          navigate("/client-listing");
          break;
        case "Creditors":
          navigate("/creditor-listing");
          break;
        case "Analytics":
          navigate("/analytics");
          break;
        case "bulk-cases":
          navigate("/bulk-cases");
          break;
        case "Pipelines":
          navigate("/pipelines");
          break;
        case "Mailbox":
          navigate("/inbox");
          break;
        case "Sms":
          navigate("/sms");
          break;
        default:
          break;
      }
    };

    handleItemClick(selectedItem);
  }, [selectedItem, navigate]);

  const menuItems = [
    { text: "Pipelines", icon: <Handyman /> },
    { text: "Settings", icon: <Settings /> },
    { text: "Mailbox", icon: <Mail /> },
    { text: "Sms", icon: <Sms /> },
  ];

  if (generalPermissions?.viewHomeScreen) {
    menuItems.unshift({ text: "Home", icon: <Home /> });
  }

  if (
    generalPermissions?.viewClientsForSelf ||
    generalPermissions?.viewClientsForAllUsers
  ) {
    menuItems.splice(1, 0, { text: "Clients", icon: <AccountCircle /> });
  }

  if (
    generalPermissions?.viewCreditorsForSelf ||
    generalPermissions?.viewCreditorsForAllUsers
  ) {
    menuItems.splice(2, 0, { text: "Creditors", icon: <People /> });
  }

  if (generalPermissions?.viewUserListing) {
    menuItems.splice(5, 0, { text: "User Listing", icon: <Group /> });
  }
  if (analytics?.viewAnalyticsForAllusers || analytics?.viewAnalyticsForSelf) {
    menuItems.splice(6, 0, { text: "Analytics", icon: <Window /> });
  }

  const handleLogoClick = () => {
    localStorage.setItem("route", "home");
    navigate(`/home`);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />
      <NavBar onClick={handleDrawerOpen} />
      <Drawer
        sx={{
          zIndex: 1,
          width: open ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : closedDrawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {open && (
            <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
              <img
                src={AppLogo}
                alt="laptopImage"
                style={{
                  width: "150px",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          {open ? (
            <IconButton
              size="large"
              onClick={handleDrawerClose}
              sx={{ color: Colors.SKY_BLUE }}
            >
              {theme.direction === "ltr" ? (
                <ChevronLeft
                  sx={{
                    color: Colors.WHITE,
                    backgroundColor: Colors.SKY_BLUE,
                    padding: "0.3rem",
                    borderRadius: "50%",
                    fontSize: "2.5rem",
                  }}
                />
              ) : (
                <ChevronRight
                  sx={{
                    color: Colors.WHITE,
                    backgroundColor: Colors.SKY_BLUE,
                    padding: "0.3rem",
                    borderRadius: "50%",
                    fontSize: "1.8rem",
                  }}
                />
              )}
            </IconButton>
          ) : (
            <IconButton
              size="large"
              edge="start"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
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
          )}
        </DrawerHeader>
        <Divider />

        <Box
          sx={{
            marginTop: "1.5rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(generalPermissions?.importBulkCases ||
            generalPermissions?.createNewCase) && (
            <BasicMenu
              openState={open}
              width="80%"
              backgroundColor={Colors.SKY_BLUE}
            />
          )}
        </Box>

        <List>
          {menuItems?.map(({ text, icon }, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => setSelectedItem(text)}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: selectedItem === text ? Colors.SKY_BLUE : "inherit",
                  ":hover": {
                    backgroundColor: Colors.WHITE,
                    color: Colors.SKY_BLUE,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      selectedItem === text
                        ? Colors.SKY_BLUE
                        : Colors.DIM_LIGHT_GRAY,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    opacity: open ? 1 : 0,
                    fontFamily: "Nunito !important",
                    color:
                      selectedItem === text
                        ? Colors.SKY_BLUE
                        : Colors.DARK_GRAY,
                  }}
                />
                {(text === "Mailbox" && emailCount > 0) ||
                (text === "Sms" && smsCount > 0) ? (
                  <ListItemText
                    primary={
                      text === "Mailbox"
                        ? `(${emailCount})`
                        : text === "Sms"
                        ? `(${smsCount})`
                        : ""
                    }
                    sx={{
                      opacity: open ? 1 : 0,
                      fontFamily: "Nunito !important",
                      color: Colors.ORANGE_COLOR,
                    }}
                  />
                ) : (
                  ""
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
