import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HMSRoomProvider>
        <CssBaseline />
        <App />
      </HMSRoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
