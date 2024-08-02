
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import Grid from "components/Grid/Grid";
import GridPage from "components/Grid/GridPage";
import TransformerPage from "components/Transformer/TransformerPage";
import NetworkTopology from "components/Network/NetworkTopology";
import UserConfiguration from "components/House/HouseConfiguration";
import LoadBuilder from "components/LoadProfile/LoadBuilder";
import GenerationPage1 from "components/LoadProfile/GenerationPage1";
import React from "react";
import ReactDOM from 'react-dom/client';
const router = createBrowserRouter(
  [
    { path: '/', element: <NetworkTopology /> },
    { path: "/grid", element: <Grid /> },
    { path: '/gridPage', element: <GridPage /> },
    { path: "/transformers/:substationId", element: <TransformerPage /> },
    { path: "/config/:houseId", element: <UserConfiguration /> },
    { path: "/loadBuilder/:houseId", element: <LoadBuilder /> },
    { path: "/generationEngine/:houseId", element: <GenerationPage1 /> },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


