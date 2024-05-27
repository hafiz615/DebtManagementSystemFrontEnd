import * as React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";

import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid, Box } from "@mui/material";

import { Colors } from "../config/default";
import BasicModal from "./customPopup";
// import DataTable from "./table";
import { GetAllUsers } from "../services/services";
import { useToast } from "../toast/toastContext";
import CircularProgress from "@mui/material/CircularProgress";
import UserListTable from "./userListTable";

const AntTabs = styled(Tabs)({
  border: "none",
  "& .MuiTabs-indicator": {
    backgroundColor: "white",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },

    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.BLACK,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.BLACK,
      // fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "red",
    },
  })
);

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
];
export default function CustomizedTabs({ heading }) {
  const { showToast } = useToast();
  const [value, setValue] = React.useState(0);
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [rows, setRows] = useState([]);
  const [userArray, setUserArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetUsers = async () => {
    setLoading(true);
    const users = await GetAllUsers();
    if (users?.status === 200) {
      setUserArray(users?.data?.data);
    } else {
      const errorMessage = users?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };
  useEffect(() => {
    GetUsers();
  }, []);

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
    }));
  }, [userArray]);

  useEffect(() => {
    setRows(generatedData);
  }, [generatedData]);

  return (
    <>
      <Grid
        item
        xs={11.9}
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="User List Tabs"
          >
            <AntTab
              label={heading}
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                fontWeight: "600",
                marginLeft: "2.5rem",
                height: "3.5rem",
              }}
            />
          </AntTabs>
        </Box>

        {role === "Admin" && (
          <BasicModal
            modelButton="ADD USERS"
            modalType="add"
            GetUsers={GetUsers}
          />
        )}
      </Grid>

      <Grid
        item
        xs={11.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
              height: "50vh",
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <>
            <UserListTable
              requiredCustomFieldIcons={true}
              rows={rows}
              columns={columns}
              GetUsers={GetUsers}
            />
            {/* <DataTable rows={rows} columns={columns} /> */}
          </>
        )}
      </Grid>
    </>
  );
}
