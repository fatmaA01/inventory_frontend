import React from 'react'

const ProductModal = ({ products, users, formData, setFormData, handleSubmit, editIndex }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'quantity' || name === 'product') {
        const product = products.find(p => p.id == updated.product);
        const qty = parseFloat(updated.quantity) || 0;
        updated.total_price = product ? (product.price * qty).toFixed(2) : '';
      }

      return updated;
    });
  };

  return (
    < >
    <div className="modal fade" id="ProductModal" tabIndex="-1" aria-labelledby="ProductModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="ProductModalLabel">Add New Product</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
              <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-12">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="price"
            className="form-control"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>


        <div className="col-md-6">

<select name="user" id="userSelect" className="form-select" value={formData.user} onChange={handleChange}>

    <option value="">Select User</option>
    {users.map((user) => (
        <option style={{color : 'black'}} key={user.id} value={user.id}>{user.name}</option>
    ))}
</select>

        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            {editIndex !== null ? "Update Product" : "Add Product"}
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
export default ProductModal;