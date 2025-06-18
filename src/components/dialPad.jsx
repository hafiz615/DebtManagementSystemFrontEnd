import { Box, CircularProgress, Fade, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { Colors } from "../config/default";
import { TelnyxRTCProvider } from "@telnyx/react-client";
import Phone from "./phone";
import { GetTelnyxPhoneNumber, GetTelnyxToken } from "../services/services";
import { useEffect, useState } from "react";

const DialPad = () => {
  const [token, setToken] = useState();
  const [fromNumber, setFromNumber] = useState();
  const modalState = useSelector((state) => state?.dial?.isModalOpen);
  const caseId = useSelector((state) => state?.dial?.caseId);
  const phoneNumberState = useSelector((state) => state?.dial?.phoneNumber);
  const user = useSelector((state) => state?.signIn?.signIn?.user);

  const getToken = async () => {
    const res = await GetTelnyxToken();
    if (res?.status === 201) {
      setToken(res?.data?.data);
    }
  };

  const getTelnyxPhoneNumber = async () => {
    const res = await GetTelnyxPhoneNumber();
    if (res?.status) {
      setFromNumber(res?.data?.data);
    }
  };

  useEffect(() => {
    if (modalState) {
      getToken();
      getTelnyxPhoneNumber();
    } else {
      setToken("");
    }
  }, [modalState]);

  return (
    modalState && (
      <Fade in={modalState}>
        <Box
          sx={{
            position: "fixed",
            bottom: "2%",
            right: "1%",
            width: 300,
            bgcolor: Colors.lIGHT_PURPLE,
            borderRadius: "10px",
            boxShadow: 24,
            p: 2,
            border: `2px solid ${Colors.SKY_BLUE}`,
            textAlign: "center",
            zIndex: 1300,
            pointerEvents: "auto",
          }}
        >
          {!token ? (
            <Grid
              sx={{
                height: "40vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress sx={{ color: Colors.SKY_BLUE }} size={40} />
            </Grid>
          ) : (
            <TelnyxRTCProvider credential={{ login_token: token }}>
              <Phone
                user={user}
                fromNumber={fromNumber}
                caseId={caseId}
                phoneNumberState={phoneNumberState}
              />
            </TelnyxRTCProvider>
          )}
        </Box>
      </Fade>
    )
  );
};

export default DialPad;
