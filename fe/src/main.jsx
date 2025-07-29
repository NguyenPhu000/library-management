import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Suppress verbose logs unless explicitly enabled
if (!import.meta.env.VITE_VERBOSE_LOG) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Keep warn & error
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
