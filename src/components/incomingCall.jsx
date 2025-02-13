import React, { useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import {
  Button,
  Grid,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  Menu,
  Popover,
  MenuItem,
} from "@mui/material";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateCallByCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";

const divStyling = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: Colors.BG_LIGHT_GRAY,
  borderRadius: "5px",
  border: `2px solid  ${Colors.SKY_BLUE}`,
  height: "2.5rem",
  cursor: "pointer",
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  padding: "0px 10px",
  width: "100%",
  marginBottom: "auto",
};

export default function IncomingCall({
  incomingCall,
  setIncomingCall,
  isModalOpen,
  setIsModalOpen,
  callDuration,
  setCallDuration,
  callInterval,
  setCallInterval,
  allCases,
  callSid,
  caseMenuActive,
  setCaseMenuActive,
  callerName,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCase, setSelectedCase] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleOpenSubMenu = (event, category) => {
    setSubMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClick = (selectedCategory) => {
    setSubMenuAnchorEl(null);
    setAnchorEl(null);
    setSelectedCase(selectedCategory);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      incomingCall.accept();
      setCallDuration(0);
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setCallInterval(interval);
    }
  };

  const rejectIncomingCall = () => {
    if (incomingCall) {
      incomingCall.reject();
      setIncomingCall(null);
      setIsModalOpen(false);
      clearInterval(callInterval);
      setCallInterval(null);
      setCaseMenuActive(false);
    }
  };

  const endCall = () => {
    if (incomingCall) {
      incomingCall.disconnect();
      clearInterval(callInterval);
      setCallInterval(null);
      setCallDuration(0);
      setCaseMenuActive(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      caseId: selectedCase?.caseId,
    };
    const res = await UpdateCallByCase(payload, callSid);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      setIsModalOpen(false);
      setCaseMenuActive(false);
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={rejectIncomingCall}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isModalOpen}>
        {caseMenuActive ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
              border: "none",
              textAlign: "center",
            }}
          >
            <Typography sx={{ mb: 3, fontFamily: "Nunito" }}>
              Save Call Log
            </Typography>
            <div
              style={divStyling}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <span>{selectedCase?.creditorCompanyName || "Select Case"}</span>
              <span style={{ marginTop: "5px" }}>
                <ExpandMore />
              </span>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              {Object.entries(allCases)?.map(([key, value]) => (
                <MenuItem
                  key={key}
                  onClick={(event) => handleOpenSubMenu(event, value)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: FONT_SIZE_MEDIUM,
                    fontFamily: "Nunito",
                  }}
                >
                  {key}
                  <ArrowRight />
                </MenuItem>
              ))}
            </Menu>

            {/* Popover for second-level dropdown */}
            <Popover
              anchorEl={subMenuAnchorEl}
              open={Boolean(subMenuAnchorEl)}
              onClose={() => setSubMenuAnchorEl(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <Grid
                sx={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}
              >
                {selectedCategory &&
                  selectedCategory?.map((caseItem) => (
                    <Button
                      key={caseItem.caseId}
                      sx={{
                        textAlign: "left",
                        width: "100%",
                        color: Colors.BLACK,
                        fontSize: FONT_SIZE_MEDIUM,
                        fontFamily: "Nunito",
                      }}
                      onClick={() => handleMenuClick(caseItem)}
                    >
                      {caseItem.creditorCompanyName}
                    </Button>
                  ))}
              </Grid>
            </Popover>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <TextButton
                buttonText="Save"
                height="2rem"
                width="10rem"
                onClick={handleSave}
                loading={loading}
                disabled={!selectedCase}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </div>
          </Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
              border: "none",
              textAlign: "center",
            }}
          >
            {!callInterval && (
              <Typography variant="h6" sx={{ mb: 2, fontFamily: "Nunito" }}>
                Incoming Call
              </Typography>
            )}
            <Typography variant="body1" sx={{ fontFamily: "Nunito" }}>
              {callerName?.debtorName ||
                callerName?.creditorName ||
                "Unknown Caller"}
            </Typography>
            {callerName?.companyName && (
              <Typography variant="body1" sx={{ fontFamily: "Nunito" }}>
                {callerName?.companyName}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 3, fontFamily: "Nunito" }}>
              {incomingCall?.parameters?.From?.replace(/^client:/, "")}
            </Typography>
            {callInterval ? (
              <Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontFamily: "Nunito" }}
                >
                  {formatDuration(callDuration)}
                </Typography>
                <Button
                  variant="contained"
                  onClick={endCall}
                  sx={{
                    fontFamily: "Nunito",
                    borderRadius: "10px",
                    backgroundColor: Colors.ORANGE_COLOR,
                    textTransform: "none",
                    "&:hover": {
                      background: Colors.ORANGE_COLOR,
                    },
                  }}
                  startIcon={<CallEndIcon />}
                >
                  End Call
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      fontFamily: "Nunito",
                      borderRadius: "10px",
                      backgroundColor: Colors.SKY_BLUE,
                      textTransform: "none",
                      "&:hover": {
                        background: Colors.SKY_BLUE,
                      },
                    }}
                    onClick={acceptIncomingCall}
                    startIcon={<CallIcon />}
                  >
                    Accept
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      fontFamily: "Nunito",
                      borderRadius: "10px",
                      backgroundColor: Colors.ORANGE_COLOR,
                      textTransform: "none",
                      "&:hover": {
                        background: Colors.ORANGE_COLOR,
                      },
                    }}
                    onClick={rejectIncomingCall}
                    startIcon={<CallEndIcon />}
                  >
                    Reject
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Fade>
    </Modal>
  );
}
