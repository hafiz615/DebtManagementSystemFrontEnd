import React from "react";

import {
  Typography,
  Grid,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  //   useMediaQuery,
  //   CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DifferenceIcon from "@mui/icons-material/Difference";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import {
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
  FONT_SIZE_XXL,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import Permission from "./permission";

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
});

const StyledTypography = styled(Typography)`
  font-family: Nunito;
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${(props) => props.fontWeight || 400};
`;

const cardData = [
  { role: "Admin", users: 4 },
  { role: "Super User", users: 3 },
  { role: "User", users: 5 },
  { role: "Restricted", users: 2 },
  { role: "Negotiator", users: 1 },
  { role: "Williams", users: 4 },
];

const generalPermissionData = [
  { permission: "Create New Case" },
  { permission: "Import Bulk Cases" },
  { permission: "View User Listing" },
  { permission: "Add New User" },
  { permission: "Delete a User" },
  { permission: "Create admin user" },
  { permission: "View Home Screen" },
  { permission: "View Payments and Authorizations" },
  { permission: "Retry Payment" },
  { permission: "View Case Details" },
  { permission: "View Clients for self" },
  { permission: "View Clients for all Users" },
  { permission: "View Creditors for self" },
  { permission: "View Creditors for All Users" },
];

const settingsPermissionData = [
  { permission: "Create admin user" },
  { permission: "Edit Payments Notification Settings" },
  { permission: "Edit Authorization Interval" },
  { permission: "Edit Retry Interval" },
  { permission: "View Clients for all Users" },
  { permission: "View Notification Templates" },
  { permission: "View Custom Fields" },
  { permission: "Add Notification Template" },
  { permission: "Edit Notification Template" },
  { permission: "Add Custom Fields" },
  { permission: "Delete Notification Template" },
  { permission: "Edit Custom Fields" },
  { permission: "Delete Custom Fields" },
  { permission: "View Case Statuses" },
  { permission: "Add Case Status" },
  { permission: "Edit Case Status" },
  { permission: "Delete Case Status" },
  { permission: "View Pipeline" },
  { permission: "Create Pipeline" },
  { permission: "Edit Pipeline" },
  { permission: "Delete Pipeline" },
];

const analyticsPermission = [
  { permission: "View Analytics for self" },
  { permission: "View Analytics for All Users" },
];
export default function RoleAndPermission() {
  //   const [showPermissionData, setShowPermissionData] = useState(false);

  //   const handleClick = () => {
  //     setShowPermissionData(true);
  //   };
  return (
    <StyledAccordion sx={{ overflowX: "auto" }}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            width: "98%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            Roles & Permissions
          </Typography>
          <span onClick={(e) => e.stopPropagation()}>
            <MuiModels show="createRole" />
          </span>
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails
      // sx={{ width: { xs: "140vw", sm: "auto" } }}
      >
        <Grid container xs={12} sx={{ marginTop: "1rem" }}>
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: "Nunito",
              fontWeight: "700",
            }}
          >
            User Roles
          </Typography>

          <Grid
            container
            item
            xs={12}
            sx={{
              marginTop: "1rem",
            }}
          >
            {cardData?.map((data, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={2.8}
                sx={{
                  alignItems: "center",
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  borderRadius: "5px",
                  display: "flex",
                  padding: "1rem",
                  margin: "0.5rem",
                  cursor: "pointer",
                }}
                // onClick={handleClick}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: FONT_SIZE_XL,
                      fontFamily: "Nunito",
                      fontWeight: "700",
                    }}
                  >
                    {data?.role}
                  </Typography>
                  <StyledTypography fontWeight="400">
                    Assigned to you and{" "}
                    <span
                      style={{
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        fontSize: FONT_SIZE_MEDIUM,
                      }}
                    >
                      {data?.users} Users
                    </span>
                  </StyledTypography>
                </Box>
                <Box sx={{ marginLeft: "auto" }}>
                  <IconButton>
                    <DifferenceIcon sx={{ fontSize: FONT_SIZE_XXL }} />
                  </IconButton>

                  <IconButton>
                    <DeleteForeverOutlinedIcon
                      sx={{ fontSize: FONT_SIZE_XXL }}
                    />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <hr></hr>
        <Permission
          generalPermissionData={generalPermissionData}
          settingsPermissionData={settingsPermissionData}
          analyticsPermission={analyticsPermission}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
