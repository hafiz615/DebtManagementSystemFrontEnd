import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../../config/default";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { ExpandMore } from "@mui/icons-material";
import ScrollbarStyles from "../customScroll";

export default function CashFlowPercentage({ cashFlow, cashFlowLoading }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  return (
    <Grid
      item
      xs={12}
      sm={5.8}
      md={3.8}
      lg={2.8}
      sx={{
        maxHeight: "17vh",
        width: "23.35%",
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "5px 16px 16px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_LARGE,
            mb: "10px",
          }}
        >
          Most Favorable Day
        </Typography>
        <IconButton onClick={handleOpenPopover}>
          <Tooltip title="View Details" placement="top">
            <ExpandMore sx={{ color: Colors.BLACK }} />
          </Tooltip>
        </IconButton>
      </div>
      {cashFlowLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CircularProgress size={20} sx={{ color: Colors.SKY_BLUE }} />
        </div>
      ) : (
        <>
          {cashFlow && (
            <div
              style={{
                maxHeight: "4rem",
                overflow: "auto",
                ...ScrollbarStyles,
              }}
            >
              {cashFlow?.highest?.map((item, index) => (
                <Typography key={index}>
                  {Object.entries(item)?.map(([day, value]) => (
                    <div
                      key={day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontFamily: "Nunito" }}>{day}</span>
                      <span
                        style={{
                          fontFamily: "Nunito",
                          color: Colors.SKY_BLUE,
                          fontWeight: 600,
                        }}
                      >
                        {value}%
                      </span>
                    </div>
                  ))}
                </Typography>
              ))}

              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box
                  sx={{ padding: "1rem", width: "200px", borderRadius: "10px" }}
                >
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontFamily: "Nunito",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Other Days
                  </Typography>
                  {cashFlow?.others?.map((item, index) => (
                    <Typography key={index}>
                      {Object.entries(item)?.map(([day, value]) => (
                        <div
                          key={day}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span style={{ fontFamily: "Nunito" }}>{day}</span>
                          <span
                            style={{
                              fontFamily: "Nunito",
                              color: Colors.SKY_BLUE,
                              fontWeight: 600,
                            }}
                          >
                            {value}%
                          </span>
                        </div>
                      ))}
                    </Typography>
                  ))}
                </Box>
              </Popover>
            </div>
          )}
        </>
      )}
    </Grid>
  );
}
