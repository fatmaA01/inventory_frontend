import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const AuthRoutes = ({ children }) => {

    if (localStorage.getItem('auth')) {
        return (
            <>
                <Sidebar />
                <div className="main">
                    <Navbar />
                    {children}
                </div>
            </>
        )
    } else { window.location.href = '/login' }
  
}

export default AuthRoutes
