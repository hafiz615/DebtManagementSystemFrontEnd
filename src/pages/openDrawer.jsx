import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
// import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  AccountCircle,
  Window,
  Settings,
  Group,
  Assessment,
  Home,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

import NavBar from "../components/navBar";
import Dashboard from "./dashboard";
import { Colors } from "../config/default";
import DropDown from "../components/menuSimple";
import AnchorTemporaryDrawer from "../components/rightDrawer";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  backgroundColor: Colors.NAVY_BLUE,
}));
const icons = [
  <Window />,
  <Home />,
  <AccountCircle />,
  <Settings />,
  <Group />,
  <Assessment />,
];
export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState("");
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const largeScreen = useMediaQuery("(min-width:1550px)");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (text) => {
    setSelectedItem(text);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavBar onClick={handleDrawerOpen} />
      {/* <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
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
          <DropDown />
        </Box>

        <List sx={{ marginLeft: "0.5rem" }}>
          {[
            "Dashboard",
            "Home",
            "Clients",
            "Settings",
            "User Listing",
            "Reports",
          ]?.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(text)}
                sx={{
                  color: selectedItem === text ? Colors.SKY_BLUE : "inherit",
                  ":hover": {
                    backgroundColor: Colors.WHITE,
                    color: Colors.SKY_BLUE,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
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
      <Main
        open={open}
        sx={{
          backgroundColor: Colors.LIGHT_GRAY,
          height: "100vh",
          position: "relative",
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            transform: "rotate(270deg)",
            position: "absolute",
            top: smallScreen || largeScreen ? "17%" : "35%",
            right: -40,
            zIndex: "999",
            backgroundColor: Colors.WHITE,
            color: Colors.BLACK,
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <AnchorTemporaryDrawer />
        </Box>
        <Dashboard />
      </Main>
    </Box>
  );
}
