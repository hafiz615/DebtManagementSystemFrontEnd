import React, { useState, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import { GetCallToken } from "../services/services";
const TwilioCall = () => {
  const [device, setDevice] = useState(null);
  const [token, setToken] = useState("");
  const [clientName, setClientName] = useState("");
  const [call, setCall] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  const log = (message) => {
    setLogMessages((prevLogs) => [...prevLogs, message]);
  };

  const initializeDevice = (token) => {
    log("Initializing device");
    const twilioDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });

    addDeviceListeners(twilioDevice);
    twilioDevice.register();
    setDevice(twilioDevice);
  };

  const addDeviceListeners = (twilioDevice) => {
    twilioDevice.on("registered", () => {
      log("Twilio.Device ready to make and receive calls!");
    });

    twilioDevice.on("error", (error) => {
      log(`Twilio.Device Error: ${error.message}`);
    });

    twilioDevice.on("incoming", (incomingCall) => {
      log(`Incoming call from ${incomingCall.parameters.From}`);
      setIncomingCall(incomingCall);
    });

    twilioDevice.audio.on("deviceChange", updateAudioDevices);
  };

  const startupClient = async () => {
    log("Requesting Access Token...");
    try {
      const response = await GetCallToken();
      log("Got a token.");
      setToken(response.data.data.token);
      setClientName(response.data.data.identity);
      initializeDevice(response.data.data.token);
    } catch (err) {
      console.error(err);
      log("An error occurred. See the browser console for more information.");
    }
  };

  const makeOutgoingCall = async (phoneNumber) => {
    if (!device) {
      log("Unable to make call. Device is not initialized.");
      return;
    }

    const params = { To: phoneNumber };
    log(`Attempting to call ${params.To}...`);

    const newCall = await device.connect({ params });
    setCall(newCall);

    newCall.on("accept", () => log("Call in progress..."));
    newCall.on("disconnect", () => {
      log("Call disconnected.");
      setCall(null);
    });
    newCall.on("cancel", () => {
      log("Call canceled.");
      setCall(null);
    });
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      incomingCall.accept();
      log("Accepted incoming call.");
      setIncomingCall(null);
    }
  };

  const rejectIncomingCall = () => {
    if (incomingCall) {
      incomingCall.reject();
      log("Rejected incoming call.");
      setIncomingCall(null);
    }
  };

  const hangupCall = () => {
    if (call) {
      call.disconnect();
      log("Hanging up...");
      setCall(null);
    }
  };

  const updateAudioDevices = () => {
    if (device) {
      log("Updating audio devices.");
      // Update device UI as per your application's requirements
    }
  };
  useEffect(() => {
    startupClient();
  }, []);

  return (
    <div>
      <header>
        <h1>Twilio Voice React App</h1>
      </header>

      <main>
        <section>
          <h2>Your Device Info</h2>
          <div>
            Your client name: <strong>{clientName}</strong>
          </div>
        </section>

        <section>
          <h2>Make a Call</h2>
          <input
            type="text"
            placeholder="Enter a phone number"
            id="phone-number"
          />
          <button
            onClick={() => {
              const phoneNumber = document.getElementById("phone-number").value;
              makeOutgoingCall(phoneNumber);
            }}
          >
            Call
          </button>
          {call && <button onClick={hangupCall}>Hang Up</button>}
        </section>

        {incomingCall && (
          <section>
            <h2>Incoming Call</h2>
            <p>Incoming call from {incomingCall.parameters.From}</p>
            <button onClick={acceptIncomingCall}>Accept</button>
            <button onClick={rejectIncomingCall}>Reject</button>
          </section>
        )}

        <section>
          <h2>Event Log</h2>
          <div>
            {logMessages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TwilioCall;
