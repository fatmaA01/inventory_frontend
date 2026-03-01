import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const AuthRoutes = ({ children }) => {

  if (!localStorage.getItem('auth')) {
    window.location.href = '/login'
    return null
  }

  return (
    <div className="d-flex vh-100">

      
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">

        <Navbar />

        <div className="container-fluid p-4 overflow-auto">
          {children}
        </div>

      </div>

    </div>
  )
}

export default AuthRoutes
