import * as React from "react";
import { useState } from "react";

import { Grid, Typography, Box, Hidden } from "@mui/material";
import { Colors } from "../../config/default";
import Checkboxes from "../checkBox";
import Dropdown from "../dropdown";

function truncateTemplateName(name) {
  if (name.length > 10) {
    return name.slice(0, 3) + "..." + name.slice(-3);
  }
  return name;
}

export default function RowConfigForm({ title, data, setData, menuItems }) {
  const [smsTemplate, setSMSTemplate] = useState(data?.smsTemplate);
  const [emailTemplate, setEmailTemplate] = useState(data?.emailTemplate);
  const roles = ["Admin", "Manager", "Negotiator", "Debtor", "Creditor"];

  const onSendToRoleChange = (role, checked) => {
    setData((prevData) => ({
      ...prevData,
      sendTo: {
        ...prevData.sendTo,
        [role.toLowerCase()]: checked,
      },
    }));
  };
  const onEmailCheckChange = (checked) => {
    setData((prevData) => ({
      ...prevData,
      email: checked,
    }));
  };
  const onSMSCheckChange = (checked) => {
    setData((prevData) => ({
      ...prevData,
      sms: checked,
    }));
  };

  React.useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      smsTemplate: smsTemplate,
    }));
  }, [smsTemplate]);

  React.useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      emailTemplate: emailTemplate,
    }));
  }, [emailTemplate]);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        lg={6.5}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "15%", sm: "25%", lg: "35%" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "13px", lg: "16px" },
              fontFamily: "Nunito",
              fontWeight: "600",
              color: { xs: Colors.BLACK, lg: Colors.DARK_GRAY },
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // width: "7.5%",
          }}
        >
          <Checkboxes
            checked={data.email}
            handleCheckChange={(e) => onEmailCheckChange(e.target.checked)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "7.5%",
          }}
        >
          <Checkboxes
            checked={data.sms}
            handleCheckChange={(e) => onSMSCheckChange(e.target.checked)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row", // Change to "row" for inline layout
            width: "35%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              marginRight: "0.5rem",

              // Add margin to separate the dropdowns
            }}
          >
            <Dropdown
              menuWidth="7rem"
              menuItems={menuItems.email}
              placeholder="Email"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="7rem" // Adjust width as necessary
              marginBottom="0.3rem"
              selectedValue={truncateTemplateName(emailTemplate)}
              setSelectedValue={setEmailTemplate}
            />
          </Typography>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              marginRight: "0.5rem", // Add margin to separate the dropdowns
            }}
          >
            <Dropdown
              menuWidth="7rem"
              menuItems={menuItems.sms}
              placeholder="SMS"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="7rem" // Adjust width as necessary
              marginBottom="0.3rem"
              selectedValue={truncateTemplateName(smsTemplate)}
              setSelectedValue={setSMSTemplate}
            />
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Hidden lgUp>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "700",
              marginLeft: "1.8rem",
            }}
          >
            Send To
          </Typography>
        </Hidden>
        <Box
          key={"row"}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {roles?.map((role, index) => (
            <React.Fragment key={`$row-${index}`}>
              <Checkboxes
                checked={data?.sendTo?.[role.toLowerCase()]}
                handleCheckChange={(e) =>
                  onSendToRoleChange(role, e.target.checked)
                }
              />
              <Typography
                sx={{
                  fontSize: { xs: "15px", lg: "auto" },
                  fontFamily: "Nunito",
                  fontWeight: "600",
                  color: { xs: Colors.BLACK, lg: Colors.DARK_GRAY },
                }}
              >
                {role}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Grid>
      {/* </Hidden> */}
    </Grid>
  );
}
