import React from "react";
import ReactDOM from "react-dom";
import { smartOutline } from "@theorem/react";
import App from "./App";

smartOutline();

const el = document.createElement("div");
document.body.appendChild(el);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  el
);

// HMR below is used for non-React files
// https://www.npmjs.com/package/@snowpack/plugin-react-refresh
if (import.meta.hot) import.meta.hot.accept();
