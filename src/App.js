import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import './App.css'
function App() {
  return (
   <div className="App">
  <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/chat' element={<Chat/>}></Route>
  </Routes>
 
   </div>
  )
}

export default App;
