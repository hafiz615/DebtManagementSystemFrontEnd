import React, { useEffect, useState } from "react";
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
  Checkbox,
} from "@mui/material";
import { Colors } from "../config/default";
import TextButton from "./button";
import { UpdateCallByCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { ArrowRight, ExpandMore } from "@mui/icons-material";
import { FONT_SIZE_LARGE, FONT_SIZE_MEDIUM } from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";

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
  const [selected, setSelected] = useState([]);
  const [selectedCase, setSelectedCase] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCaseCheckboxChange = (debtor) => {
    setSelectedCase(debtor);
  };

  const handleCheckboxChange = (caseId) => {
    setSelected((prevSelected) =>
      prevSelected?.includes(caseId)
        ? prevSelected?.filter((id) => id !== caseId)
        : [...prevSelected, caseId]
    );
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
      if (!callerName) {
        setCaseMenuActive(true);
      } else if (!callerName?.caseId && callerName?.debtorId) {
        setCaseMenuActive(true);
      } else if (!callerName?.caseId && callerName?.debtorId) {
        setCaseMenuActive(true);
      } else {
        setCaseMenuActive(false);
        setIsModalOpen(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      caseIds: selected,
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

  useEffect(() => {
    setSelected([]);
  }, [selectedCase]);

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
              width: 380,
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

            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                height: "30vh",
                overflowY: "auto",
                ...ScrollbarStyles,
              }}
            >
              <div style={{ width: "48%" }}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mb: "10px",
                    fontWeight: "600",
                  }}
                >
                  Client Company Name
                </Typography>
                {Object.keys(allCases)?.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center">
                    <Checkbox
                      checked={selectedCase === item}
                      onChange={() => handleCaseCheckboxChange(item)}
                      size="small"
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: "22px" },
                        color: Colors.DIM_LIGHT_GRAY,
                        "&.Mui-checked": {
                          color: Colors.SKY_BLUE,
                        },
                      }}
                    />
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_MEDIUM }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </div>
              <div style={{ width: "48%" }}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    mb: "10px",
                    fontWeight: "600",
                  }}
                >
                  Creditor Company Name
                </Typography>
                {allCases?.[selectedCase]?.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center">
                    <Checkbox
                      checked={selected?.includes(item?.caseId)}
                      onChange={() => handleCheckboxChange(item?.caseId)}
                      size="small"
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: "22px" },
                        color: Colors.DIM_LIGHT_GRAY,
                        "&.Mui-checked": {
                          color: Colors.SKY_BLUE,
                        },
                      }}
                    />
                    <Typography
                      sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_MEDIUM }}
                    >
                      {item?.creditorCompanyName}
                    </Typography>
                  </Box>
                ))}
              </div>
            </Grid>

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
