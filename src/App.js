import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import UserListPage from "./pages/userListPage";
import DashboardPage from "./pages/dashboardPage";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route exact path="/user-listing" element={<UserListPage />} />
      <Route exact path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
