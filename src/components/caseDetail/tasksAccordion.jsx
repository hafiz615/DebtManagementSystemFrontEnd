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
      time: "2/2/24 5:40pm",
    },
    {
      taskName: "Task 2",
      userName: "rummaz",
      status: "On Hold",
      time: "2/2/24 5:40pm",
    },
    {
      taskName: "Task 3",
      userName: "rummaz",
      status: "On Hold",
      time: "2/2/24 5:40pm",
    },
  ];
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        marginBottom: "10px",
        backgroundColor: Colors.BG_LIGHT_GRAY,
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
          borderRadius: "10px",
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
          <Typography sx={{ color: Colors.WHITE }}>Tasks</Typography>
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
          backgroundColor: Colors.BG_LIGHT_GRAY,
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
                    color: Colors.BLACK,
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
