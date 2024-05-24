import * as React from "react";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Grid, Typography, Box } from "@mui/material";
import { Colors } from "../../config/default";
import Checkboxes from "../checkBox";
import Dropdown from "../dropdown";
import TextButton from "../button";

export default function SettingsAccordion() {
  const menuItems = [
    { label: "Template", value: "Template" },
    { label: "On hold", value: "On hold" },
  ];
  const retry = [
    { label: "Custom", value: "Custom" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Fortnightly", value: "Fortnightly" },
    { label: "Monthly", value: "Monthly" },
  ];
  const roles = ["Admin", "Manager", "Negotiator", "Debtor", "Creditor"];
  const [template, setTemplate] = useState("");
  const [retryInterval, setRetryInterval] = useState("");
  return (
    <>
      <Accordion
        defaultExpanded
        sx={{
          width: "100%",
          borderRadius: "1rem !important",
          backgroundColor: Colors.WHITE,
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
          Payments & Authorizations
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item sx={{ marginTop: "1rem" }}>
            <Grid
              item
              xs={12}
              lg={6.5}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "35%",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  Notifications
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    marginTop: "0.5rem",
                  }}
                >
                  Failed Authorizations
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    marginTop: "1rem",
                  }}
                >
                  Successful Authorizations
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    marginTop: "1.3rem",
                  }}
                >
                  Failed Payment
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    marginTop: "1rem",
                  }}
                >
                  Successful Payment
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                    color: Colors.DARK_GRAY,
                    marginTop: "1rem",
                  }}
                >
                  Upcoming Payment
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "10%",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  Email
                </Typography>
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                  SMS
                </Typography>
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
                <Checkboxes />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontWeight: "600",
                  }}
                >
                  Template
                </Typography>
                <Dropdown
                  menuItems={menuItems}
                  placeholder="Template 1"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="85%"
                  marginBottom="0.5rem"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
                <Dropdown
                  menuItems={menuItems}
                  placeholder="Template 1"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="85%"
                  marginBottom="0.5rem"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
                <Dropdown
                  menuItems={menuItems}
                  placeholder="Template 1"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="85%"
                  marginBottom="0.5rem"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
                <Dropdown
                  menuItems={menuItems}
                  placeholder="Template 1"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="85%"
                  marginBottom="0.5rem"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
                <Dropdown
                  menuItems={menuItems}
                  placeholder="Template 1"
                  backgroundColor={Colors.BG_LIGHT_GRAY}
                  hoverColor={Colors.BG_LIGHT_GRAY}
                  width="85%"
                  selectedValue={template}
                  setSelectedValue={setTemplate}
                />
              </Box>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Typography sx={{ fontFamily: "Nunito", fontWeight: "600" }}>
                Send To
              </Typography>

              {[0, 1, 2, 3, 4].map((row) => (
                <Box
                  key={row}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {roles.map((role, index) => (
                    <React.Fragment key={`${row}-${index}`}>
                      <Checkboxes />
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontWeight: "600",
                          color: Colors.DARK_GRAY,
                        }}
                      >
                        {role}
                      </Typography>
                    </React.Fragment>
                  ))}
                </Box>
              ))}
            </Grid>
          </Grid>
          <hr></hr>

          <Grid container item sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                paddingLeft: "1.5rem",
              }}
            >
              Retry Interval
            </Typography>

            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "20%",
                }}
              >
                Failed Authorizations
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              />
              <Dropdown
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width="15%"
                selectedValue={retryInterval}
                setSelectedValue={setRetryInterval}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Max Retry
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "20%",
                }}
              >
                Failed Payment
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              />
              <Dropdown
                menuItems={retry}
                placeholder="Choose Interval"
                backgroundColor={Colors.BG_LIGHT_GRAY}
                hoverColor={Colors.BG_LIGHT_GRAY}
                width="15%"
                selectedValue={retryInterval}
                setSelectedValue={setRetryInterval}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Max Retry
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "5%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              />
            </Grid>
          </Grid>
          <hr></hr>
          <Grid container item sx={{ marginTop: "1rem", marginBottom: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                color: Colors.BLACK,
                paddingLeft: "1.5rem",
              }}
            >
              Authorization Interval
            </Typography>

            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Custom
              </Typography>
              <input
                type="date"
                placeholder="2/12/2024"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Date
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Frequency
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Days
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Daily
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Hours
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Monthly
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                }}
              >
                Days
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Weekly
              </Typography>
              <input
                type="text"
                placeholder="2"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "10%",
                  marginLeft: "1rem",
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: Colors.DARK_GRAY,
                  paddingLeft: "1.5rem",
                  width: "15%",
                }}
              >
                Days
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <TextButton
              buttonText="SAVE"
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
              paddingLeft="2rem"
              paddingRight="2rem"
              height="2rem"
              marginRight="1rem"
            />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
