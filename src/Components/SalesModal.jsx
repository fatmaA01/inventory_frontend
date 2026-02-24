import React from 'react'

const SalesModal = ({ products, users, formData, setFormData, handleSubmit, editIndex }) => {
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
    <div class="modal fade" id="SalesModal" tabindex="-1" aria-labelledby="SalesModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="SalesModalLabel">Add New Sale</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
              <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-12">
        <select name="product" id="productSelect" className="form-select" value={formData.product} onChange={handleChange}>

    <option value=""  >Select product</option>
    {products.map((product) => (
        <option  key={product.id} value={product.id}>{product.name}</option>
    ))}
</select>
</div>
        <div className="col-md-12">
          <input
            type="number"
            name="quantity"
            className="form-control"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>


        <div className="col-md-12">
          <input
            type="number"
            name="total_price"
            className="form-control"
            placeholder="Total Price"
            value={formData.total_price}
            onChange={handleChange}
            readOnly
          />
        </div>


        <div className="col-md-12">
        <select name="user" id="userSelect" className="form-select" value={formData.user} onChange={handleChange}>

    <option value="">Select User</option>
    {users.map((user) => (
        <option  key={user.id} value={user.id}>{user.name}</option>
    ))}
</select>
</div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            {editIndex !== null ? "Update Sale" : "Add Sale"}
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

export default SalesModal
