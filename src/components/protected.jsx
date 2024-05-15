import React from "react";

import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const authUser = localStorage.getItem("token");
  // const userRole = localStorage.getItem("userRole");
  if (!authUser) {
    return <Navigate to="/" />;
  }

  return children;
}
