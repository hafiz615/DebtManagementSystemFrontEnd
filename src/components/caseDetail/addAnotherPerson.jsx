import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Colors } from "../../config/default";
import TextButton from "../button";
import { useToast } from "../../toast/toastContext";
import {
  Close,
  Mic,
  MicOff,
  PauseCircle,
  PlayCircle,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  CreateParticipant,
  DeleteParticipants,
  UpdateParticipants,
} from "../../services/services";
import Prompt from "../prompt";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function AddAnotherPerson({
  participants,
  conferenceSid,
  handleClose,
  userNumbers,
}) {
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  // const [userNumbers, setUsersNumbers] = useState([]);

  // const getAllUsersNumber = async () => {
  //   const res = await GetAllUsersNumbers();
  //   setUsersNumbers(res?.data?.data);
  // };
  // useEffect(() => {
  //   getAllUsersNumber();
  // }, []);
  const options =
    userNumbers?.map((user) => ({
      label: `${user?.name} – ${user?.twilioNumber}`,
      value: user?.twilioNumber,
    })) || [];

  const createParticipant = async () => {
    const params = {
      to: phoneNumber,
      conferenceSid: conferenceSid,
    };
    setButtonLoading(true);
    const res = await CreateParticipant(params);
    if (res?.status === 201) {
      showToast(res?.data?.message, "success");
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setButtonLoading(false);
  };

  const toggleMute = async (index) => {
    const participant = participants[index];
    if (!participant?.callSid || !participant?.conferenceSid) {
      showToast("Missing participant data", "error");
      return;
    }
    const params = {
      callSid: participant.callSid,
      conferenceSid: participant.conferenceSid,
      updateOptions: {
        muted: !participant.muted,
      },
    };
    const res = await UpdateParticipants(params);
    if (res?.status === 200) {
      showToast(res?.data?.message || "Participant updated", "success");
    } else {
      const errorMessage =
        res?.response?.data?.message || "Failed to update participant";
      showToast(errorMessage, "error");
    }
  };

  const toggleHold = async (index) => {
    const participant = participants[index];

    if (!participant?.callSid || !participant?.conferenceSid) {
      showToast("Missing participant data", "error");
      return;
    }
    const params = {
      callSid: participant?.callSid,
      conferenceSid: participant?.conferenceSid,
      updateOptions: participant?.hold
        ? { hold: false }
        : {
            hold: true,
            holdUrl: "https://api.twilio.com/cowbell.mp3",
          },
    };

    const res = await UpdateParticipants(params);
    if (res?.status === 200) {
      showToast(
        res?.data?.message || "Participant hold status updated",
        "success"
      );
    } else {
      const errorMessage =
        res?.response?.data?.message || "Failed to update hold status";
      showToast(errorMessage, "error");
    }
  };
  const deleteParticipant = async (index, length) => {
    const participant = participants[index];
    if (!participant?.callSid || !participant?.conferenceSid) {
      showToast("Missing participant data", "error");
      return;
    }

    const params = {
      CallSid: participant.callSid,
      ConferenceSid: participant.conferenceSid,
    };

    const deletion = await DeleteParticipants(params);
    if (deletion?.status === 200) {
      showToast(deletion?.data?.message, "success");
    } else {
      showToast(
        deletion?.response?.data?.message || deletion?.data?.message,
        "error"
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            fontWeight: "bold",
            fontFamily: "Nunito",
          }}
        >
          Add Participant To Call
        </h3>
        <Tooltip title="Close Popup" placement="top-start">
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Tooltip>
      </Box>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Autocomplete
          freeSolo
          disablePortal
          options={options}
          sx={{ width: "100%" }}
          onChange={(event, selectedOption) => {
            if (selectedOption?.value) {
              setPhoneNumber(selectedOption?.value);
            }
          }}
          onInputChange={(event, value, reason) => {
            if (reason === "input") {
              const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
              setPhoneNumber(digitsOnly);
            }
          }}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          renderOption={(props, option) => <li {...props}>{option?.label}</li>}
          inputValue={phoneNumber}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select or type a number"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                maxLength: 12,
                inputMode: "numeric", // mobile-friendly numeric keyboard
                pattern: "[0-9]*", // restricts to numbers
              }}
            />
          )}
        />
      </div>
      <div
        style={{
          marginTop: "1.5em",
          gap: "1em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TextButton
          buttonText="Add Participant"
          height="2rem"
          width="12rem"
          onClick={createParticipant}
          loading={buttonLoading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          disabled={
            phoneNumber === "+1" || phoneNumber.replace(/\D/g, "").length < 2
          }
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h4 style={{ marginBottom: "1rem", fontFamily: "Nunito" }}>
          Users in Call
        </h4>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#f9f9f9",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", backgroundColor: "#e0e0e0" }}>
                <th style={{ padding: "10px", fontFamily: "Nunito" }}>User</th>
                <th style={{ padding: "10px", fontFamily: "Nunito" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {participants && participants?.length > 1 ? (
                participants
                  ?.filter(
                    (participant) =>
                      !(
                        participant?.startConferenceOnEnter === true &&
                        participant?.endConferenceOnExit === true
                      )
                  )
                  ?.map((participant, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                      <td>{participant?.to || "--"}</td>
                      <td
                        style={{ padding: "5px", display: "flex", gap: "1rem" }}
                      >
                        <Tooltip title={participant?.muted ? "Unmute" : "Mute"}>
                          <IconButton onClick={() => toggleMute(index)}>
                            {participant?.muted ? (
                              <MicOff color="primary" />
                            ) : (
                              <Mic color="primary" />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={participant?.hold ? "Unhold" : "Hold"}>
                          <IconButton onClick={() => toggleHold(index)}>
                            {participant?.hold ? (
                              <PlayCircle color="primary" />
                            ) : (
                              <PauseCircle color="primary" />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Prompt
                          heading="Remove Participant"
                          deleting="Removing Participant"
                          text="Are you sure you want to remove participant?"
                          iconSize="1.3rem"
                          handleDeleteParticipant={() =>
                            deleteParticipant(index, participants?.length)
                          }
                        />
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      fontFamily: "Nunito",
                    }}
                  >
                    No participant joined the call.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AddAnotherPerson;
