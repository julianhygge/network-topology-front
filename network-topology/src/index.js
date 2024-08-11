
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
import { BatteryProfile, EVProfile, Flags, SolarProfile, WindProfile } from "components/House/OtherHouseConfigurationOptions";
import LoadProfile from "components/LoadProfile/LoadProfile";
import PredefinedTemplates from "components/LoadProfile/PredefinedTemplates";
import FileUpload from "components/LoadProfile/FileUpload";
import LoadProfileFileList from "components/LoadProfile/LoadProfileFileList";

const router = createBrowserRouter(
  [
    { path: '/', element: <NetworkTopology /> },
    { path: "/grid", element: <Grid /> },
    { path: '/gridPage', element: <GridPage /> },
    { path: "/transformers/:substationId", element: <TransformerPage /> },
    {
      path: "/config/:houseId", element: <UserConfiguration />,
      children: [
        {
          path: "load-profile", element: <LoadProfile />, children: [
            { path: "builder", element: <LoadBuilder /> },
            { path: "generationEngine", element: <GenerationPage1 /> },
            { path: "predefinedTemplates", element: <PredefinedTemplates /> },
            {path:"fileUpload",element:<FileUpload/>},
            {path:"fileList",element:<LoadProfileFileList/>}
          ]
        },
        { path: "solar-profile", element: <SolarProfile /> },
        { path: "battery-profile", element: <BatteryProfile /> },
        { path: "flags", element: <Flags /> },
        { path: "ev-profile", element: <EVProfile /> },
        { path: "wind-profile", element: <WindProfile /> }
      ]
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


