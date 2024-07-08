import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box, Grid, Typography } from "@mui/material";
import {
  Window,
  Handyman,
  Equalizer,
  PeopleAlt,
  DonutLarge,
  CalendarMonth,
  ExitToApp,
} from "@mui/icons-material/";

import { useNavigate } from "react-router-dom";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import SearchBar from "../searchBar";
import PipelinesBoards from "./pipelinesBoards";
import PipelinesLists from "./pipelinesLists";
import Dropdown from "../dropdown";
import ScrollbarStyles from "../customScroll";
import { GetAllUsers } from "../../services/services";
import CheckboxAutocomplete from "../checkboxAutocomplete";

export default function PipelineDetail() {
  const [pipelineType, setPipelineType] = useState("Board");
  const [pipelineName, setPipelineName] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [byTime, setByTime] = useState("All Time");
  const navigate = useNavigate();

  //   const GetStatuses = async () => {
  //     const AllStatuses = await GetAllStatuses();
  //     if (AllStatuses?.status === 200) {
  //       setUsers(AllStatuses?.data?.data?.status);
  //     }
  //   };

  const GetUsers = async () => {
    const res = await GetAllUsers("", false, false);
    if (res?.status === 200) {
      setUsersArray(res?.data?.data?.users);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  const allUsers = usersArray?.map((item) => item?.name);

  const viewType = [
    { label: "Board", value: "Board" },
    { label: "List", value: "List" },
  ];
  const allPipelinesName = ["negotations", "basic"];
  const allLeads = ["negotations", "basic"];
  const allStatuses = ["Test1", "Test2", "Test3"];

  const allTime = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "This Quarter", value: "This Quarter" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Last Quarter", value: "Last Quarter" },
    { label: "All Time", value: "All Time" },
  ];

  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0rem 2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Pipelines
        </Typography>
        <SearchBar
          searchCheck={true}
          //   searchingText={searchText}
          //   handleKeyPress={handleKeyPress}
          placeholder="Search ..."
        />
      </Grid>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "1rem",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <Window sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />
          <Typography
            sx={{
              fontSize: {
                xs: FONT_SIZE_SMALL,
                sm: FONT_SIZE_LARGE,
              },
              fontFamily: "Nunito",
              ml: "5px",
            }}
          >
            View:
          </Typography>
          <Dropdown
            width="7rem"
            menuItems={viewType}
            selectedValue={pipelineType}
            setSelectedValue={setPipelineType}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <Handyman sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />
          <Typography
            sx={{
              fontSize: {
                xs: FONT_SIZE_SMALL,
                sm: FONT_SIZE_LARGE,
              },
              fontFamily: "Nunito",
              ml: "5px",
            }}
          >
            Pipelines:
          </Typography>

          <CheckboxAutocomplete
            options={allPipelinesName}
            multiSelect={pipelineName}
            setMultiselect={setPipelineName}
            placeholder="Pipelines"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <Equalizer sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />

          <CheckboxAutocomplete
            options={allLeads}
            multiSelect={leads}
            setMultiselect={setLeads}
            placeholder="Debtors"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <PeopleAlt sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />
          <CheckboxAutocomplete
            options={allUsers}
            multiSelect={users}
            setMultiselect={setUsers}
            placeholder="Users"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <DonutLarge
            sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
          />

          <CheckboxAutocomplete
            options={allStatuses}
            multiSelect={statuses}
            setMultiselect={setStatuses}
            placeholder="Status"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${Colors.DIM_LIGHT_GRAY}`,
          }}
        >
          <CalendarMonth
            sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
          />

          <Dropdown
            width="9rem"
            menuItems={allTime}
            selectedValue={byTime}
            setSelectedValue={setByTime}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ExitToApp sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />
          <Typography
            sx={{
              fontSize: {
                xs: FONT_SIZE_SMALL,
                sm: FONT_SIZE_LARGE,
              },
              fontFamily: "Nunito",
              ml: "5px",
            }}
          >
            Export
          </Typography>
        </div>
      </div>

      {pipelineType === "Board" ? <PipelinesBoards /> : <PipelinesLists />}
    </Grid>
  );
}
