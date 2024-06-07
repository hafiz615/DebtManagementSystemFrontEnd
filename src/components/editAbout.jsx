import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import TextButton from "./button";
import { GetAllUsers, UpdateCaseAbout } from "../services/services";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useToast } from "../toast/toastContext";

export default function EditAbout({ handleClose, data, GetCaseDetails }) {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status || "");
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();
  const statusMenuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankrupcy", value: "Declared Bankrupcy" },
  ];

  const [caseOwner, setCaseOwner] = useState(data?.caseOwner || "");
  const [manager, setManager] = useState(data?.manager || "");
  const [negotiator, setNegotiator] = useState(data?.negotiator || "");
  const { showToast } = useToast();

  const GetUsers = async () => {
    setLoading(true);
    const users = await GetAllUsers();
    if (users?.status === 200) {
      const transformArray = (data) => {
        return data?.map((item) => ({
          label: item?.name,
          value: item?.name,
        }));
      };
      const transformedArray = isEmpty(users?.data?.data)
        ? []
        : transformArray(users?.data?.data);
      setUserArray(transformedArray);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetUsers();
  }, []);
  const handleUpdate = async () => {
    setUpdating(true);
    const params = {
      status: status,
      caseOwner: caseOwner,
      manager: manager,
      negotiator: negotiator,
    };
    const res = await UpdateCaseAbout(params, id);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      handleClose();
      GetCaseDetails(id);
    } else {
      showToast(res?.response?.data?.message || res?.data?.message, "error");
    }
    setUpdating(false);
  };
  return (
    <>
      <Box
        onClick={handleClose}
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Close />
      </Box>
      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px",
          marginTop: { xs: ".5rem", xl: "0rem" },
          backgroundColor: Colors.WHITE,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            fontSize: 20,
            marginBottom: "1rem",
          }}
        >
          Edit Information
        </Typography>
        {loading ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "29vh",
            }}
          >
            <CircularProgress size={90} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <>
            <Grid
              container
              item
              xs={12}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item xs={12} md={5.5}>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontFamily: "Nunito",
                    marginLeft: "1rem",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Status
                </Typography>
                <Dropdown
                  menuWidth="20.5rem"
                  menuItems={statusMenuItems}
                  placeholder="Status"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="100%"
                  selectedValue={status}
                  setSelectedValue={setStatus}
                />
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontFamily: "Nunito",
                    marginLeft: "1rem",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Case Owner
                </Typography>
                <Dropdown
                  disabled={isEmpty(userArray)}
                  menuWidth="20.5rem"
                  menuItems={userArray}
                  placeholder="Case Owner"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="100%"
                  selectedValue={caseOwner}
                  setSelectedValue={setCaseOwner}
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ justifyContent: "space-between", marginTop: ".5rem" }}
            >
              <Grid item xs={12} md={5.5}>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontFamily: "Nunito",
                    marginLeft: "1rem",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Negotiator
                </Typography>
                <Dropdown
                  disabled={isEmpty(userArray)}
                  menuWidth="20.5rem"
                  menuItems={userArray}
                  placeholder="Negotiator"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="100%"
                  selectedValue={negotiator}
                  setSelectedValue={setNegotiator}
                />
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontFamily: "Nunito",
                    marginLeft: "1rem",
                    color: Colors.DARK_GRAY,
                  }}
                >
                  Manager
                </Typography>
                <Dropdown
                  disabled={isEmpty(userArray)}
                  menuWidth="20.5rem"
                  menuItems={userArray}
                  placeholder="Manager"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="100%"
                  selectedValue={manager}
                  setSelectedValue={setManager}
                />
              </Grid>
            </Grid>
            <Grid
              container
              xs={12}
              sx={{
                marginTop: "1.5rem",
                marginBottom: "1rem",
                justifyContent: "right",
              }}
            >
              <TextButton
                disabled={
                  status === "" ||
                  manager === "" ||
                  negotiator === "" ||
                  caseOwner === ""
                }
                loading={updating}
                buttonText="UPDATE"
                height="2rem"
                width="8rem"
                onClick={handleUpdate}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
