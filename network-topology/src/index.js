import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import NetworkTopology from "components/Network/NetworkTopology";
import UserConfiguration from "components/House/HouseConfiguration";
import LoadBuilder from "components/LoadProfile/LoadBuilder";
import GenerationPage1 from "components/LoadProfile/GenerationPage1";
import React from "react";
import ReactDOM from 'react-dom/client';
import { BatteryProfile, EVProfile, Flags, WindProfile } from "components/House/OtherHouseConfigurationOptions";
import LoadProfile from "components/LoadProfile/LoadProfile";
import PredefinedTemplates from "components/LoadProfile/PredefinedTemplates";
import FileUpload from "components/LoadProfile/FileUpload";
import LoadProfileFileList from "components/LoadProfile/LoadProfileFileList";
import Login from "components/Auth/Login";
import AuthRoute from "ProtectedRoute/AuthRoute";
import SolarProfile from "components/solar/SolarProfile";

// const router = createBrowserRouter(
//   [
//     { path: '/login', element: <Login /> },
//     { path: '/', element: <NetworkTopology /> },
//     {
//       path: "/config/:houseId", element: <UserConfiguration />,
//       children: [
//         {
//           path: "load-profile", element: <LoadProfile />, children: [
//             { path: "builder", element: <LoadBuilder /> },
//             { path: "generationEngine", element: <GenerationPage1 /> },
//             { path: "predefinedTemplates", element: <PredefinedTemplates /> },
//             { path: "fileUpload", element: <FileUpload /> },
//             { path: "fileList", element: <LoadProfileFileList /> }
//           ]
//         },
//         { path: "solar-profile", element: <SolarProfile /> },
//         { path: "battery-profile", element: <BatteryProfile /> },
//         { path: "flags", element: <Flags /> },
//         { path: "ev-profile", element: <EVProfile /> },
//         { path: "wind-profile", element: <WindProfile /> }
//       ]
//     },
//   ]);

const router = createBrowserRouter([
  {
    path: '/', 
    element: <AuthRoute/>, // Protect the root route
    children: [
      { path: '/', element: <NetworkTopology /> }, // The home page or default route
    ]
  },
  {
    path: '/login',
    element: <AuthRoute isRestricted />, // Restrict access to the login page for authenticated users
    children: [
      { path: '/login', element: <Login /> }
    ]
  },
  {
    path: "/config/:houseId",
    element: <AuthRoute />, // Protect the UserConfiguration route with AuthRoute
    children: [
      {
        path: "", // Default path under /config/:houseId
        element: <UserConfiguration />, // Main configuration component
        children: [
          {
            path: "load-profile", element: <LoadProfile />, children: [
              { path: "builder", element: <LoadBuilder /> },
              { path: "generationEngine", element: <GenerationPage1 /> },
              { path: "predefinedTemplates", element: <PredefinedTemplates /> },
              { path: "fileUpload", element: <FileUpload /> },
              { path: "fileList", element: <LoadProfileFileList /> }
            ]
          },
          { path: "solar-profile", element: <SolarProfile /> },
          { path: "battery-profile", element: <BatteryProfile /> },
          { path: "flags", element: <Flags /> },
          { path: "ev-profile", element: <EVProfile /> },
          { path: "wind-profile", element: <WindProfile /> }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);