import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import UserListPage from "./pages/userListPage";
import HomePage from "./pages/homePage";
import AuthorizationPage from "./pages/authorizationPage";

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
    </Routes>
  );
}

export default App;
