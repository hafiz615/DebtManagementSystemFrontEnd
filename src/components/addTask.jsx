import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Colors } from "../config/default";
import Dropdown from "./dropdown";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextButton from "./button";
import CustomTextField from "./customTextfield";
import ResponsiveTimePickers from "../.././src/components/timeField";
import { CreateTasks, GetAllUsers, UpdateTasks } from "../services/services";
import dayjs from "dayjs";
import { useToast } from "../../src/toast/toastContext";
import { isEmpty } from "lodash";

export default function AddTask({
  handleClose,
  field,
  data,
  buttonName,
  caseData,
  getAllCaseTasks,
  show,
}) {
  const initialDueDate = data?.dueDate
    ? dayjs(data.dueDate).format("YYYY-MM-DD")
    : "";
  const [loading, setLoading] = useState(false);
  const [userArray, setUserArray] = useState([]);
  const [caseOwnerId, setCaseOwnerId] = useState(data?.assigneeId || "");
  const [addTasks, setAddTask] = useState({
    assignee: data?.assignee || "",
    title: data?.title || "",
    notes: data?.notes || "",
    dueDate: initialDueDate,
    time: dayjs(data?.dueDate) || dayjs(),
    status: data?.status || "",
  });
  const GetUsers = async () => {
    let payload = {};
    const users = await GetAllUsers(1, false, false, payload);

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
  };
  useEffect(() => {
    GetUsers();
  }, []);
  const status = [
    { label: "To do", value: "To do" },
    { label: "On hold", value: "On hold" },
    { label: "Blocked", value: "Blocked" },
    { label: "Completed", value: "Completed" },
  ];

  const { showToast } = useToast();
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const timeString = dayjs(time).format("HH:mm:ss");
    return dayjs(`${date}T${timeString}`).toISOString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (time) => {
    setAddTask((prevState) => ({
      ...prevState,
      time,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setAddTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTasksData = async () => {
    setLoading(true);
    const formattedDateTime = formatDateTime(addTasks?.dueDate, addTasks?.time);
    let params = {
      assigneeId: caseOwnerId,
      assignee: addTasks?.assignee,
      notes: addTasks?.notes,
      dueDate: formattedDateTime,
    };
    let addTasksRes;
    if (show === "editTask") {
      params = { ...params, status: addTasks?.status };
      addTasksRes = await UpdateTasks(data?._id, params);
    } else {
      params = { ...params, title: addTasks?.title };
      addTasksRes = await CreateTasks(caseData?._id, params);
    }

    if (addTasksRes?.status === 200) {
      showToast(addTasksRes?.data?.message, "success");
      getAllCaseTasks();
      handleClose();
    } else {
      const errorMessage = addTasksRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const smallScreen = useMediaQuery("(min-width:300px) and (max-width:768px)");

  return (
    <Grid>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontWeight: "700",
            fontFamily: "Nunito",
          }}
        >
          {buttonName}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1em",
          marginTop: "1.5em",
          flexDirection: smallScreen ? "column" : "row",
        }}
      >
        <div
          style={{
            display: "flex",
            width: smallScreen ? "100%" : "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
          }}
        >
          Due Date
          <CustomTextField
            type="date"
            name="dueDate"
            width="15rem"
            onChange={(e) => handleDropdownChange("dueDate", e.target.value)}
            value={addTasks?.dueDate}
            min={dayjs().format("YYYY-MM-DD")}
          />
        </div>

        <div
          style={{
            display: "flex",
            width: smallScreen ? "100%" : "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
          }}
        >
          Time
          <ResponsiveTimePickers
            value={addTasks?.time}
            onChange={handleTimeChange}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1em",
          marginTop: "1.5em",
          flexDirection: smallScreen ? "column" : "row",
        }}
      >
        {field ? (
          <div
            style={{
              display: "flex",
              width: smallScreen ? "100%" : "50%",
              justifyContent: "space-between",
              fontFamily: "Nunito",
            }}
          >
            Title
            <input
              type="text"
              name="title"
              placeholder="Add Title"
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "15rem",
              }}
              onChange={handleChange}
              value={addTasks?.title}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              width: smallScreen ? "100%" : "50%",
              justifyContent: "space-between",
              fontFamily: "Nunito",
            }}
          >
            Status
            <Dropdown
              width="15rem"
              menuItems={status}
              defaultSelectedItem={"Completed"}
              selectedValue={addTasks?.status}
              setSelectedValue={(value) =>
                handleDropdownChange("status", value)
              }
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            width: smallScreen ? "100%" : "50%",
            justifyContent: "space-between",
            fontFamily: "Nunito",
            flexWrap: "wrap",
          }}
        >
          Assignee
          <Dropdown
            width="15rem"
            disabled={isEmpty(userArray)}
            menuItems={userArray}
            defaultSelectedItem={"Assignee Name"}
            selectedValue={addTasks?.assignee}
            setSelectedValue={(value) =>
              handleDropdownChange("assignee", value)
            }
            backgroundColor={Colors.BG_LIGHT_GRAY}
            hoverColor={Colors.BG_LIGHT_GRAY}
            setId={setCaseOwnerId}
            show={show}
          />
        </div>
      </div>
      <div style={{ marginTop: "1.5em", fontFamily: "Nunito" }}>
        Notes
        <textarea
          name="notes"
          rows="6"
          style={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            border: "none",
            outline: "none",
            marginTop: "1em",
            minWidth: "100%",
            maxWidth: "100%",
          }}
          onChange={handleChange}
          value={addTasks?.notes}
        />
      </div>
      <div style={{ marginTop: "1.5em", float: "right" }}>
        <TextButton
          buttonText={show === "editTask" ? "Edit" : "Save"}
          height="2rem"
          width="8rem"
          onClick={handleTasksData}
          loading={loading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          disabled={
            addTasks?.assignee === "" ||
            addTasks?.dueDate === "" ||
            addTasks?.time === "" ||
            addTasks?.title === "" ||
            addTasks?.notes === ""
          }
        />
      </div>
    </Grid>
  );
}
