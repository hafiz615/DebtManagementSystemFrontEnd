import { Box, Fade } from "@mui/material";
import { useSelector } from "react-redux";
import { Colors } from "../config/default";
import { TelnyxRTCProvider } from "@telnyx/react-client";
import Phone from "./phone";

const DialPad = () => {
  const modalState = useSelector((state) => state?.dial?.isModalOpen);
  const caseId = useSelector((state) => state?.dial?.caseId);
  const phoneNumberState = useSelector((state) => state?.dial?.phoneNumber);
  const user = useSelector((state) => state?.signIn?.signIn?.user);

  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0ZWxueXhfdGVsZXBob255IiwiZXhwIjoxNzUwMjI4OTY0LCJpYXQiOjE3NTAxNDI1NjQsImlzcyI6InRlbG55eF90ZWxlcGhvbnkiLCJqdGkiOiJmZGVkODRlYi1jNGU3LTRjYzQtYWUwZi1hMzk4MDUyYWM0NjgiLCJuYmYiOjE3NTAxNDI1NjMsInN1YiI6ImU4MWExMjI5LTMwYmYtNDBjMi04ZWIyLTk1NzQ4YzMzNzM0ZiIsInRlbF90b2tlbiI6IkE5elF1QVNhb3k1b3BxRVpZNGFMY3NPV0pHYnZNV3E4Njc1MXNKOG1IcFRtUVNDa0dYVHBlZUdQYjJfY3dWZHdBbWJQNzZ0dVc0U0RtTjNRcGc3ZWRwUzdfdlkzMFhDOEdCX1dpRV80dFNiUGNRUzc1NmNjMlpJaFpUdXFqVFdQUXNFRUtWd2xjNHpSUGlBeEVVV2hJMWNvIiwidHlwIjoiYWNjZXNzIn0.NXcGNpWsDAX3i6epgO14Qo0P13pu1Z0tCEZgG5DLFYsP07fmnS22i5HAlgPkk4rDQPJtySQbSu1UxshBx3S6_Q";

  const credential = {
    login_token: token,
  };

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
          <TelnyxRTCProvider credential={credential}>
            <Phone
              user={user}
              caseId={caseId}
              phoneNumberState={phoneNumberState}
            />
          </TelnyxRTCProvider>
        </Box>
      </Fade>
    )
  );
};

export default DialPad;
