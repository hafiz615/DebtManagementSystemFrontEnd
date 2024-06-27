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
} from "@mui/icons-material";

import ListItemText from "@mui/material/ListItemText";

import NavBar from "./navBar";
import { Colors } from "../config/default";
import BasicMenu from "./menuSimple";

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
  backgroundColor: Colors.NAVY_BLUE,
}));

const icons = [
  <Home />,
  <AccountCircle />,
  <People />,
  <Settings />,
  <Group />,
  <Window />,
];

export default function PersistentDrawerLeft({ children }) {
  const theme = useTheme();
  const routeFound = localStorage.getItem("route");
  const [selectedItem, setSelectedItem] = useState(routeFound || "Home");
  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:760px)");
  const [open, setOpen] = useState(smallScreen ? false : true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
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

        default:
          break;
      }
    };

    handleItemClick(selectedItem);
  }, [selectedItem, navigate]);

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
          <BasicMenu
            openState={open}
            width="80%"
            backgroundColor={Colors.SKY_BLUE}
          />
        </Box>

        <List>
          {[
            "Home",
            "Clients",
            "Creditors",
            "Settings",
            "User Listing",
            "Analytics",
          ]?.map((text, index) => (
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
                  {icons[index]}
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
