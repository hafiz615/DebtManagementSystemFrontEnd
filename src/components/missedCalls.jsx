import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Colors } from "../config/default";
import ScrollbarStyles from "./customScroll";
import { useNavigate } from "react-router-dom";
import { FONT_SIZE_LARGE, FONT_SIZE_SMALL } from "../constants/appConstants";
import {
  GetAllNotifications,
  GetMissedCalls,
  MarkAsReadNotifications,
} from "../services/services";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import { formatDateString } from "../common";

const MissedCalls = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missedCallList, setMissedCallsList] = useState(false);
  const navigate = useNavigate();

  const handleOpen = async (event) => {
    setLoading(true);
    setAnchorEl(event.currentTarget);
    const res = await GetMissedCalls();
    if (res?.status === 200) {
      setMissedCallsList(res?.data?.data);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRowClick = async (caseId) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${caseId}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <PhoneMissedIcon sx={{ color: Colors.WHITE }} />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "600",
            p: "10px 0px",
            backgroundColor: Colors.BG_LIGHT_GRAY,
          }}
        >
          Missed Calls
        </Typography>

        {loading ? (
          <List
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 350,
              height: 350,
              overflow: "auto",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              ...ScrollbarStyles,
            }}
          >
            <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
          </List>
        ) : (
          <List
            sx={{
              width: 350,
              maxHeight: 350,
              overflow: "auto",
              backgroundColor: Colors.BG_LIGHT_GRAY,
              ...ScrollbarStyles,
            }}
          >
            {missedCallList?.length > 0 ? (
              missedCallList?.map((missedCalls, index) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() =>
                    missedCalls?.caseId
                      ? handleRowClick(missedCalls?.caseId)
                      : undefined
                  }
                  key={index}
                  divider
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      <PhoneMissedIcon
                        sx={{
                          color: Colors.ORANGE_COLOR,
                          fontSize: "16px",
                          mr: "10px",
                        }}
                      />
                      {missedCalls?.from}
                    </Typography>

                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      {formatDateString(missedCalls?.time)}
                    </Typography>
                  </div>
                  <div style={{ width: "100%" }}>
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
                    >
                      {missedCalls?.companyName}
                    </Typography>
                  </div>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No Missed Calls
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Popover>
    </div>
  );
};

export default MissedCalls;
