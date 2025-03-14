import { Box, Grid, Hidden } from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../../config/default";
import ScrollbarStyles from "../customScroll";
import { useNavigate } from "react-router-dom";
import MuiModels from "../models";
import DeletePrompt from "../deletePrompt";

export default function OtherCreditors({ caseData, GetCaseDetails }) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "14rem",
        marginBottom: "0.5rem",
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
          }}
        >
          Other Creditors
        </p>
        <Box sx={{ marginTop: "0.5rem" }}>
          <MuiModels
            show="addCase"
            width="80vw"
            height="80vh"
            caseData={caseData}
          />
        </Box>
      </div>
      {caseData?.creditors?.length === 0 && (
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2rem" }}>
          <p
            style={{
              color: Colors.DIM_LIGHT_GRAY,
              fontFamily: "Nunito",
              fontSize: "13px",
            }}
          >
            No other creditors.
          </p>
        </Grid>
      )}
      {caseData?.creditors?.map((item, index) => {
        return (
          <Grid
            container
            key={index}
            sx={{
              display: "flex",
              backgroundColor: index % 2 === 0 ? Colors.WHITE : Colors.VIOLET,
              "&:hover": {
                backgroundColor: Colors.BG_LIGHT_GRAY,
              },

              cursor: "pointer",
              paddingRight: ".2rem",
              paddingLeft: ".2rem",
              height: "2rem",
              alignItems: "center",
            }}
            onClick={() => navigate(`/all-cases/${item?._id}`)}
          >
            <Grid item xs={11} md={8} lg={5}>
              <span
                style={{
                  color: Colors.DIM_LIGHT_GRAY,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                  fontSize: "11px",
                }}
              >
                <Hidden smDown>
                  <span
                    style={{
                      fontWeight: "700",
                      color: Colors.DARK_GRAY,
                      marginRight: "1rem",
                    }}
                  >
                    Name
                  </span>
                </Hidden>
                {item?.creditor?.businessInformation?.companyName}
              </span>
            </Grid>
            <Hidden mdDown>
              <Grid item xs={3} sm={4} lg={6}>
                <span
                  style={{
                    color: Colors.DIM_LIGHT_GRAY,
                    fontWeight: "600",
                    fontFamily: "Nunito",
                    fontSize: "11px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      color: Colors.DARK_GRAY,
                      marginRight: "1rem",
                    }}
                  >
                    Case Code
                  </span>

                  {item?.caseCode}
                </span>
              </Grid>
            </Hidden>
            <Grid
              item
              xs={1}
              sm={1}
              lg={1}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <DeletePrompt
                buttonName="Delete"
                heading="Delete Creditor"
                text={`Are you sure you want to delete ${item?.creditor?.businessInformation?.companyName}?`}
                creditorId={item?._id}
                loading={deleting}
                GetCaseDetails={GetCaseDetails}
                setLoading={setDeleting}
                id={caseData?._id}
              />
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
