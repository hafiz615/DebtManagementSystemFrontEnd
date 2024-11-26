import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, IconButton } from "@mui/material";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import { Colors } from "../config/default";
import SearchBar from "./searchBar";
import ListTable from "./listTable";
import { formatDollarAmount } from "../common";
import { caseHistoryHeading } from "../constants/appConstants";

function CaseHistory({
  tableLoading,
  searchText,
  data,
  userRole,
  handleKeyPress,
  totalPages,
  currentPage,
  setCurrentPage,
  open,
  handleClick,
  paginationRows,
  setPaginationRows,
}) {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };
  const headers = [
    "Case Owner",
    userRole === "client" ? "Creditor" : "Debtor",
    "Last Payment Date",
    "Current Balance",
    "Total Debt",
    "Upcoming Debt",
    "Upcoming Date",
    "Last Payment Amount",
  ];
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData =
        data &&
        data?.map((item) => ({
          id: item?._id,
          caseOwner: item?.caseOwner || "-",
          Creditor: item?.creditorName || item?.debtorName || "-",
          lastDate: formatDate(item?.lastPaymentDate) || "-",
          OutstandingDebt: formatDollarAmount(item?.outstandingDebt) || "-",
          totalDebt: formatDollarAmount(item?.totalDebt) || "-",
          UpcomingDebt: formatDollarAmount(item?.upcomingPayment) || "-",
          upcomingDate: formatDate(item?.upcomingPaymentDate) || "-",
          lastPaymentAmount: formatDollarAmount(item?.lastPayment) || "-",
        }));
      setRows(generatedData);
    };

    fetchData();
  }, [data]);

  return (
    <>
      <Grid container sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: { xs: "unset", sm: "space-between" },
            alignItems: { xs: "unset", sm: "center" },
            gap: { xs: "1rem", sm: "0" },
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <Typography
            sx={{
              paddingLeft: "0.8rem",
              paddingRight: "0.8rem",
              bgcolor: Colors.WHITE,
              width: "max-content",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              fontWeight: "600",
              fontSize: 14,
              fontFamily: "Nunito",
              marginLeft: "2.5rem",
              height: "3.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {caseHistoryHeading}
          </Typography>
          <div style={{ display: "flex" }}>
            <SearchBar
              searchCheck={true}
              searchingText={searchText}
              handleKeyPress={handleKeyPress}
              placeholder="Search Creditor..."
            />
            <IconButton
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FilterListOutlinedIcon
                sx={{
                  color: Colors.DARK_GRAY,
                  fontSize: { xs: "20px", sm: "30px" },
                }}
              />
            </IconButton>
          </div>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          borderRadius: "10px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ListTable
          headerData={headers}
          data={rows}
          onRowClick={
            generalPermissions?.viewCaseDetails
              ? (id) => navigate(`/all-cases/${id}`)
              : undefined
          }
          apiPagination={true}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loading={tableLoading}
          defaultHeight="30vh"
          paginationRows={paginationRows}
          setPaginationRows={setPaginationRows}
        />
      </Grid>
    </>
  );
}

export default CaseHistory;
