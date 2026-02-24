import React from 'react'

const Sidebar= () => {
  return (
    <>
    <div className="sidebar">
  <a href="/"><i className="fa fa-fw fa-home"></i> DASHBOARD </a>
  <a href="/Products"><i className="fa fa-fw fa-wrench"></i> PRODUCTS </a>
  <a href="/Customer"><i className="fa fa-fw fa-user"></i> CUSTOMER </a>
  <a href="/Sales"><i className="fa fa-fw fa-envelope"></i> SALES</a>
</div>

    </>
  )
}

export default Sidebar
