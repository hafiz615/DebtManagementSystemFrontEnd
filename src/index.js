import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "@fontsource/nunito";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastProvider } from "./toast/toastContext";
import { Provider } from "react-redux";
import { store, persistor } from ".././src/redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import CustomToaster from "./toast/customToaster";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <App />
          <CustomToaster />
        </ToastProvider>
      </PersistGate>
    </Provider>
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
