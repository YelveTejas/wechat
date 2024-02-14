import { Box, Button, Image, Menu, Text } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";


const   App=()=> {
  return (
    <>
      <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/chat' element={<Chat/>}></Route>
  </Routes>

      
    </>
  );
}

export default App;
