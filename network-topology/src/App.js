import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css';
import NetworkTopologyBuilder from './NetworkTopologyBuilder';
import Grid from "./components/Grid";
import GridPage from "./components/GridPage";
import TransformerPage from "./components/TransformerPage";
import NetworkTopology from "./components/NetworkTopology";
import UserConfiguration from "./components/UserConfiguration";
import Page2 from "./LoadProfile/Page2";
import LoadBuilder from "./LoadProfile/LoadBuilder";



function App() {
  return (
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<NetworkTopology/>}/>
     <Route path="/grid" element={<Grid/> }/>
     <Route path='/gridPage'element={<GridPage/>}/>
     <Route path="/transformers/:substationId" element={<TransformerPage />} />
     <Route path="/config/:houseId" element={<UserConfiguration/>}></Route>
     <Route path="/p" element={<Page2/>}></Route>
     <Route path="/loadBuilder/:houseId" element={<LoadBuilder/>}></Route>
     </Routes>
     </BrowserRouter>
  );
}

export default App;
