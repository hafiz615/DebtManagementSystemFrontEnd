import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TextButton from "./button";
import ScrollbarStyles from "./customScroll";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XL,
} from "../constants/appConstants";
import { Colors } from "../config/default";
import { GetAllUserCases, UpdateCallByCase } from "../services/services";
import { useToast } from "../toast/toastContext";

export default function SaveVoiceCase({ getVoiceMails, handleClose, data }) {
  const [selectedCase, setSelectedCase] = useState();
  const [selected, setSelected] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const { showToast } = useToast();

  const getAllCases = async () => {
    setPopupLoading(true);
    const res = await GetAllUserCases();
    if (res?.status == 200) {
      setAllCases(res?.data?.data);
    }
    setPopupLoading(false);
  };

  const handleCheckboxChange = (caseId) => {
    setSelected((prevSelected) =>
      prevSelected?.includes(caseId)
        ? prevSelected?.filter((id) => id !== caseId)
        : [...prevSelected, caseId]
    );
  };

  const handleCaseCheckboxChange = (debtor) => {
    setSelectedCase(debtor);
  };

  useEffect(() => {
    setSelected([]);
  }, [selectedCase]);

  useEffect(() => {
    getAllCases();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      caseIds: selected,
    };
    const res = await UpdateCallByCase(payload, data?.callSid);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      getVoiceMails(true);
      handleClose();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontSize: FONT_SIZE_XL,
          mb: "1rem",
          fontWeight: "600",
        }}
      >
        Save voicemail in respective case
      </Typography>
      {popupLoading ? (
        <Grid
          sx={{
            display: "flex",
            height: "40vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: Colors.SKY_BLUE }} size={30} />
        </Grid>
      ) : (
        <Grid
          sx={{
            display: "flex",
            overflowY: "auto",
            height: "40vh",
            ...ScrollbarStyles,
          }}
        >
          <div style={{ width: "48%" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                mb: "10px",
                fontWeight: "600",
              }}
            >
              Client Company Name
            </Typography>
            {Object.keys(allCases)?.map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Checkbox
                  checked={selectedCase === item}
                  onChange={() => handleCaseCheckboxChange(item)}
                  size="small"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "22px" },
                    color: Colors.DIM_LIGHT_GRAY,
                    "&.Mui-checked": {
                      color: Colors.SKY_BLUE,
                    },
                  }}
                />
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_MEDIUM }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </div>
          <div style={{ width: "48%" }}>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
                mb: "10px",
                fontWeight: "600",
              }}
            >
              Creditor Company Name
            </Typography>
            {allCases?.[selectedCase]?.map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Checkbox
                  checked={selected?.includes(item?.caseId)}
                  onChange={() => handleCheckboxChange(item?.caseId)}
                  size="small"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "22px" },
                    color: Colors.DIM_LIGHT_GRAY,
                    "&.Mui-checked": {
                      color: Colors.SKY_BLUE,
                    },
                  }}
                />
                <Typography
                  sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_MEDIUM }}
                >
                  {item?.creditorCompanyName}
                </Typography>
              </Box>
            ))}
          </div>
        </Grid>
      )}

      <Grid
        container
        sx={{ m: "10px 0px", justifyContent: "flex-end", gap: "10px" }}
      >
        <TextButton
          buttonText="Cancel"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          disabled={!selected?.length > 0}
          onClick={handleSave}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </div>
  );
}
