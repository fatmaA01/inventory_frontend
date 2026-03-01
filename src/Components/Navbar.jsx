import React, { useState, useEffect } from 'react'

const Navbar = () => {

  const [pathname, setPathname] = useState(window.location.pathname)

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('user_id')
    window.location.href = '/login'
  }

  useEffect(() => {
    const getTitle = () => {
      const path = window.location.pathname
      switch (path) {
        case '/':
          return 'Dashboard'
        case '/Products':
          return 'Products'
        case '/Customer':
          return 'Customer'
        case '/Sales':
          return 'Sales'
        case '/sold-items':
          return 'Sold Items'
        default:
          return 'Dashboard'
      }
    }

    setPathname(getTitle())
  }, [])

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      
      <div className="container-fluid">

        {/* Page Title */}
        <span className="navbar-brand fw-bold fs-5 text-dark">
          {pathname}
        </span>

        {/* Right Side */}
        <div className="dropdown ms-auto">
          
          <button
            className="btn d-flex align-items-center border-0"
            type="button"
            id="dropdownUser"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {/* Avatar */}
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle"
            />
          </button>

          {/* Dropdown Menu */}
          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li>
              <span className="dropdown-item-text fw-semibold">
                Inventory App
              </span>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <button 
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>

        </div>

      </div>
    </nav>
  )
}

export default Navbar