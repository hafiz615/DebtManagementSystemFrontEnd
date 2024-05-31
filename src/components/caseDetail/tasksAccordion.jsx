import React from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import MuiModels from "../models";

export default function TaskAccordion() {
  const taskData = [
    {
      taskName: "Task 1",
      userName: "rummaz",
      status: "On Hold",
      time: "2/2/24 ",
    },
    {
      taskName: "Task 2",
      userName: "rummaz",
      status: "On Hold",
      time: "2/2/24 ",
    },
    {
      taskName: "Task 3",
      userName: "rummaz",
      status: "On Hold",
      time: "2/2/24 ",
    },
  ];
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
        }}
      >
        <Grid>
          {taskData?.map((item) => (
            <Grid
              xs={12}
              container
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Grid>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontFamily: "Nunito",
                    color: Colors.DARK_GRAY,
                    fontWeight: "700",
                  }}
                >
                  {item?.taskName}
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontFamily: "Nunito",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontWeight: "600",
                  }}
                >
                  {item?.userName}
                </Typography>
              </Grid>
              <Grid>
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
              <Grid>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontFamily: "Nunito",
                    color: Colors.DIM_LIGHT_GRAY,
                    fontWeight: "600",
                  }}
                >
                  {item?.time}
                </Typography>
              </Grid>
              <Grid>
                <MuiModels
                  data={item}
                  buttonName="Add Task"
                  show="addTask"
                  field={false}
                  button="create"
                  iconSize="11px"
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
