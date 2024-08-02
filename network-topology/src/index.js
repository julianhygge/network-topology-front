import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Grid from "./components/Grid";
import GridPage from "./components/GridPage";
import TransformerPage from "./components/TransformerPage";
import NetworkTopology from "./components/NetworkTopology";
import UserConfiguration from "./components/UserConfiguration";
import FileUpload from "./LoadProfile/FileUpload";

const router = createBrowserRouter(
  [
    { path: '/', element: <NetworkTopology /> },
    { path: "grid", element: <Grid /> },
    { path: 'gridPage', element: <GridPage /> },
    { path: "transformers/:substationId", element: <TransformerPage /> },
    { path: "config", element: <UserConfiguration /> },
    { path: "p", element: <FileUpload /> },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


