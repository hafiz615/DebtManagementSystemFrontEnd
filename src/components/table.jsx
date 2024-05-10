import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Colors } from "../config/default";

const datagridSx = {
  color: Colors.DARK_GRAY,
  border: "none",
  fontFamily: "Nunito",
  borderTop: "1px solid #EAEBEB",
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "& .MuiDataGrid-main": { borderRadius: "10px" },

  "& .MuiDataGrid-virtualScrollerRenderZone": {
    borderBottom: "none !important",
    "& .MuiDataGrid-root": { border: "none !important" },
    "& .MuiDataGrid-row": {
      width: "100%",

      "&:nth-of-type(2n-1)": {
        backgroundColor: Colors.LIGHT_BLUE_COLOR,
      },
    },
    "& div": { border: "none" },
  },

  "& .MuiDataGrid-columnHeaders": {
    borderTop: Colors.DIM_LIGHT_GRAY,
    color: Colors.BLACK,
    fontFamily: "Nunito",
    fontWeight: "bold !important",
  },
};
export default function DataTable({ rows, columns, height }) {
  return (
    <div
      style={{
        width: "100%",
        height: height,
        borderTop: Colors.DARK_GRAY,
        borderBottomRightRadius: "10px",
        borderBottomLeftRadius: "10px",
      }}
    >
      {rows && (
        <DataGrid
          sx={datagridSx}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
        />
      )}
    </div>
  );
}
