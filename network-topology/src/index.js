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
import Page2 from "./LoadProfile/Page2";

const router = createBrowserRouter(
  [
    { path: '/', element: <NetworkTopology /> },
    { path: "grid", element: <Grid /> },
    { path: 'gridPage', element: <GridPage /> },
    { path: "transformers/:substationId", element: <TransformerPage /> },
    { path: "config", element: <UserConfiguration /> },
    { path: "p", element: <Page2 /> },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


