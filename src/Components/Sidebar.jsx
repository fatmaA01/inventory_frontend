import React from 'react'

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100" style={{width: "250px"}}>
      
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold">Inventory App</span>
      </a>

      <hr />

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="/" className="nav-link text-white">
            DASHBOARD
          </a>
        </li>

        <li>
          <a href="/Products" className="nav-link text-white">
            PRODUCTS
          </a>
        </li>


        <li>
          <a href="/Sales" className="nav-link text-white">
            SALES
          </a>
        </li>
      </ul>

      <hr />

    
    </div>
  )
}

export default Sidebar