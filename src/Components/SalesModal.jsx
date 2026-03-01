// SalesModal.jsx
import React from "react";

const SalesModal = ({ 
  products, 
  users, 
  formData, 
  setFormData, 
  handleSubmit, 
  handleChange,
  editIndex,
  loading 
}) => {
  return (
    <div className="modal fade" id="SalesModal" tabIndex="-1" aria-labelledby="SalesModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="SalesModalLabel">
              {editIndex !== null ? "Edit Sale" : "Add New Sale"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="product" className="form-label">Product</label>
                <select
                  className="form-select"
                  id="product"
                  name="product"
                  value={formData?.product || ""}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select a product</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={formData?.quantity || ""}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="total_price" className="form-label">Total Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="total_price"
                  name="total_price"
                  value={formData?.total_price || ""}
                  readOnly
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="user" className="form-label">User</label>
                <select
                  className="form-select"
                  id="user"
                  name="user"
                  value={formData?.user || ""}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select a user</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editIndex !== null ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    editIndex !== null ? "Update Sale" : "Save Sale"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesModal;