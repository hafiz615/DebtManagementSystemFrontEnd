import * as React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";

import { Grid, IconButton, Typography, Menu, Box } from "@mui/material";

import { Colors } from "../config/default";
import BasicModal from "./customPopup";
// import DataTable from "./table";
import { GetAllUsers, ResendInvite } from "../services/services";
import UserListTable from "./userListTable";
import SearchBar from "./searchBar";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import TextButton from "./button";
import CustomTextField from "./customTextfield";
import Dropdown from "./dropdown";
import { useToast } from "../toast/toastContext";

const columns = [
  {
    field: "name",
    headerName: "Name",
  },
  {
    field: "dob",
    headerName: "DOB",
  },
  {
    field: "gender",
    headerName: "Gender",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "ssid",
    headerName: "SSN",
  },
  {
    field: "role",
    headerName: "Role",
  },
  {
    field: "phone",
    headerName: "Phone #",
  },
  {
    field: "address",
    headerName: "Address",
  },
  {
    field: "active",
    headerName: "Status",
  },
];
export default function CustomizedTabs() {
  const navigate = useNavigate();
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );

  const [rows, setRows] = useState([]);
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationRows, setPaginationRows] = useState("5");
  const totalPages = Math.ceil(totalData / paginationRows);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [dateOfBirthStart, setDateOfBirthStart] = useState("");
  const [dateOfBirthEnd, setDateOfBirthEnd] = useState("");
  const [applyDisabled, setApplyDisabled] = useState(true);
  const [saveState, setSaveState] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { showToast } = useToast();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split(".")[0] + ".000Z";
  };

  const activeStatusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const createFilterObject = (dateOfBirthStart, dateOfBirthEnd) => {
    const filter = {};
    if (
      dateOfBirthStart !== null &&
      dateOfBirthStart !== "" &&
      dateOfBirthEnd !== null &&
      dateOfBirthEnd !== ""
    ) {
      filter.dateOfBirth = {
        start: formatDate(dateOfBirthStart),
        end: formatDate(dateOfBirthEnd),
      };
    }
    if (active != null) {
      filter.isActive = active === "Active" ? true : false;
    }

    return filter;
  };

  const GetUsers = async (search, filter) => {
    setLoading(true);
    let payload = {};
    const filterObj = createFilterObject(dateOfBirthStart, dateOfBirthEnd);
    payload = {
      text: search ? searchText : "",
      filter: filter ? filterObj : {},
    };
    let page = currentPage;
    const users = await GetAllUsers(
      page,
      paginationRows,
      search,
      filter,
      payload
    );
    if (users?.status === 200) {
      setUserArray(users?.data?.data?.users);
      setTotalData(users?.data?.data?.totalUsers);
    } else if (
      users?.response?.status === 401 ||
      users?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchText) {
      setSearchActive(false);
    }
    if (searchText) {
      setSearchActive(true);
      GetUsers(searchActive, filterActive);
    } else if (filterActive) {
      GetUsers(searchActive, filterActive);
    } else if (!searchText && !filterActive) {
      GetUsers(false, false);
    }
  }, [currentPage, searchText, saveState, filterActive, searchActive]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterActive, searchActive]);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    handleClose();
    setSaveState(!saveState);
    setFilterActive(true);
  };

  const handleClear = () => {
    setDateOfBirthStart("");
    setDateOfBirthEnd("");
    setActive("");
    setFilterActive(false);
    handleClose();
    GetUsers(searchActive, false);
  };

  const disabled = !dateOfBirthStart && !dateOfBirthEnd && !active;

  const isPairComplete = (min, max) => {
    return (min !== "" && max !== "") || (min === "" && max === "");
  };

  useEffect(() => {
    const allPairsValid =
      isPairComplete(dateOfBirthStart, dateOfBirthEnd) &&
      isPairComplete(active);
    const anyPairFilled =
      (dateOfBirthStart !== "" && dateOfBirthEnd !== "") || active !== "";

    setApplyDisabled(!(allPairsValid && anyPairFilled));
  }, [dateOfBirthStart, dateOfBirthEnd, active]);

  const generatedData = useMemo(() => {
    return userArray?.map((item, index) => ({
      id: item?._id,
      name: item?.name || "-",
      dob: new Date(item?.dateOfBirth).toLocaleDateString() || "-",
      gender: item?.gender || "-",
      email: item?.email || "-",
      ssid: item?.SSID || "-",
      role: item?.role || "-",
      phone: item?.phone || "-",
      address: item?.address || "-",
      active: item?.isActive ? "Active" : "Inactive",
    }));
  }, [userArray]);

  useEffect(() => {
    setRows(generatedData);
  }, [generatedData, userArray]);

  const handleUserDelete = (deletedUserId) => {
    setUserArray((prevUserArray) =>
      prevUserArray.filter((user) => user._id !== deletedUserId)
    );
  };

  useEffect(() => {
    setCurrentPage(1);
    GetUsers("", "");
  }, [paginationRows]);

  const handleResendInvite = async (row) => {
    const payload = {
      email: row?.email,
    };
    const res = await ResendInvite(payload);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
    }
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: { xs: "unset", sm: "space-between" },
          alignItems: { xs: "unset", sm: "center" },
          gap: { xs: "1rem", sm: "0" },
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Typography
          sx={{
            paddingLeft: "0.8rem",
            paddingRight: "0.8rem",
            bgcolor: Colors.WHITE,
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            fontWeight: "600",
            fontSize: FONT_SIZE_LARGE,
            marginLeft: "2.5rem",
            height: "3.5rem",
            width: "6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Nunito",
          }}
        >
          User List
        </Typography>
        <Grid
          container
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-end" },
            gap: "10px",
          }}
        >
          {generalPermissions?.addNewUser && (
            <BasicModal
              modelButton="ADD USERS"
              modalType="add"
              GetUsers={GetUsers}
            />
          )}
          <Box sx={{ display: "flex" }}>
            <SearchBar
              searchCheck={true}
              searchingText={searchText}
              handleKeyPress={handleKeyPress}
              placeholder="Search User..."
            />
            <IconButton
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FilterListOutlinedIcon
                sx={{
                  color: Colors.DARK_GRAY,
                  fontSize: { xs: "20px", sm: "30px" },
                }}
              />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <>
          <UserListTable
            apiPagination={true}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            requiredCustomFieldIcons={true}
            rows={rows}
            columns={columns}
            handleUserDelete={handleUserDelete}
            GetUsers={GetUsers}
            loading={loading}
            setPaginationRows={setPaginationRows}
            paginationRows={paginationRows}
            handleResendInvite={handleResendInvite}
          />
          {/* <DataTable rows={rows} columns={columns} /> */}
        </>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "12px",
            },
          }}
        >
          <Grid sx={{ padding: ".5rem .75rem", width: "16rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_XL,
                fontWeight: "600",
              }}
            >
              Filter
            </Typography>
            <p
              style={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                margin: "5px 0px",
              }}
            >
              Date Of Birth
            </p>
            <CustomTextField
              type="date"
              width="100%"
              paddingLeft="4px"
              onChange={(e) => setDateOfBirthStart(e.target.value)}
              value={dateOfBirthStart}
            />
            <CustomTextField
              type="date"
              width="100%"
              paddingLeft="4px"
              onChange={(e) => setDateOfBirthEnd(e.target.value)}
              value={dateOfBirthEnd}
            />
            <Dropdown
              menuWidth="10rem"
              menuItems={activeStatusOptions}
              placeholder="Status"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="100%"
              selectedValue={active}
              setSelectedValue={setActive}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <TextButton
                buttonText="Clear"
                height="2rem"
                width="45%"
                marginRight="10%"
                fontColor={Colors.BLACK}
                onClick={handleClear}
                disabled={disabled}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
              />
              <TextButton
                buttonText="Filter"
                height="2rem"
                width="45%"
                fontColor={Colors.BLACK}
                onClick={handleSave}
                disabled={applyDisabled}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
              />
            </div>
          </Grid>
        </Menu>
      </Grid>
    </>
  );
}
