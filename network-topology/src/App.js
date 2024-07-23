import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css';
import NetworkTopologyBuilder from './NetworkTopologyBuilder';
import Grid from "./components/Grid";
import GridPage from "./components/GridPage";
import TransformerPage from "./components/TransformerPage";
import NetworkTopology from "./components/NetworkTopology";
import UserConfiguration from "./components/UserConfiguration";
import Page2 from "./LoadProfile/Page2";



function App() {
  return (
   
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<NetworkTopology/>}/>
     <Route path="/grid" element={<Grid/> }/>
     <Route path='/gridPage'element={<GridPage/>}/>
     <Route path="/transformers/:substationId" element={<TransformerPage />} />
     <Route path="/config" element={<UserConfiguration/>}></Route>
     <Route path="/p" element={<Page2/>}></Route>
     </Routes>
     </BrowserRouter>
  );
}

export default App;
