import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import Dropdown from "./dropdown";
import { Colors } from "../config/default";
import TextButton from "./button";

export default function EditCaseCustomField({ handleClose }) {
  const menuItems = [
    { label: "Customer", value: "Customer" },
    { label: "On hold", value: "On hold" },
    { label: "Canceled", value: "Canceled" },
    { label: "Declared Bankruptcy", value: "Declared Bankruptcy" },
  ];
  const [status, setStatus] = useState("");
  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            color: Colors.BLACK,
            fontSize: "1rem",
          }}
        >
          Edit Custom Fields
        </Typography>
        <Box
          onClick={handleClose}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Close />
        </Box>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Grid
          container
          item
          xs={10}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            container
            item
            xs={5}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.BLACK,
                fontSize: "1rem",
              }}
            >
              Title
            </Typography>
            <Dropdown
              menuItems={menuItems}
              placeholder="Title"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="75%"
              selectedValue={status}
              setSelectedValue={setStatus}
            />
          </Grid>
          <Grid
            container
            item
            xs={5}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.BLACK,
                fontSize: "1rem",
              }}
            >
              Value
            </Typography>
            <input
              type="text"
              placeholder="Input Value"
              //   value={debtorBusinessDetails?.businessDescription}
              //   onChange={(e) =>
              //     handleBusinessDetailsChange(
              //       "businessDescription",
              //       e.target.value
              //     )
              //   }
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "75%",
              }}
            />
          </Grid>
        </Grid>
        <Grid container item xs={10}>
          <Grid
            container
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "right",
              marginTop: "2rem",
            }}
          >
            <TextButton
              buttonText="UPDATE"
              height="2rem"
              width="8rem"
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
