import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScrollbarStyles from "../customScroll";
import { Grid, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PipelineListTable from "./pipelineListTable";
import Dropdown from "../dropdown";
import { Colors } from "../../config/default";
import { formatAmountValue } from "../../common";

export default function PipelinesLists({
  data,
  searchText,
  users,
  leads,
  statuses,
  startDate,
  endDate,
  page,
  setPage,
  order,
  setOrder,
  orders,
}) {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  const headers = [
    "Leads",
    "Business Name",
    "Total Debt",
    "Confidence",
    "Close Date",
    "Status",
    "User",
  ];

  useEffect(() => {
    const allCases =
      data &&
      Object?.values(data)?.flatMap((test) =>
        test?.cases?.map((c) => ({
          id: c?._id,
          lead: c?.debtor?.basicInformation?.fullName,
          company: c?.debtor?.businessInformation?.companyName,
          totalDebt: `$${formatAmountValue(c?.totalDebt)}`,
          confidence: c?.confidence,
          closeDate: c?.closeDate || "-",
          status: c?.status,
          user: c?.caseOwner,
          time: c?.updatedAt,
        }))
      );
    setCases(allCases);
  }, [data]);

  const filteredCases = cases?.filter((caseItem) =>
    caseItem?.lead?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const filteredCasesByUsers = filteredCases?.filter((caseItem) => {
    if (users.length === 0) {
      return true;
    }
    if (users.includes("All Users")) {
      return true;
    }
    return users.some((user) =>
      caseItem?.user.toLowerCase()?.includes(user?.toLowerCase())
    );
  });

  const filteredCasesByLeads = filteredCasesByUsers?.filter((caseItem) => {
    if (leads.length === 0) {
      return true;
    }
    if (leads.includes("All Leads")) {
      return true;
    }
    return leads.some((lead) =>
      caseItem?.lead?.toLowerCase()?.includes(lead?.toLowerCase())
    );
  });

  const filteredCasesByStatus = filteredCasesByLeads?.filter((caseItem) => {
    if (statuses.length === 0) {
      return true;
    }
    return statuses.some((stat) =>
      caseItem?.status?.toLowerCase()?.includes(stat?.toLowerCase())
    );
  });

  const filteredCasesByDate = filteredCasesByStatus?.filter((caseItem) => {
    if (!startDate && !endDate) {
      return true;
    }
    const updatedAt = new Date(caseItem?.time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return updatedAt >= start && updatedAt <= end;
    } else if (start) {
      return updatedAt >= start;
    } else if (end) {
      return updatedAt <= end;
    }
    return true;
  });

  const sortedCases =
    filteredCasesByDate &&
    [...filteredCasesByDate]?.sort((a, b) => {
      if (order === "Ascending") {
        return a.company.toLowerCase() > b.company.toLowerCase() ? 1 : -1;
      } else if (order === "Descending") {
        return a.company.toLowerCase() < b.company.toLowerCase() ? 1 : -1;
      }
      return 0;
    });

  const handleRowClick = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
  };
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  return (
    <Grid
      container
      sx={{
        height: "68vh",
        mt: "10px",
        borderRadius: "10px",
        overflowX: "auto",
        ...ScrollbarStyles,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Grid item xs={12} sx={{ marginTop: "1rem" }}>
        <PipelineListTable
          defaultHeight="55vh"
          headerData={headers}
          onRowClick={
            generalPermissions?.viewCaseDetails ? handleRowClick : undefined
          }
          data={data ? sortedCases?.map(({ time, ...rest }) => rest) : []}
          page={page}
          setPage={setPage}
          orders={orders}
          order={order}
          setOrder={setOrder}
        />
      </Grid>
    </Grid>
  );
}
