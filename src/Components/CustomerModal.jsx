import React from 'react'

const CustomerModal = ({formData, setFormData, handleSubmit, editIndex, handleChange }) => {


  return (
    < >
    <div className="modal fade" id="CustomerModal" tabIndex="-1" aria-labelledby="CustomerModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="CustomerModalLabel">Add New Customer</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  ></button>
      </div>
      <div className="modal-body">
              <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-12">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="phone"
            className="form-control"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="Address"
            className="form-control"
            placeholder="Address"
            value={formData.Address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="Username"
            className="form-control"
            placeholder="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            {editIndex !== null ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>
       </div>
  </div>
</div>
</div>
         </>
    )
}
export default CustomerModal;