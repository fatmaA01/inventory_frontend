import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './assets/css/App.css'

import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'
import Home from './Pages/Dashboad'
import Products from './Pages/Products'
import Customer from './Pages/Customer'
import Sales from './Pages/Sales' 
import AuthRoutes from './Components/AuthRoutes';
import Login from './Pages/Login';
import Cart from './Pages/Cart';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoutes><Home /></AuthRoutes>} />
        <Route path="/Products" element={<AuthRoutes><Products /></AuthRoutes>} />
        <Route path="/Customer" element={<AuthRoutes><Customer /></AuthRoutes>} />
        <Route path="/Sales" element={<AuthRoutes><Sales /></AuthRoutes>} />
        <Route path="/cart" element={<AuthRoutes><Cart /></AuthRoutes>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
