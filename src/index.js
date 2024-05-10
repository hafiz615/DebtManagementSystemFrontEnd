import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "@fontsource/nunito";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastProvider } from "./toast/toastContext";
import CustomToaster from "./toast/customToaster";

ReactDOM.render(
  <Router>
    <ToastProvider>
      <App />
      <CustomToaster />
    </ToastProvider>
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
