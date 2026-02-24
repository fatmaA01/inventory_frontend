import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './assets/css/App.css'

import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'
import Home from './Pages/Dashboad'
import Products from './Pages/Products'
import Customer from './Pages/Customer'
import Sales from './Pages/Sales' 

function App() {

  return (
    <>
    <BrowserRouter>
      {/* Routes */}
      <Sidebar />
      <div className="main">
      <Navbar />   
         <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Customer" element={<Customer />} />
        <Route path="/Sales" element={<Sales />} />
      
      </Routes>
      </div>
    </BrowserRouter>

    </>
  )
}

export default App
