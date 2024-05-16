import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import UserListPage from "./pages/userListPage";
import HomePage from "./pages/homePage";
import AuthorizationPage from "./pages/authorizationPage";
import HorizontalLinearStepperPage from "./pages/stepperPage";
import VerifyProfilePage from "./pages/verifyProfilePage";
import Protected from "./components/protected";
import ClientListPage from "./pages/clientListPage";
function App() {
  return (
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
        path="/client-details"
        element={
          <Protected>
            <ClientListPage />
          </Protected>
        }
      />
      <Route exact path="/set-password" element={<VerifyProfilePage />} />
    </Routes>
  );
}

export default App;
