import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Colors } from "../../config/default";
import TextButton from "../button";
import { useToast } from "../../toast/toastContext";
import { Mic, MicOff, PauseCircle, PlayCircle } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  CreateParticipant,
  DeleteParticipants,
  GetAllUsersNumbers,
  UpdateParticipants,
} from "../../services/services";
import Prompt from "../prompt";

function AddAnotherPerson({
  handleClose,
  conferenceRoomData,
  participants,
  getAllParticipant,
}) {
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userNumbers, setUsersNumbers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllParticipant();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getAllUsersNumber = async () => {
    const res = await GetAllUsersNumbers();
    setUsersNumbers(res?.data?.data);
  };
  useEffect(() => {
    getAllUsersNumber();
  }, []);

  const createParticipant = async () => {
    const params = {
      to: phoneNumber,
      conferenceRoom: conferenceRoomData,
    };
    setButtonLoading(true);
    const res = await CreateParticipant(params);
    if (res?.status === 201) {
      showToast(res?.data?.message, "success");
      getAllParticipant();
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
      getAllParticipant();
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
      getAllParticipant();
    } else {
      const errorMessage =
        res?.response?.data?.message || "Failed to update hold status";
      showToast(errorMessage, "error");
    }
  };
  const deleteParticipant = async (index) => {
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
      getAllParticipant();
    } else {
      showToast(
        deletion?.response?.data?.message || deletion?.data?.message,
        "error"
      );
    }
  };

  return (
    <>
      <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Add Person to Call
      </h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <PhoneInput
          country={"us"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber("+" + phone)}
          inputStyle={{ width: "100%" }}
        />
        {userNumbers?.length > 0 && (
          <div
            style={{
              width: "100%",
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {userNumbers?.length > 0 && (
              <select
                defaultValue=""
                onChange={(e) => {
                  const selectedNumber = e.target.value;
                  if (selectedNumber) {
                    setPhoneNumber(selectedNumber);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontFamily: "Nunito",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select from saved numbers
                </option>
                {userNumbers?.map((user, index) => (
                  <option key={index} value={user?.twilioNumber}>
                    {user?.name} – {user?.twilioNumber}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
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
          buttonText="Cancel"
          height="2rem"
          width="8rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="Add"
          height="2rem"
          width="8rem"
          onClick={createParticipant}
          loading={buttonLoading}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontFamily: "Nunito" }}>
          Users in Call
        </h4>
        <div
          style={{
            maxHeight: "200px", // Change as needed
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
              {participants && participants.length !== 1 ? (
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
                            deleteParticipant(index)
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
