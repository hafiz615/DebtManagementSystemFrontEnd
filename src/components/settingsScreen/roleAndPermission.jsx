import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Prompt from "../prompt";

import {
  FONT_FAMILY,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
  FONT_WEIGHT_HEADING,
} from "../../constants/appConstants";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import Permission from "./permission";
import {
  GetAllRoles,
  GetRoleByName,
  UpdateRole,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import TextButton from "./../../components/button";
import { useSelector, useDispatch } from "react-redux";
import { permissions } from "../../redux/action/action";

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

export default function RoleAndPermission() {
  const dispatch = useDispatch();
  const permissionData = useSelector(
    (state) => state?.permissions?.permissions?.name
  );
  const crrentRole = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolesData, setRolesData] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [generalData, setGeneralData] = useState(null);
  const [settingData, setSettingsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [rolesId, setRoleId] = useState("");

  const GetRoles = async () => {
    const GetRolesData = await GetAllRoles(false);

    if (GetRolesData?.status === 200) {
      setRolesData(GetRolesData?.data?.data || []);
    } else {
      const errorMessage = GetRolesData?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    GetRoles();
  }, []);
  useEffect(() => {
    if (selectedRole) {
      setGeneralData(
        rolesData?.find((role) => role?.name === selectedRole)
          ?.generalPermissions
      );
      setSettingsData(
        rolesData?.find((role) => role?.name === selectedRole)?.settings
      );
      setAnalyticsData(
        rolesData?.find((role) => role?.name === selectedRole)?.analytics
      );
      setRoleId(rolesData?.find((role) => role?.name === selectedRole)?._id);
      setRoleName(rolesData?.find((role) => role?.name === selectedRole)?.name);
    }
  }, [selectedRole, rolesData]);
  const selectedRoleData = rolesData?.find(
    (role) => role?.name === selectedRole
  );

  const filteredRolesData =
    crrentRole === "Super User"
      ? rolesData?.filter((role) => role?.name !== "Super User")
      : rolesData?.filter((role) => role?.name === crrentRole);

  const UpdateRoles = async () => {
    const params = {
      name: roleName,
      generalPermissions: generalData,
      settings: settingData,
      analytics: analyticsData,
    };
    const updateRole = await UpdateRole(params, rolesId);
    if (updateRole.status === 200) {
      if (roleName === permissionData) {
        const GetRoleName = await GetRoleByName(roleName);

        if (GetRoleName?.status === 200) {
          dispatch(permissions(GetRoleName?.data?.data));
        }
      }
      showToast(updateRole?.data?.message, "success");
      GetRoles();
    } else {
      const errorMessage = updateRole?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };
  return (
    // <StyledAccordion sx={{ overflowX: "auto" }}>
    //   <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    //     <div
    //       style={{
    //         width: "98%",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       <Typography
    //         sx={{
    //           fontSize: FONT_SIZE_XL,
    //           fontFamily: FONT_FAMILY,
    //           fontWeight: FONT_WEIGHT_HEADING,
    //         }}
    //       >
    //         Roles & Permissions
    //       </Typography>
    //       <span onClick={(e) => e.stopPropagation()}>
    //         <MuiModels show="createRole" GetRoles={GetRoles} />
    //       </span>
    //     </div>
    //   </StyledAccordionSummary>
    //   <StyledAccordionDetails>
    //     <Grid container sx={{ marginTop: "1rem" }}>
    //       <Typography
    //         sx={{
    //           fontSize: FONT_SIZE_XL,
    //           fontFamily: FONT_FAMILY,
    //           fontWeight: FONT_WEIGHT_HEADING,
    //         }}
    //       >
    //         User Roles
    //       </Typography>

    //       <Grid
    //         container
    //         item
    //         xs={12}
    //         sx={{
    //           marginTop: "1rem",
    //         }}
    //       >
    //         {rolesData?.map((data, index) => (
    //           <Grid
    //             item
    //             xs={12}
    //             lg={2.8}
    //             key={index}
    //             sx={{
    //               alignItems: "center",
    //               backgroundColor:
    //                 selectedRole === data?.name
    //                   ? Colors.SKY_BLUE
    //                   : Colors.BG_LIGHT_GRAY,
    //               color:
    //                 selectedRole === data?.name ? Colors.WHITE : Colors.BLACK,
    //               borderRadius: "5px",
    //               display: "flex",
    //               padding: "1rem",
    //               margin: "0.5rem",
    //               cursor: "pointer",
    //             }}
    //             onClick={() => setSelectedRole(data?.name)}
    //           >
    //             <Box>
    //               <Typography
    //                 sx={{
    //                   fontSize: FONT_SIZE_XL,
    //                   fontFamily: FONT_FAMILY,
    //                   fontWeight: FONT_WEIGHT_HEADING,
    //                 }}
    //               >
    //                 {data?.name}
    //               </Typography>
    //               <StyledTypography fontWeight="400">
    //                 Assigned to you and{" "}
    //                 <span
    //                   style={{
    //                     fontFamily: FONT_FAMILY,
    //                     fontWeight: FONT_WEIGHT_HEADING,
    //                     fontSize: FONT_SIZE_MEDIUM,
    //                   }}
    //                 >
    //                   Users
    //                 </span>
    //               </StyledTypography>
    //             </Box>
    //             {data?.name !== "Super User" && (
    //               <Box
    //                 sx={{
    //                   marginLeft: "auto",
    //                   display: "flex",
    //                 }}
    //               >
    //                 <MuiModels
    //                   show="duplicateRole"
    //                   GetRoles={GetRoles}
    //                   selectedData={data}
    //                   selectedRoleData={selectedRoleData}
    //                   selectedRole={selectedRole}
    //                   setSelectedRole={setSelectedRole}
    //                 />

    //                 <Prompt
    //                   heading="Delete Template"
    //                   text={`Are you sure you want to delete ${data?.name} ?`}
    //                   rolesId={data._id}
    //                   roleName={roleName}
    //                   GetRoles={GetRoles}
    //                   permissionData={permissionData}
    //                   iconSize="20px"
    //                   setSelectedRole={setSelectedRole}
    //                 />
    //               </Box>
    //             )}
    //           </Grid>
    //         ))}
    //       </Grid>
    //     </Grid>
    //     <hr />
    //     {selectedRole && (
    //       <>
    //         <Permission
    //           setGeneralData={setGeneralData}
    //           setSettingsData={setSettingsData}
    //           setAnalyticsData={setAnalyticsData}
    //           role={selectedRole}
    //           general={generalData}
    //           settingsPermissions={settingData}
    //           analyticsPermissions={analyticsData}
    //         />
    //         {selectedRole !== "Super User" && (
    //           <Grid
    //             container
    //             sx={{
    //               justifyContent: "flex-end",
    //               marginTop: "1rem",
    //             }}
    //           >
    //             <TextButton
    //               buttonText="UPDATE"
    //               height="2rem"
    //               marginRight="1rem"
    //               width="6rem"
    //               onClick={UpdateRoles}
    //               backgroundColor={Colors.SKY_BLUE}
    //               hoverColor={Colors.SKY_BLUE}
    //             />
    //           </Grid>
    //         )}
    //       </>
    //     )}
    //   </StyledAccordionDetails>
    // </StyledAccordion>
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
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT_HEADING,
            }}
          >
            Roles & Permissions
          </Typography>
          <span onClick={(e) => e.stopPropagation()}>
            <MuiModels show="createRole" GetRoles={GetRoles} />
          </span>
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Grid container sx={{ marginTop: "1rem" }}>
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT_HEADING,
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
            {filteredRolesData?.map((data, index) => (
              <Grid
                item
                xs={12}
                lg={2.8}
                key={index}
                sx={{
                  alignItems: "center",
                  backgroundColor:
                    selectedRole === data?.name
                      ? Colors.SKY_BLUE
                      : Colors.BG_LIGHT_GRAY,
                  color:
                    selectedRole === data?.name ? Colors.WHITE : Colors.BLACK,
                  borderRadius: "5px",
                  display: "flex",
                  padding: "1rem",
                  margin: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedRole(data?.name)}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: FONT_SIZE_XL,
                      fontFamily: FONT_FAMILY,
                      fontWeight: FONT_WEIGHT_HEADING,
                    }}
                  >
                    {data?.name}
                  </Typography>
                  <StyledTypography fontWeight="400">
                    Assigned to you and{" "}
                    <span
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: FONT_WEIGHT_HEADING,
                        fontSize: FONT_SIZE_MEDIUM,
                      }}
                    >
                      Users
                    </span>
                  </StyledTypography>
                </Box>
                {data?.name !== "Super User" && (
                  <Box
                    sx={{
                      marginLeft: "auto",
                      display: "flex",
                    }}
                  >
                    <MuiModels
                      show="duplicateRole"
                      GetRoles={GetRoles}
                      selectedData={data}
                      selectedRoleData={selectedRoleData}
                      selectedRole={selectedRole}
                      setSelectedRole={setSelectedRole}
                    />

                    <Prompt
                      heading="Delete Template"
                      text={`Are you sure you want to delete ${data?.name} ?`}
                      rolesId={data._id}
                      roleName={roleName}
                      GetRoles={GetRoles}
                      permissionData={permissionData}
                      iconSize="20px"
                      setSelectedRole={setSelectedRole}
                    />
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <hr />
        {selectedRole && (
          <>
            <Permission
              setGeneralData={setGeneralData}
              setSettingsData={setSettingsData}
              setAnalyticsData={setAnalyticsData}
              role={selectedRole}
              general={generalData}
              settingsPermissions={settingData}
              analyticsPermissions={analyticsData}
            />
            {selectedRole !== "Super User" && (
              <Grid
                container
                sx={{
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <TextButton
                  buttonText="UPDATE"
                  height="2rem"
                  marginRight="1rem"
                  width="6rem"
                  onClick={UpdateRoles}
                  backgroundColor={Colors.SKY_BLUE}
                  hoverColor={Colors.SKY_BLUE}
                />
              </Grid>
            )}
          </>
        )}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
