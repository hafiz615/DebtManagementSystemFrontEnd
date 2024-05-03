import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import UserListPage from "./pages/userListPage";
import HomePage from "./pages/homePage";
import AuthorizationPage from "./pages/authorizationPage";
import DebtorDetailsPage from "./pages/debtorDetailsPage";
import CreditorDetailsPage from "./pages/creditorDetailsPage";
import PaymentPage from "./pages/paymentPage";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route exact path="/home" element={<HomePage />} />
      <Route exact path="/user-listing" element={<UserListPage />} />
      <Route
        exact
        path="/authorization-details"
        element={<AuthorizationPage />}
      />
      <Route exact path="/debtor-details" element={<DebtorDetailsPage />} />
      <Route exact path="/creditor-details" element={<CreditorDetailsPage />} />
      <Route exact path="/payment-details" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
