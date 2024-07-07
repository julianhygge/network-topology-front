import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css';
import NetworkTopologyBuilder from './NetworkTopologyBuilder';
import Grid from "./components/Grid";
import GridPage from "./components/GridPage";


function App() {
  return (
   
     <BrowserRouter>
     <Routes>

     <Route path='/' element={<NetworkTopologyBuilder/>}/>

     <Route path="/grid" element={<Grid/> }/>
     <Route path='/gridPage'element={<GridPage/>}/>
     </Routes>
     </BrowserRouter>
  );
}

export default App;
