import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Grid, Typography } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Colors } from "../../config/default";
import ListTable from "../listTable";
import MuiModels from "../models";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);
const headers = ["Template Id", "Name", "Event"];
function createData(templateId, name, event, actions) {
  return {
    templateId,
    name,
    event,
  };
}
const tableData = [
  createData("Template id 1", "Template name", "Event Name"),
  createData("Template id 1", "Template name", "Event Name"),
  createData("Template id 1", "Template name", "Event Name"),
  createData("Template id 1", "Template name", "Event Name"),
  createData("Template id 1", "Template name", "Event Name"),
];
export default function NotificationTemplatesTabs() {
  const [value, setValue] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [froalaEditor, setFroalaEditor] = useState("");
  console.log(froalaEditor);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const generatedData = tableData?.map((item) => ({
        templateId: item?.templateId,
        name: item?.name,
        event: item?.event,
      }));
      setRows(generatedData);
    };

    fetchData();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Accordion
      sx={{
        width: "100%",
        borderRadius: "1rem !important",
        backgroundColor: Colors.WHITE,
        marginTop: "1rem",
        marginBottom: "1rem",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
          borderBottom: "1px solid #6D6D6D",
        }}
      >
        Notification Templates
      </AccordionSummary>
      <AccordionDetails sx={{ border: "none" }}>
        <Box>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ width: { xs: "22rem", md: "50rem" } }}
          >
            <AntTab
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                borderTopLeftRadius: "10px",
                fontWeight: "600",
                height: "3.5rem",
              }}
              label="Email"
            />

            <AntTab
              sx={{
                bgcolor: Colors.WHITE,
                width: "max-content",
                fontWeight: "600",
                height: "3.5rem",
              }}
              label="SMS"
            />
          </AntTabs>

          <Box
            sx={{
              backgroundColor: Colors.WHITE,
              borderRadius: "10px ",
            }}
          >
            {value === 0 && (
              <Grid
                container
                sx={{ justifyContent: "space-between", marginTop: "1rem" }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                    Templates
                  </Typography>

                  <MuiModels
                    show="froalaEditor"
                    froalaEditorButton="Add New"
                    froalaEditor={froalaEditor}
                    setFroalaEditor={setFroalaEditor}
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: Colors.WHITE,
                      borderRadius: "10px ",
                      marginTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ListTable
                      headerData={headers}
                      data={rows}
                      requiredIcons={true}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  lg={5.8}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: Colors.BG_LIGHT_GRAY,
                      padding: "1rem",
                      borderRadius: "10px",
                      marginTop: "3rem",
                      height: "55vh",
                      width: "100%",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#E5E5E5",
                        borderRadius: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: Colors.WHITE,
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: froalaEditor }} />
                  </Box>
                </Grid>
              </Grid>
            )}
            {value === 1 && <div>hi</div>}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
