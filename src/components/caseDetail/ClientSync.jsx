import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { isEmpty } from "lodash";

import { Colors } from "../../config/default";
import Button from "../button";
import { isEmailValid } from "../../common";
import { GetClientSyncEmail, SyncEasyPayEmail } from "../../services/services";
import { useToast } from "../../toast/toastContext";

function ClientSync({ handleClose, caseData }) {
  const debtorId = caseData?.debtor?._id;
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [easyPaySyncloading, setEasyPaySyncloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!isEmailValid(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };
  const isButtonDisabled = !email?.trim() || !isEmailValid(email);

  const GetClientEasyPaySync = async () => {
    setEasyPaySyncloading(true);
    const GetClientEasyPaySyncRes = await GetClientSyncEmail(debtorId);
    if (GetClientEasyPaySyncRes?.status === 200) {
      setEmail(GetClientEasyPaySyncRes?.data?.data);
    } else if (GetClientEasyPaySyncRes?.response?.status === 400) {
      const errorMessage = GetClientEasyPaySyncRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setEasyPaySyncloading(false);
  };
  useEffect(() => {
    GetClientEasyPaySync();
  }, []);

  const AddSyncEasyPayEmail = async () => {
    setLoading(true);
    const params = { email: email };
    const AddSyncClientEmailRes = await SyncEasyPayEmail(params, debtorId);
    if (AddSyncClientEmailRes?.status === 200) {
      showToast(AddSyncClientEmailRes?.data?.message, "success");
      handleClose();
    } else if (AddSyncClientEmailRes?.response?.status === 400) {
      const errorMessage = AddSyncClientEmailRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <>
      {easyPaySyncloading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "22vh",
          }}
        >
          <CircularProgress size={20} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
              Sync EasyPay Client
            </Typography>
            <Close onClick={handleClose} />
          </Box>

          <Grid xs={12} container sx={{ justifyContent: "space-between" }}>
            <Grid item xs={9}>
              <input
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Valid Email"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  outline: "none",
                  border: emailError
                    ? "1px solid red"
                    : "1px solid transparent",
                  borderRadius: "5px",
                  marginBottom: "1rem",
                  width: "100%",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                }}
              />
              {emailError && (
                <Typography
                  sx={{
                    color: "red",
                    fontSize: "0.8rem",
                    marginTop: "-0.5rem",
                  }}
                >
                  {emailError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={2.5}>
              <Button
                disabled={isButtonDisabled}
                onClick={AddSyncEasyPayEmail}
                buttonText="SYNC"
                height="2.5rem"
                width="100%"
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
                loading={loading}
                loginFont="600"
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default ClientSync;
