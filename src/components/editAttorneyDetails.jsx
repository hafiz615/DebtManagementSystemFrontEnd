import React, { useState } from "react";
import { Colors } from "../config/default";
import { Grid, Typography } from "@mui/material";
import TextButton from "./button";
import { UpdateAttorneyDetail } from "../services/services";
import { useToast } from "../toast/toastContext";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";

export default function EditAttorneyDetails({
  data,
  attorneyId,
  getAttorneyData,
  handleClose,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    city: data?.city || "",
  });
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    const payload = {
      ...formData,
    };
    const res = await UpdateAttorneyDetail(payload, attorneyId);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
      getAttorneyData();
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
          fontWeight: "600",
          mb: "1rem",
          fontSize: FONT_SIZE_XL,
        }}
      >
        Update Attorney Details
      </Typography>
      <Grid container sx={{ flexWrap: "wrap" }}>
        {Object.entries(formData)?.map(([key, value]) => (
          <div key={key} style={{ marginBottom: "10px", width: "50%" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Nunito",
                fontSize: FONT_SIZE_LARGE,
              }}
            >
              {key?.charAt(0).toUpperCase() + key?.slice(1)}
            </label>
            <input
              type={"text"}
              name={key}
              value={value}
              onChange={handleChange}
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "96%",
                fontSize: FONT_SIZE_LARGE,
              }}
            />
          </div>
        ))}
      </Grid>
      <Grid container sx={{ mt: "1rem", justifyContent: "right", gap: "10px" }}>
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
          onClick={handleUpdate}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </div>
  );
}
