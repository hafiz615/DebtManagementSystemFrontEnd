import React from "react";
import {
  Typography,
  Grid,
  Box,
  //   useMediaQuery,
  //   CircularProgress,
} from "@mui/material";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { Colors } from "../../config/default";
import BasicSwitches from "./basicSwitches";

export default function Permission({
  generalPermissionData,
  settingsPermissionData,
  analyticsPermission,
}) {
  return (
    <>
      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          General Permissions
        </Typography>
        <Grid container item xs={12}>
          {generalPermissionData?.map((data, index) => (
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
              }}
            >
              <Box>
                <Typography
                  sx={{
                    // fontSize: FONT_SIZE_XL,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  {data?.permission}
                </Typography>
              </Box>
              <Box sx={{ marginLeft: "auto" }}>
                <BasicSwitches />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Settings
        </Typography>
        <Grid container item xs={12}>
          {settingsPermissionData.map((data, index) => (
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
              }}
            >
              <Box>
                <Typography
                  sx={{
                    // fontSize: FONT_SIZE_XL,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  {data?.permission}
                </Typography>
              </Box>
              <Box sx={{ marginLeft: "auto" }}>
                <BasicSwitches />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid container xs={12} sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontSize: FONT_SIZE_XL,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Analytics
        </Typography>
        <Grid container item xs={12}>
          {analyticsPermission.map((data, index) => (
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
              }}
            >
              <Box>
                <Typography
                  sx={{
                    // fontSize: FONT_SIZE_XL,
                    fontFamily: "Nunito",
                    fontWeight: "500",
                    fontSize: FONT_SIZE_LARGE,
                  }}
                >
                  {data?.permission}
                </Typography>
              </Box>
              <Box sx={{ marginLeft: "auto" }}>
                <BasicSwitches />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
