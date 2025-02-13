import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import UserListPage from "./pages/userListPage";
import HomePage from "./pages/homePage";
import AuthorizationPage from "./pages/authorizationPage";
import HorizontalLinearStepperPage from "./pages/stepperPage";
import VerifyProfilePage from "./pages/verifyProfilePage";
import Protected from "./components/protected";
import BulkCases from "./pages/bulkCases";
import ClientListPage from "./pages/clientListPage";
import CaseCodeDetail from "./pages/caseCodeDetail";
import ClientListDetailsPage from "./pages/clientListDetails";
import DashboardPage from "./pages/dashboardPage";
import SettingsPage from "./pages/settingsPage";
import CreditorListPage from "./pages/creditorListPage";
import PipelinesPage from "./pages/pipelinePage";
import UpdateCase from "./pages/updateCase";
import InboxPage from "./pages/inboxPage";
import { useEffect, useState } from "react";
import {
  GetAllUserCases,
  GetCallerName,
  GetCallSid,
} from "./services/services";
import { Device } from "@twilio/voice-sdk";
import IncomingCall from "./components/incomingCall";
import SmsPage from "./pages/smsPage";

function App() {
  const [incomingCall, setIncomingCall] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callInterval, setCallInterval] = useState(null);
  const [allCases, setAllCases] = useState({});
  const [callSid, setCallSid] = useState();
  const [callerName, setCallerName] = useState();
  const [caseMenuActive, setCaseMenuActive] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("twilioToken"));

  const getCreditorCompanies = async () => {
    const res = await GetAllUserCases();
    if (res?.status === 200) {
      setAllCases(res?.data?.data);
    }
  };

  const getCallSID = async (callSid) => {
    const SIDres = await GetCallSid(callSid);
    if (SIDres?.status === 200) {
      setCallSid(SIDres?.data?.data);
    }
  };

  const getNameFromCall = async (from) => {
    const payoload = {
      from: from.replace(/^client:\+1/, ""),
    };
    const callerNameRes = await GetCallerName(payoload);
    if (callerNameRes?.status === 200) {
      setCallerName(callerNameRes?.data?.data);
    }
  };

  const initializeDevice = () => {
    const token = localStorage.getItem("twilioToken") || "";
    if (window.twilioDevice) {
      window.twilioDevice.destroy();
    }
    const twilioDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });

    twilioDevice.register();
    window.twilioDevice = twilioDevice;

    twilioDevice.on("incoming", (incomingCall) => {
      setCaseMenuActive(false);
      setIncomingCall(incomingCall);
      setIsModalOpen(true);
      getCreditorCompanies();
      getNameFromCall(incomingCall?.parameters?.From);
      getCallSID(incomingCall?.parameters?.CallSid);

      incomingCall.on("disconnect", () => {
        setIncomingCall(null);
        setCallInterval(null);
        setCallDuration(0);
        setCaseMenuActive(true);
        setCallerName("");
      });

      incomingCall.on("cancel", () => {
        setIncomingCall(null);
        setIsModalOpen(false);
        setCallInterval(null);
        setCallDuration(0);
        setCallerName("");
      });
    });
  };

  useEffect(() => {
    const updateToken = () => {
      const newToken = localStorage.getItem("twilioToken");
      if (newToken !== token) {
        setToken(newToken);
      }
    };
    window.addEventListener("storage", updateToken);
    const interval = setInterval(updateToken, 100);
    return () => {
      window.removeEventListener("storage", updateToken);
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    if (token) {
      initializeDevice();
    }
    return () => {
      clearInterval(callInterval);
    };
  }, [token]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route
          exact
          path="/home"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />
        <Route
          exact
          path="/user-listing"
          element={
            <Protected>
              <UserListPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/authorization-details"
          element={
            <Protected>
              <AuthorizationPage />
            </Protected>
          }
        />
        <Route
          exact
          path="/case-details"
          element={
            <Protected>
              <HorizontalLinearStepperPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/bulk-cases"
          element={
            <Protected>
              <BulkCases />
            </Protected>
          }
        />

        <Route
          exact
          path="/update-cases/:id"
          element={
            <Protected>
              <UpdateCase />
            </Protected>
          }
        />

        <Route
          exact
          path="/client-listing"
          element={
            <Protected>
              <ClientListPage />
            </Protected>
          }
        />
        <Route
          exact
          path="/:userRole/list-details/:id"
          element={
            <Protected>
              <ClientListDetailsPage />
            </Protected>
          }
        />
        <Route
          exact
          path="/analytics"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          exact
          path="/inbox"
          element={
            <Protected>
              <InboxPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/all-cases/:id"
          element={
            <Protected>
              <CaseCodeDetail />
            </Protected>
          }
        />

        <Route
          exact
          path="/creditor-listing"
          element={
            <Protected>
              <CreditorListPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/pipelines"
          element={
            <Protected>
              <PipelinesPage />
            </Protected>
          }
        />

        <Route
          exact
          path="/sms"
          element={
            <Protected>
              <SmsPage />
            </Protected>
          }
        />

        <Route exact path="/set-password" element={<VerifyProfilePage />} />
      </Routes>
      {location.pathname !== "/" && (
        <IncomingCall
          incomingCall={incomingCall}
          setIncomingCall={setIncomingCall}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          callDuration={callDuration}
          setCallDuration={setCallDuration}
          callInterval={callInterval}
          setCallInterval={setCallInterval}
          allCases={allCases}
          callSid={callSid}
          caseMenuActive={caseMenuActive}
          setCaseMenuActive={setCaseMenuActive}
          callerName={callerName}
        />
      )}
    </>
  );
}

export default App;
