import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { styled } from "@mui/material/styles";
import BulkImportAccordions from "../bulkImportAccordion";
import { GetBulkRecords } from "../../services/services";
import { Grid } from "@mui/material";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginBottom: "1rem",
  boxShadow: "none",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  fontFamily: "Nunito",
  fontWeight: "600",
  borderTopRightRadius: "1rem",
  borderTopLeftRadius: "1rem",
  borderBottomLeftRadius: "1rem",
  borderBottomRightRadius: "1rem",
  borderBottom: "1px solid #EAEBEB",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none",
  backgroundColor: Colors.PALE_GRAY,
});

const bulkAccordionData = [
  {
    key: "pending",
    heading: "Pending",
  },
  { key: "success", heading: "Success" },
  {
    key: "failed",
    heading: "Failed",
  },
  { key: "actionRequired", heading: "Need Attention" },
  { key: "duplicate", heading: "Duplicate" },
];

export default function BulkMainAccordion() {
  const [bulkData, setBulkData] = useState({});
  const [bulkTotalData, setBulkTotalData] = useState({});
  const [bulkPaginationRows, setBulkPaginationRows] = useState({
    pending: "5",
    success: "5",
    failed: "5",
    actionRequired: "5",
    duplicate: "5",
  });
  const [bulkCurrentPage, setBulkCurrentPages] = useState({
    pending: 1,
    success: 1,
    failed: 1,
    actionRequired: 1,
    duplicate: 1,
  });

  const getBulkData = async (key, pageNumber, pageLimit) => {
    let limit = pageLimit || bulkPaginationRows[key];
    const res = await GetBulkRecords(key, pageNumber, limit);
    if (res?.status === 200) {
      if (!res?.data?.data) {
        setBulkTotalData({
          pending: 0,
          success: 0,
          failed: 0,
          actionRequired: 0,
          duplicate: 0,
        });
        setBulkData({
          pending: [],
          success: [],
          failed: [],
          actionRequired: [],
          duplicate: [],
        });
      } else {
        key === "default"
          ? setBulkTotalData(res?.data?.data?.count)
          : setBulkTotalData((prev) => ({
              ...prev,
              [key]: res?.data?.data?.count[key],
            }));

        key === "default"
          ? setBulkData(res?.data?.data)
          : setBulkData((prev) => ({
              ...prev,
              [key]: res?.data?.data?.[key],
            }));
      }
    }
  };

  const handleBulkPageChange = (key, page) => {
    setBulkCurrentPages((prev) => ({ ...prev, [key]: page }));
    getBulkData(key, page);
  };

  const handleBulkRowChange = (key, newRow) => {
    setBulkCurrentPages((prev) => ({ ...prev, [key]: 1 }));
    setBulkPaginationRows((prev) => ({ ...prev, [key]: newRow }));
    getBulkData(key, 1, newRow);
  };

  useEffect(() => {
    getBulkData("default", 1, 5);
  }, []);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Bulk Upload
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid
          container
          item
          xs={12}
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} lg={5.9}>
            {bulkAccordionData
              ?.filter((data) =>
                ["pending", "failed", "duplicate"]?.includes(data.key)
              )
              ?.map((data, index) => (
                <Grid
                  item
                  xs={12}
                  key={data.key}
                  sx={{ marginBottom: "0.5rem" }}
                >
                  <BulkImportAccordions
                    paginationRows={bulkPaginationRows[data?.key]}
                    setPaginationRows={(newRow) =>
                      handleBulkRowChange(data?.key, newRow)
                    }
                    index={index}
                    totalPages={Math.ceil(
                      bulkTotalData[data?.key] / bulkPaginationRows[data?.key]
                    )}
                    totalData={bulkTotalData[data?.key]}
                    arrayName={data?.key}
                    currentPage={bulkCurrentPage[data?.key]}
                    setCurrentPage={(page) =>
                      handleBulkPageChange(data?.key, page)
                    }
                    tableHeading={data?.heading}
                    rowArray={bulkData[data?.key]}
                  />
                </Grid>
              ))}
          </Grid>
          <Grid item xs={12} lg={5.9}>
            {bulkAccordionData
              ?.filter((data) =>
                ["success", "actionRequired"]?.includes(data.key)
              )
              ?.map((data, index) => (
                <Grid
                  item
                  xs={12}
                  key={data.key}
                  sx={{ marginBottom: "0.5rem" }}
                >
                  <BulkImportAccordions
                    paginationRows={bulkPaginationRows[data?.key]}
                    setPaginationRows={(newRow) =>
                      handleBulkRowChange(data?.key, newRow)
                    }
                    index={index}
                    totalPages={Math.ceil(
                      bulkTotalData[data?.key] / bulkPaginationRows[data?.key]
                    )}
                    totalData={bulkTotalData[data?.key]}
                    arrayName={data?.key}
                    currentPage={bulkCurrentPage[data?.key]}
                    setCurrentPage={(page) =>
                      handleBulkPageChange(data?.key, page)
                    }
                    tableHeading={data?.heading}
                    rowArray={bulkData[data?.key]}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
