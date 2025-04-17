import React, { useEffect, useState } from "react";
import { AssignLawfirmToCase, GetLawfirm } from "../../services/services";
import TextButton from "../button";
import { Colors } from "../../config/default";
import { Checkbox, Grid, Typography } from "@mui/material";
import ScrollbarStyles from "../customScroll";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../../constants/appConstants";
import { useToast } from "../../toast/toastContext";

export default function SelectLawfirm({
  caseData,
  handleClose,
  getAttorneyData,
  GetCaseDetails,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { showToast } = useToast();

  const handleChange = (id) => {
    setSelectedId(id);
  };

  const getLawfirms = async () => {
    setLoading(true);
    const res = await GetLawfirm();
    setData(res?.data?.data);
    setLoading(false);
  };

  const handleSave = async () => {
    setButtonLoading(true);
    const payload = {
      lawfirmId: selectedId,
    };
    const res = await AssignLawfirmToCase(payload, caseData?._id);
    if (res?.data?.data) {
      showToast(res?.data?.message, "success");
      getAttorneyData();
      GetCaseDetails(caseData?._id);
      handleClose();
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    getLawfirms();
  }, []);

  return (
    <div>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontSize: FONT_SIZE_XL,
          fontWeight: 600,
          mb: "10px",
        }}
      >
        Select Lawfirm
      </Typography>
      <Grid
        sx={{
          height: "35vh",
          overflowY: "auto",
          ...ScrollbarStyles,
        }}
      >
        {data?.map((item) =>
          item?.lawfirmCompanyName ? (
            <div
              key={item?._id}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Checkbox
                size="small"
                checked={selectedId === item?._id}
                onChange={() => handleChange(item?._id)}
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: "22px" },
                  color: Colors.DIM_LIGHT_GRAY,
                  "&.Mui-checked": {
                    color: Colors.SKY_BLUE,
                  },
                }}
              />
              <Typography
                sx={{ fontFamily: "Nunito", fontSize: FONT_SIZE_LARGE }}
              >
                {item?.lawfirmCompanyName}
              </Typography>
            </div>
          ) : null
        )}
      </Grid>
      <div
        style={{
          marginTop: "1em",
          gap: "1em",
          display: "flex",
          justifyContent: "right",
        }}
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
          onClick={handleSave}
          loading={buttonLoading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>
    </div>
  );
}
