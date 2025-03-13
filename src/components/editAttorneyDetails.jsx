import React, { useState } from "react";
import { Colors } from "../config/default";
import { Grid, Typography } from "@mui/material";
import TextButton from "./button";
import { UpdateAttorneyDetail } from "../services/services";
import { useToast } from "../toast/toastContext";

export default function EditAttorneyDetails({
  data,
  attorneyId,
  caseData,
  GetCaseDetails,
  getAttorneyData,
  handleClose,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.name || "",
    email: data?.email || "",
    SSN: data?.SSN || "",
    phone: data?.phone || "",
    city: data?.city || "",
    attorneyFee: data?.attorneyFee || "0",
    address: data?.address || "",
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
    }
  };

  return (
    <div>
      <Typography sx={{ fontFamily: "Nunito", fontWeight: "600", mb: "1rem" }}>
        Update Attorney Details
      </Typography>
      <Grid container sx={{ flexWrap: "wrap" }}>
        {Object.entries(formData)?.map(([key, value]) => (
          <div key={key} style={{ marginBottom: "10px", width: "50%" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Nunito",
              }}
            >
              {key}
            </label>
            <input
              type={key === "attorneyFee" ? "number" : "text"}
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
                width: "98%",
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
