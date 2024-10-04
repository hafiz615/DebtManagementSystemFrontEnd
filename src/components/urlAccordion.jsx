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
import ListTableDynamic from "./listTableDynamic";
import { GetAllLinks } from "../services/services";
import { getTruncatedText } from "../common";

const headers = ["Url's", "Actions"];
// const headerData = [{ key: "link", heading: "Url's", width: "80%" }];
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
}));

export default function UrlAccordion({
  tableHeading,
  arrayName,
  totalPages,
  currentPage,
  setCurrentPage,
  totalData,
  paginationRows,
  setPaginationRows,
}) {
  const [rows, setRows] = useState([]);
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  const getLinks = async () => {
    const linkRes = await GetAllLinks();
    if (linkRes?.status === 200) {
      setLinks(linkRes?.data?.data);
    } else if (linkRes?.response?.status === 400) {
      const errorMessage = linkRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };
  useEffect(() => {
    getLinks();
  }, []);
  useEffect(() => {
    const generatedData = links?.map((item, index) => ({
      id: item?._id,
      link: getTruncatedText(item?.link, 120),
      caseId: item?.link,
    }));

    setRows(generatedData);
  }, [links]);

  const handleRowClick = (link) => {
    window.open(link, "_blank");
  };

  return (
    <Accordion
      defaultExpanded={links?.length > 0}
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
                backgroundColor: Colors.SKY_BLUE,
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
                {links?.length ? links.length : 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <ListTable
          onPaymentRowClick={handleRowClick}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          apiPagination={false}
          data={rows}
          headerData={headers}
          arrayName={arrayName}
          accordionHeight="40vh"
          paginationRows={paginationRows}
          setPaginationRows={setPaginationRows}
          requiredLinkIcons={true}
          getLinks={getLinks}
        />
      </AccordionDetails>
    </Accordion>
  );
}
