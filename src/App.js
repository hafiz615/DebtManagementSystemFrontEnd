import "./App.css";

import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import PersistentDrawerLeft from "./pages/openDrawer";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route exact path="/dashboard" element={<PersistentDrawerLeft />} />
    </Routes>
  );
}

export default App;
