import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Menu,
  Popover,
  MenuItem,
  Button,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import TextButton from "./button";
import {
  GetAllUsers,
  UpdateCaseAbout,
  GetAllStatuses,
} from "../services/services";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useToast } from "../toast/toastContext";
import ScrollbarStyles from "../components/customScroll";
import { FONT_SIZE_LARGE } from "../constants/appConstants";
import { ArrowRight, ExpandMore } from "@mui/icons-material";

const fontStyling = { fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito" };
const divStyling = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: Colors.BG_LIGHT_GRAY,
  color: Colors.DARK_GRAY,
  borderRadius: "5px",
  height: "2.5rem",
  cursor: "pointer",
  fontSize: FONT_SIZE_LARGE,
  fontFamily: "Nunito",
  padding: "0px 10px",
  width: "100%",
  // marginBottom: headerName ? "0.8rem" : "auto",
};
const buttonStyling = {
  textTransform: "none",
  color: Colors.DARK_GRAY,
  fontFamily: "Nunito",
  fontSize: FONT_SIZE_LARGE,
  textAlign: "left",
};

export default function EditAbout({ handleClose, data, GetCaseDetails }) {
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status || "");
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const GetStatuses = async () => {
    const AllStatuses = await GetAllStatuses();
    if (AllStatuses?.status === 200) {
      setMenuItems(AllStatuses?.data?.data?.status);
    }
  };

  const menu = menuItems?.map((name) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    GetStatuses();
  }, []);

  const [caseOwner, setCaseOwner] = useState(data?.caseOwner || "");
  const [manager, setManager] = useState(data?.manager || "");
  const [negotiator, setNegotiator] = useState(data?.negotiator || "");
  const [managerId, setManagerId] = useState(data?.managerId || "");
  const [negotiatorId, setNegotiatorId] = useState(data?.negotiatorId || "");
  const [caseOwnerId, setCaseOwnerId] = useState(data?.caseOwnerId || "");

  const pipleStatudRes = data?.pipelineStatus;
  const pipelineStatus = pipleStatudRes || [];
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(data?.status || "");
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleOpenSubMenu = (event, category) => {
    setSubMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClick = (statusName) => {
    setSelectedStatus(statusName);
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const { showToast } = useToast();

  const GetUsers = async () => {
    setLoading(true);
    let payload = {};
    const users = await GetAllUsers(0, 0, false, false, payload);

    if (users?.status === 200) {
      const transformArray = (data) => {
        return data?.map((item) => ({
          label: item?.name,
          value: item?.name,
          id: item?._id,
        }));
      };

      const transformedArray = isEmpty(users?.data?.data?.users)
        ? []
        : transformArray(users?.data?.data?.users);

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
      status: selectedStatus,
      caseOwner: caseOwner,
      manager: manager,
      negotiator: negotiator,
      caseOwnerId: caseOwnerId,
      negotiatorId: negotiatorId,
      managerId: managerId,
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
          justifyContent: "space-between",
          marginBottom: "1rem",
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
                  Select Pipeline Status
                </Typography>
                <div>
                  <div
                    style={divStyling}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <span>{`${selectedStatus || data?.status}`}</span>
                    <span style={{ marginTop: "5px" }}>
                      <ExpandMore />
                    </span>
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    {pipelineStatus?.map((pipeline) => (
                      <MenuItem
                        key={pipeline?.pipeline}
                        onClick={(event) =>
                          handleOpenSubMenu(event, pipeline?.pipeline)
                        }
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: "Nunito",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        {pipeline?.pipeline}
                        <ArrowRight />
                      </MenuItem>
                    ))}
                  </Menu>

                  <Popover
                    anchorEl={subMenuAnchorEl}
                    open={Boolean(subMenuAnchorEl)}
                    onClose={() => setSubMenuAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Grid
                      sx={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        ...ScrollbarStyles,
                      }}
                    >
                      {selectedCategory &&
                        pipelineStatus
                          ?.find(
                            (pipeline) =>
                              pipeline?.pipeline === selectedCategory
                          )
                          ?.status?.map((status, index) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Button
                                key={index}
                                sx={buttonStyling}
                                onClick={() => {
                                  handleMenuClick(
                                    status?.name,
                                    selectedCategory
                                  );
                                  handleCloseMenu();
                                }}
                              >
                                {status?.name}
                              </Button>
                            </div>
                          ))}
                    </Grid>
                  </Popover>
                </div>
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
                  CSM
                </Typography>
                <Dropdown
                  disabled={isEmpty(userArray)}
                  menuWidth="20.5rem"
                  menuItems={userArray}
                  placeholder="CSM"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="100%"
                  selectedValue={caseOwner}
                  setSelectedValue={setCaseOwner}
                  show="editAbout"
                  setId={setCaseOwnerId}
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
                  show="editAbout"
                  setId={setNegotiatorId}
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
                  show="editAbout"
                  setId={setManagerId}
                />
              </Grid>
            </Grid>
            <Grid
              container
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
