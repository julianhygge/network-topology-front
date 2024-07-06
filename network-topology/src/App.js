import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css';
import NetworkTopologyBuilder from './NetworkTopologyBuilder';
import Grid from "./components/Grid";


function App() {
  return (
   
     <BrowserRouter>
     <Routes>

     <Route path='/' element={<NetworkTopologyBuilder/>}/>

     <Route path="/grid" element={<Grid/> }/>
     </Routes>
     </BrowserRouter>
  );
}

export default App;
