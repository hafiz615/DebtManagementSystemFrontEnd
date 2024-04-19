import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
