import * as React from "react";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid, Box } from "@mui/material";

import { Colors } from "../config/default";
import BasicModal from "./customPopup";
import DataTable from "./table";
import { GetAllUsers } from "../services/services";
import { useToast } from "../toast/toastContext";
import CircularProgress from "@mui/material/CircularProgress";

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
    headerName: <span style={{ fontWeight: "600" }}>Name</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "dob",
    headerName: <span style={{ fontWeight: "600" }}>DOB</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "gender",
    headerName: <span style={{ fontWeight: "600" }}>Gender</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "email",
    headerName: <span style={{ fontWeight: "600" }}>Email</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "ssid",
    headerName: <span style={{ fontWeight: "600" }}>SSID</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "role",
    headerName: <span style={{ fontWeight: "600" }}>Role</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "phone",
    headerName: <span style={{ fontWeight: "600" }}>Phone #</span>,
    flex: 1,
    minWidth: 70,
  },
  {
    field: "address",
    headerName: <span style={{ fontWeight: "600" }}>Address</span>,
    flex: 1,
    minWidth: 70,
  },
];
export default function CustomizedTabs() {
  const { showToast } = useToast();
  const [value, setValue] = React.useState(0);

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
  useEffect(() => {
    const generatedData =
      userArray &&
      userArray?.map((item, index) => ({
        id: index,
        name: item?.name || "-",
        dob: item?.dateOfBirth || "-",
        gender: item?.gender || "-",
        email: item?.email || "-",
        ssid: item?.SSID || "-",
        role: item?.role || "-",
        phone: item?.phone || "-",
        address: item?.address || "-",
      }));

    if (!isEqual(generatedData, userArray)) {
      setRows(generatedData);
    }
  }, [userArray]);

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
              label="User Lists"
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

        <BasicModal modelButton="ADD USERS" show={false} GetUsers={GetUsers} />
      </Grid>

      <Grid
        item
        xs={11.9}
        sx={{
          backgroundColor: Colors.WHITE,
          borderRadius: "10px ",
          height: "60vh",
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
            }}
          >
            <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
          </Grid>
        ) : (
          <DataTable rows={rows} columns={columns} height="60vh" />
        )}
      </Grid>
    </>
  );
}
