import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "@fontsource/nunito";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastProvider } from "./toast/toastContext";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import CustomToaster from "./toast/customToaster";
import FallBack from "./components/showError";
import { ErrorBoundary } from "react-error-boundary";

// Get the root element from the DOM
const container = document.getElementById("root");

// Ensure the container is not null before creating the root
if (container) {
  const root = createRoot(container);
  root.render(
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            <ErrorBoundary FallbackComponent={FallBack}>
              <App />
            </ErrorBoundary>
            <CustomToaster />
          </ToastProvider>
        </PersistGate>
      </Provider>
    </Router>
  );
} else {
  console.error("Root element not found");
}

reportWebVitals();
