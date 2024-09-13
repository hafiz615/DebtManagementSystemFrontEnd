import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid, IconButton, Menu, Tooltip, Typography } from "@mui/material";
import {
  Window,
  Handyman,
  Equalizer,
  PeopleAlt,
  DonutLarge,
  CalendarMonth,
  FilterListOutlined,
} from "@mui/icons-material/";

import {
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  PAGE_HEIGHT,
  UserListPage,
  pipelinesHeading,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import SearchBar from "../searchBar";
import PipelinesBoards from "./pipelinesBoards";
import PipelinesLists from "./pipelinesLists";
import Dropdown from "../dropdown";
import ScrollbarStyles from "../customScroll";
import {
  GetAllCustomFields,
  GetAllDebtors,
  GetAllPipelines,
  GetAllUsers,
  GetPipelineDataByCustomFields,
  GetPipelinesDetails,
} from "../../services/services";
import CheckboxAutocomplete from "../checkboxAutocomplete";
import moment from "moment";
import MuiModels from "../models";
import TextButton from "../button";

export default function PipelineDetail() {
  const navigate = useNavigate();
  const [pipelineType, setPipelineType] = useState("Board");
  const [pipelineNameArray, setPipelineNameArray] = useState([]);
  const [data, setData] = useState({});
  const [pipelineName, setPipelineName] = useState(null);
  const [allDebtors, setAllDebtors] = useState();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [byTime, setByTime] = useState("All Time");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [order, setOrder] = useState("Ascending");
  const [customFields, setCustomFields] = useState();
  const [selectedField, setSelectedField] = useState();
  const [customFieldValue, setCustomFieldValue] = useState("");
  const [fieldType, setFieldType] = useState("number");
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const open = Boolean(anchorEl);

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  function getIdByPipelineName(pipelineName) {
    const pipeline = pipelineNameArray?.find(
      (p) => p?.pipeline === pipelineName
    );
    return pipeline ? pipeline?._id : null;
  }

  function getTypeByField(field) {
    const allFields =
      customFields && customFields?.find((p) => p?.name === field);
    return allFields ? allFields?.type : null;
  }

  const getUsers = async () => {
    const res = await GetAllUsers("", false, false);
    if (res?.status === 200) {
      setUsersArray(res?.data?.data?.users);
    } else if (res?.response?.status === 401 || res?.response?.status === 403) {
      localStorage.clear();
      navigate("/");
    }
  };

  const getAllPipelinesNames = async () => {
    const resAllPipelines = await GetAllPipelines();
    setPipelineNameArray(resAllPipelines?.data?.data);
    if (
      resAllPipelines?.response?.status === 401 ||
      resAllPipelines?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
  };

  const getDebtors = async () => {
    const resDebtors = await GetAllDebtors();
    setAllDebtors(resDebtors?.data?.data);
    if (
      resDebtors?.response?.status === 401 ||
      resDebtors?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
  };

  const GetAllPipelineDetail = async (loadingBool) => {
    if (pipelineName) {
      setLoading(loadingBool);
      const id = getIdByPipelineName(pipelineName);
      const resPipelineDetail = await GetPipelinesDetails(id);
      if (resPipelineDetail?.status === 200) {
        setData(resPipelineDetail?.data?.data);
      }
      if (
        resPipelineDetail?.response?.status === 401 ||
        resPipelineDetail?.response?.status === 403
      ) {
        localStorage.clear();
        navigate("/");
      }
      setLoading(false);
    }
  };

  const getCustomFields = async () => {
    const resCustomFields = await GetAllCustomFields();
    if (resCustomFields?.status === 200) {
      setCustomFields(resCustomFields?.data?.data);
      setSelectedField(resCustomFields?.data?.data?.[0]?.name);
    }
  };

  useEffect(() => {
    GetAllPipelineDetail(true);
  }, [pipelineName]);

  useEffect(() => {
    getUsers();
    getAllPipelinesNames();
    getDebtors();
    getCustomFields();
  }, []);

  useEffect(() => {
    setUsers([]);
    setLeads([]);
    setStatuses([]);
    setByTime("All Time");
  }, [pipelineType]);

  useEffect(() => {
    if (pipelineNameArray?.length > 0 && !pipelineName) {
      setPipelineName(pipelineNameArray[0].pipeline);
    }
  }, [pipelineNameArray]);

  useEffect(() => {
    const calculateDates = () => {
      const today = moment();
      let start = null;
      let end = null;

      switch (byTime) {
        case "Today":
          start = today.clone().startOf("day");
          end = today.clone().endOf("day");
          break;
        case "This Week":
          start = today.clone().startOf("week");
          end = today.clone().endOf("week");
          break;
        case "This Month":
          start = today.clone().startOf("month");
          end = today.clone().endOf("month");
          break;
        case "This Quarter":
          start = today.clone().startOf("quarter");
          end = today.clone().endOf("quarter");
          break;
        case "Yesterday":
          start = today.clone().subtract(1, "days").startOf("day");
          end = today.clone().subtract(1, "days").endOf("day");
          break;
        case "Last Week":
          start = today.clone().subtract(1, "weeks").startOf("week");
          end = today.clone().subtract(1, "weeks").endOf("week");
          break;
        case "Last Month":
          start = today.clone().subtract(1, "months").startOf("month");
          end = today.clone().subtract(1, "months").endOf("month");
          break;
        case "Last Quarter":
          start = today.clone().subtract(1, "quarters").startOf("quarter");
          end = today.clone().subtract(1, "quarters").endOf("quarter");
          break;
        case "All Time":
          start = null;
          end = null;
          break;
        default:
          start = null;
          end = null;
      }

      setStartDate(start ? start.toISOString() : null);
      setEndDate(end ? end.toISOString() : null);
    };

    calculateDates();
  }, [byTime]);

  const allFields = customFields?.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const allLeads = allDebtors
    ? [
        "All Leads",
        ...allDebtors?.map((item) => item?.basicInformation?.fullName),
      ]
    : [];

  const orders = [
    { label: "Ascending", value: "Ascending" },
    { label: "Descending", value: "Descending" },
  ];

  const allStatuses = data ? Object.keys(data)?.map((item) => item) : [];

  const allUsers = usersArray
    ? ["All Users", ...usersArray?.map((item) => item?.name)]
    : [];

  const viewType = [
    { label: "Board", value: "Board" },
    { label: "List", value: "List" },
  ];

  const allPipelinesName = pipelineNameArray?.map((item) => ({
    label: item?.pipeline,
    value: item?.pipeline,
    id: item?._id,
  }));

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

  useEffect(() => {
    setPage(0);
  }, [
    pipelineType,
    pipelineName,
    leads,
    users,
    statuses,
    byTime,
    searchText,
    order,
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = () => {
    setPage(0);
    GetAllPipelineDetail(false);
    setCustomFieldValue("");
    handleClose();
  };

  const handleSave = async () => {
    setPage(0);
    handleClose();
    const id = getIdByPipelineName(pipelineName);
    const payload = {
      name: selectedField,
      value:
        fieldType === "number" ? parseInt(customFieldValue) : customFieldValue,
    };
    const res = await GetPipelineDataByCustomFields(payload, id);
    if (res?.status === 200) {
      setData(res?.data?.data);
    }
  };

  useEffect(() => {
    setFieldType(getTypeByField(selectedField));
  }, [selectedField]);

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
          {pipelinesHeading}
        </Typography>
        <div style={{ display: "flex" }}>
          <SearchBar
            searchCheck={true}
            searchingText={searchText}
            handleKeyPress={handleKeyPress}
            placeholder="Search ..."
          />
        </div>
      </Grid>

      <div
        style={{
          display: "flex",
          marginTop: "1rem",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "space-between",
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
            width="5rem"
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

          <Dropdown
            width="8rem"
            menuItems={allPipelinesName}
            selectedValue={pipelineName}
            setSelectedValue={setPipelineName}
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
          <Equalizer sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />

          <CheckboxAutocomplete
            options={allLeads}
            multiSelect={leads}
            setMultiselect={setLeads}
            placeholder="Leads"
            width="9rem"
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
            width="8rem"
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
            width="8rem"
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
            width="8rem"
            menuItems={allTime}
            selectedValue={byTime}
            setSelectedValue={setByTime}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
          />
        </div>
        <div>
          <IconButton
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <FilterListOutlined
              sx={{
                color: Colors.BLACK,
                fontSize: "20px",
                mr: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              Custom Field
            </Typography>
          </IconButton>
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
                Filter By Custom Field
              </Typography>
              <div style={{ marginTop: "10px" }}>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    fontWeight: "600",
                    mt: "10px",
                  }}
                >
                  Custom Field
                </Typography>
                <Dropdown
                  width="100%"
                  menuItems={allFields}
                  selectedValue={selectedField}
                  setSelectedValue={setSelectedField}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    fontWeight: "600",
                    mt: "10px",
                  }}
                >
                  Value
                </Typography>
                <input
                  style={{
                    width: "100%",
                    padding: "7px 5px",
                    borderRadius: "5px",
                    backgroundColor: Colors.BG_LIGHT_GRAY,
                    border: "none",
                    outline: "none",
                    fontSize: FONT_SIZE_LARGE,
                    fontFamily: "Nunito",
                    color: Colors.DIM_LIGHT_GRAY,
                  }}
                  placeholder="value"
                  type={fieldType}
                  value={customFieldValue}
                  onChange={(e) => setCustomFieldValue(e.target.value)}
                />
              </div>

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
                  disabled={!customFieldValue}
                  onClick={handleClear}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
                <TextButton
                  buttonText="Filter"
                  height="2rem"
                  width="45%"
                  fontColor={Colors.BLACK}
                  onClick={handleSave}
                  disabled={!customFieldValue}
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                />
              </div>
            </Grid>
          </Menu>
        </div>
        {pipelineType === "List" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <MuiModels
              show="exportPipeline"
              button="exportButton"
              data={data}
            />
          </div>
        )}
      </div>

      {pipelineType === "Board" ? (
        <PipelinesBoards
          data={data}
          loading={loading}
          GetAllPipelineDetail={GetAllPipelineDetail}
          searchText={searchText}
          statuses={statuses}
          users={users}
          leads={leads}
          startDate={startDate}
          endDate={endDate}
          allPipelinesName={allPipelinesName}
        />
      ) : (
        <PipelinesLists
          data={data}
          searchText={searchText}
          statuses={statuses}
          users={users}
          leads={leads}
          startDate={startDate}
          endDate={endDate}
          page={page}
          setPage={setPage}
          orders={orders}
          order={order}
          setOrder={setOrder}
        />
      )}
    </Grid>
  );
}
