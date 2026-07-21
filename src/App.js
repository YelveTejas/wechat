import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ErrorBoundary from "./components/ErrorBoundary";


const   App=()=> {

  return (
    <ErrorBoundary>
     <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/chat' element={<Chat/>}></Route>
    <Route path='*' element={<Navigate to='/' replace />}></Route>
   </Routes>
    </ErrorBoundary>
  );
}

export default App;
