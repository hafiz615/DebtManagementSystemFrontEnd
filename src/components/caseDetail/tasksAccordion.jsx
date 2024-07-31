import React, { useEffect, useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import { GetAllTasks } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import Prompt from "../prompt";
import ScrollbarStyles from "./../customScroll";

export default function TaskAccordion({ caseData }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tasksList, setTasksList] = useState([]);

  const getAllCaseTasks = async () => {
    setLoading(true);
    const tasksResult = await GetAllTasks(caseData?._id);
    if (tasksResult?.status === 200) {
      setTasksList(tasksResult?.data?.data || []);
    } else {
      const errorMessage = tasksResult?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllCaseTasks();
  }, []);

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon sx={{ color: Colors.WHITE, fontFamily: "Nunito" }} />
        }
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: "20px",
          backgroundColor: Colors.SKY_BLUE,
          borderRadius: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: Colors.WHITE,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            TASKS
          </Typography>
          <div onClick={(e) => e.stopPropagation()}>
            <MuiModels
              caseData={caseData}
              getAllCaseTasks={getAllCaseTasks}
              buttonName="Add Task"
              show="addTask"
              field={true}
              button="icon"
            />
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: Colors.WHITE,
          boxShadow: " 0 2px 5px -3px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          height: "35vh",
          overflow: "auto",
          ...ScrollbarStyles,
        }}
      >
        <Grid container>
          {loading ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "35vh",
              }}
            >
              <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
            </Grid>
          ) : tasksList.length === 0 ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "35vh",
              }}
            >
              <Typography
                sx={{
                  color: Colors.GRAY,
                  fontFamily: "Nunito",
                  fontWeight: "700",
                }}
              >
                No tasks exist
              </Typography>
            </Grid>
          ) : (
            tasksList.map((item) => (
              <Grid
                container
                key={item._id}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontFamily: "Nunito",
                      color: Colors.DARK_GRAY,
                      fontWeight: "700",
                    }}
                  >
                    {item?.assignee}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontFamily: "Nunito",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontWeight: "600",
                    }}
                  >
                    {item?.title}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontFamily: "Nunito",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontWeight: "600",
                    }}
                  >
                    {item?.status}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontFamily: "Nunito",
                      color: Colors.DIM_LIGHT_GRAY,
                      fontWeight: "600",
                    }}
                  >
                    {formatDate(item?.dueDate)}
                  </Typography>
                </Grid>
                <Grid item xs={2.7} sx={{ display: "flex" }}>
                  <MuiModels
                    data={item}
                    buttonName="Edit Task"
                    show="editTask"
                    field={false}
                    button="create"
                    iconSize="13px"
                    caseData={caseData}
                    getAllCaseTasks={getAllCaseTasks}
                  />
                  <Prompt
                    heading="Delete Task"
                    text={`Are you sure you want to Delete ${item?.title} ?`}
                    iconSize="13px"
                    data={item}
                    getAllCaseTasks={getAllCaseTasks}
                    deleting="Delete Tasks"
                  />
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
