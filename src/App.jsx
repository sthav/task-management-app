import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/login/Login";
import SignUp from "../src/pages/signup/SignUp";
import Task from "./pages/task/Task";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/tasks' element={<Task />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
