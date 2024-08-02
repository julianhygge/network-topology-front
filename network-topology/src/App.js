import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Grid from "components/Grid/Grid";
import GridPage from "components/Grid/GridPage";
import TransformerPage from "components/Transformer/TransformerPage";
import NetworkTopology from "components/Network/NetworkTopology";
import UserConfiguration from "components/House/HouseConfiguration";
import LoadBuilder from "components/LoadProfile/LoadBuilder";
import GenerationPage1 from "components/LoadProfile/GenerationPage1";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NetworkTopology />} />
        <Route path="/grid" element={<Grid />} />
        <Route path='/gridPage' element={<GridPage />} />
        <Route path="/transformers/:substationId" element={<TransformerPage />} />
        <Route path="/config/:houseId" element={<UserConfiguration />}></Route>
        <Route path="/loadBuilder/:houseId" element={<LoadBuilder />}></Route>
        <Route path="/generationEngine/:houseId" element={<GenerationPage1 />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
