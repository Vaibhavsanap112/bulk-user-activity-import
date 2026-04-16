import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

import {BrowserRouter, Routes, Route}  from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Errors from './pages/Errors'
import Navbar from './components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
  
     <BrowserRouter>

     <Navbar></Navbar>

     <Routes>

      <Route path='/' element={<Login></Login>}></Route>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/upload' element={<ProtectedRoute> <Upload></Upload></ProtectedRoute>}></Route>
      <Route path='/errors' element={<ProtectedRoute><Errors></Errors></ProtectedRoute>}></Route>
     </Routes>
     
     
     
     </BrowserRouter>
  )
}

export default App
