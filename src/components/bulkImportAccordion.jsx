import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMore } from "@mui/icons-material";
import { Grid, Typography, Box } from "@mui/material";

import { Colors } from "../config/default";

import ListTable from "./listTable";
import {
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import { formatDateString } from "../common";

const headers = ["Debtor", "Status", "Attempts", "Time"];
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
}));

export default function BulkImportAccordions({
  tableHeading,
  arrayName,
  rowArray,
  totalPages,
  currentPage,
  setCurrentPage,
  totalData,
  paginationRows,
  setPaginationRows,
}) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const generatedData = rowArray?.map((item, index) => ({
      caseId: arrayName === "success" ? item?.caseIds[0] : item?._id,
      id: index,
      debtor: item?.debtor?.basicInformation?.fullName || "-",
      status: item?.status || "-",
      retries: item?.retries || "0",
      time: item?.time?.length > 0 ? formatDateString(item?.time[0]) : "-",
    }));
    if (!isEqual(generatedData, rowArray)) {
      setRows(generatedData);
    }
  }, [rowArray]);

  const handleRowClick = (id) => {
    if (arrayName === "success") {
      localStorage.setItem("route", "all-cases");
      navigate(`/all-cases/${id}`);
    } else {
      localStorage.setItem("route", "update-cases");
      navigate(`/update-cases/${id}`);
    }
  };

  return (
    <Accordion
      sx={{
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        width: { xs: "65vw", sm: "100%" },
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Grid item xs={6}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                marginLeft: "0.5rem",
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_XL },
              }}
            >
              {tableHeading}
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                height: { xs: "1.5rem", sm: "2.5rem" },
                width: { xs: "1.5rem", sm: "2.5rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.5rem",
                backgroundColor:
                  arrayName === "failed" || arrayName === "actionRequired"
                    ? Colors.ORANGE_COLOR
                    : Colors.SKY_BLUE,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: FONT_SIZE_MEDIUM, sm: "1rem" },
                  fontFamily: "Nunito",
                  color: Colors.WHITE,
                }}
              >
                {totalData === undefined ? "0" : totalData}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <ListTable
          onPaymentRowClick={
            arrayName === "actionRequired" || arrayName === "success"
              ? handleRowClick
              : undefined
          }
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          apiPagination={true}
          data={rows}
          headerData={headers}
          arrayName={arrayName}
          accordionHeight="40vh"
          paginationRows={paginationRows}
          setPaginationRows={setPaginationRows}
        />
      </AccordionDetails>
    </Accordion>
  );
}
