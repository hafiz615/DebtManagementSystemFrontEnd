import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, Slider } from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";
import { useToast } from "../../toast/toastContext";
import { GetAllUsers, UpdateCase } from "../../services/services";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import StatusAutoComplete from "../settingsScreen/statusAutoComplete";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function EditPipelineCase({
  handleClose,
  item,
  GetAllPipelineDetail,
}) {
  const { showToast } = useToast();
  const [value, setValue] = useState(item?.confidence || "");
  const [estimatedClose, setEstimatedClose] = useState(item?.status || "");
  const [user, setUser] = useState(item?.caseOwner || "");
  const [totalDebt, setTotalDebt] = useState(item?.remaining || "");
  const [usersArray, setUsersArray] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [status, setStatus] = useState(item?.status || "");
  //   const [notes, setNotes] = useState(item?.creditor?.notes || "");

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const GetUsers = async () => {
    const res = await GetAllUsers(0, 0, false, false);
    if (res?.status === 200) {
      setUsersArray(res?.data?.data?.users);
    }
  };

  const allUsers = usersArray ? usersArray?.map((users) => users?.name) : [];

  useEffect(() => {
    GetUsers();
  }, []);

  const editPipelineCase = async () => {
    setLoading(true);

    const params = {
      caseOwner: user,
      status: estimatedClose,
      remaining: parseInt(totalDebt),
      confidence: value || 0,
    };

    const editCaseResponse = await UpdateCase(params, item?._id);
    if (editCaseResponse?.status === 200) {
      showToast(editCaseResponse?.data?.message, "success");
      GetAllPipelineDetail(true);
    } else {
      const errorMessage = editCaseResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
    handleClose();
  };

  const inputStyling = {
    backgroundColor: Colors.BG_LIGHT_GRAY,
    marginTop: "1rem",
    marginBottom: "1rem",
    height: "2.5rem",
    color: Colors.DIM_LIGHT_GRAY,
    paddingLeft: "1rem",
    border: "none",
    outline: "none",
    borderRadius: "5px",
    width: "100%",
    fontFamily: "Nunito",
  };

  return (
    <>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Edit Case
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box>
        <div
          style={{
            display: "flex",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_LARGE,
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            Estimated Close
            <input
              type="text"
              placeholder="Status"
              value={estimatedClose}
              onChange={(e) => setEstimatedClose(e.target.value)}
              style={inputStyling}
            />
          </div>

          <div style={{ width: "45%" }}>
            Total Debt
            <input
              type="number"
              min={0}
              placeholder="Total Debt"
              value={totalDebt}
              onChange={(e) => setTotalDebt(e.target.value)}
              style={inputStyling}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_LARGE,
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            User
            <StatusAutoComplete
              arrayStatus={allUsers}
              setValue={setUser}
              value={user}
              text={item?.caseOwner}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_LARGE,
          }}
        >
          Confidence {value || 0}%
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </div>

        {/* <div>
          Notes
          <textarea
            placeholder="Description"
            rows="4"
            style={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              border: "none",
              outline: "none",
              minWidth: "100%",
              maxWidth: "100%",
              padding: "1em",
              fontFamily: "Nunito",
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div> */}

        <Box sx={lineStyle} />
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="SAVE"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={editPipelineCase}
          loading={loading}
        />
      </Box>
    </>
  );
}
