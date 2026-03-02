// Sales.jsx
import React, { useState, useEffect, useRef } from "react";
import { apiCall } from "../utils/api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    total_price: "",
    user: ""
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  
  const closeButtonRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "product") {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      setSelectedProductDetails(selectedProduct);
      
      if (selectedProduct) {
        const quantity = formData.quantity ? parseInt(formData.quantity) : 0;
        const total = (selectedProduct.price * quantity).toFixed(2);
        setFormData({
          ...formData,
          product: value,
          total_price: total
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } 
    else if (name === "quantity") {
      const quantity = parseInt(value) || 0;
      const selectedProduct = products.find(p => p.id === parseInt(formData.product));
      
      // Validate quantity against stock
      if (selectedProduct && quantity > selectedProduct.quantity && !editId) {
        setError(`Only ${selectedProduct.quantity} items available in stock`);
      } else {
        setError(null);
      }
      
      if (selectedProduct) {
        const total = (selectedProduct.price * quantity).toFixed(2);
        setFormData({
          ...formData,
          quantity: value,
          total_price: total
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add or update sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedProduct = products.find(p => p.id === parseInt(formData.product));
      const quantity = parseInt(formData.quantity);

      // Validate stock
      if (!selectedProduct) {
        throw new Error('Please select a valid product');
      }

      if (editId) {
        // For updates, we need to check the original sale
        const originalSale = sales.find(s => s.id === editId);
        const quantityDifference = quantity - originalSale.quantity;
        
        if (quantityDifference > 0 && selectedProduct.quantity < quantityDifference) {
          throw new Error(`Insufficient stock. Available: ${selectedProduct.quantity}, Need additional: ${quantityDifference}`);
        }
      } else {
        // For new sales, check if enough stock
        if (selectedProduct.quantity < quantity) {
          throw new Error(`Insufficient stock. Available: ${selectedProduct.quantity}, Requested: ${quantity}`);
        }
      }

      const saleData = {
        product: parseInt(formData.product),
        quantity: quantity,
        total_price: parseFloat(formData.total_price),
        user: parseInt(formData.user)
      };

      console.log("Submitting sale data:", saleData);

      let response;
      if (editId) {
        response = await apiCall(`https://inventory-backend-zhvg.onrender.com/api/sales/${editId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saleData)
        });
      } else {
        response = await apiCall("https://inventory-backend-zhvg.onrender.com/api/sales/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saleData)
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || JSON.stringify(responseData) || `Failed to ${editId ? 'update' : 'create'} sale`);
      }

      console.log("Sale saved:", responseData);
      
      setSuccess(`Sale ${editId ? 'updated' : 'created'} successfully!`);
      
      // Refresh data
      await Promise.all([fetchSales(), fetchProducts()]);
      closeModal();

    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || `Failed to ${editId ? 'update' : 'create'} sale`);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    // Reset form
    setFormData({
      product: "",
      quantity: "",
      total_price: "",
      user: ""
    });
    setEditId(null);
    setEditIndex(null);
    setSelectedProductDetails(null);
    setError(null);
    
    // Close modal using data-bs-dismiss
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };

  const handleEdit = (sale) => {
    const selectedProduct = products.find(p => p.id === sale.product);
    setSelectedProductDetails(selectedProduct);
    
    setFormData({
      product: sale.product,
      quantity: sale.quantity,
      total_price: sale.total_price,
      user: sale.user
    });
    setEditId(sale.id);
    setEditIndex(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale? This will restore the product stock.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiCall(`https://inventory-backend-zhvg.onrender.com/api/sales/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete sale');
      }

      setSuccess('Sale deleted and stock restored successfully!');
      
      // Refresh data
      await Promise.all([fetchSales(), fetchProducts()]);

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || 'Failed to delete sale');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await apiCall("https://inventory-backend-zhvg.onrender.com/api/sales/");
      if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
      const data = await response.json();
      setSales(data);
    } catch (err) {
      setError(err.message || "Failed to fetch sales");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiCall("https://inventory-backend-zhvg.onrender.com/api/user/");
      if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiCall("https://inventory-backend-zhvg.onrender.com/api/products/");
      if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchSales();
    fetchUsers();
    fetchProducts();
  }, []);

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  const getProductStock = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.quantity : 0;
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  // Check if quantity is valid
  const isQuantityValid = () => {
    if (!formData.quantity || !selectedProductDetails) return true;
    const quantity = parseInt(formData.quantity);
    if (editId) {
      const originalSale = sales.find(s => s.id === editId);
      const quantityDifference = quantity - originalSale.quantity;
      return quantityDifference <= selectedProductDetails.quantity;
    }
    return quantity <= selectedProductDetails.quantity;
  };

  return (
    <div className="container my-5">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#SalesModal"
        >
          Add New Sale
        </button>
      </div>

      {/* Low Stock Alert */}
      {products.some(p => p.quantity < 10) && (
        <div className="alert alert-warning mb-3">
          <strong>Warning:</strong> Some products are running low on stock!
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>PRODUCT</th>
              <th>QUANTITY</th>
              <th>TOTAL PRICE</th>
              <th>USER</th>
              <th>CURRENT STOCK</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No sales available</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{getProductName(sale.product)}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.total_price}</td>
                  <td>{getUserName(sale.user)}</td>
                  <td>
                    <span className={getProductStock(sale.product) < 10 ? 'text-danger fw-bold' : ''}>
                      {getProductStock(sale.product)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleEdit(sale)}
                      data-bs-toggle="modal" 
                      data-bs-target="#SalesModal"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(sale.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sales Modal */}
      <div className="modal fade" id="SalesModal" tabIndex="-1" aria-labelledby="SalesModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="SalesModalLabel">
                {editIndex !== null ? "Edit Sale" : "Add New Sale"}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
                ref={closeButtonRef}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="product" className="form-label">Product</label>
                  <select
                    className="form-select"
                    id="product"
                    name="product"
                    value={formData.product || ""}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option 
                        key={product.id} 
                        value={product.id}
                        disabled={!editId && product.quantity === 0}
                      >
                        {product.name} - ${product.price} 
                        (Stock: {product.quantity})
                        {product.quantity === 0 && ' - OUT OF STOCK'}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProductDetails && (
                  <div className="mb-2">
                    <small className="text-muted">
                      Available stock: <strong>{selectedProductDetails.quantity}</strong>
                    </small>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input
                    type="number"
                    className={`form-control ${!isQuantityValid() ? 'is-invalid' : ''}`}
                    id="quantity"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    min="1"
                    max={selectedProductDetails?.quantity || ''}
                    required
                    disabled={loading || !formData.product}
                  />
                  {!isQuantityValid() && (
                    <div className="invalid-feedback">
                      Quantity exceeds available stock
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="total_price" className="form-label">Total Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="total_price"
                    name="total_price"
                    value={formData.total_price || ""}
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
                    value={formData.user || ""}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-footer px-0 pb-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading || !isQuantityValid() || !formData.product || !formData.user}
                  >
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
    </div>
  );
};

export default Sales;