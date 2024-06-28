import React from "react";

import { Typography } from "@mui/material";

import { Colors } from "../../config/default";
import MuiModels from "../models";

export default function DraggablePipelineRow() {
  return (
    <tr
      //   ref={ref}
      style={{
        // opacity,
        display: "flex",

        alignItems: "center",
        color: Colors.DARK_GRAY,
        backgroundColor: Colors.BG_LIGHT_GRAY,
        fontWeight: "500",
        fontSize: "14px",
        width: "100%",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        marginBottom: "0.3rem",
        borderRadius: "5px",
      }}
    >
      <td style={{ width: "28%", textAlign: "left", fontFamily: "Nunito" }}>
        lorem
      </td>
      <td style={{ width: "60%" }}>
        <Typography
          sx={{
            border: `2px solid ${Colors.SKY_BLUE}`,
            width: "4rem",
            textAlign: "center",
            textTransform: "none",
            fontFamily: "Nunito",
            borderRadius: "5px",
            color: Colors.SKY_BLUE,
          }}
        >
          Active
        </Typography>
      </td>
      <td style={{ display: "flex", width: "10%", textAlign: "left" }}>
        <MuiModels
          show="editPipeline"
          button="create"
          //   text={text}
          //   statusId={statusId}
          //   GetStatuses={GetStatuses}
        />
        <MuiModels
          show="deletePipeline"
          button="delete"
          //   arrayStatus={arrayStatus}
          //   text={text}
          //   statusId={statusId}
          //   GetStatuses={GetStatuses}
        />
      </td>
    </tr>
  );
}
