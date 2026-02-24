import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductModal from "../Components/ProductModal";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [users, setUser] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    user: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const isEdit = editIndex !== null;
      const url = isEdit
        ? `http://127.0.0.1:8000/api/products/${formData.id}/`
        : "http://127.0.0.1:8000/api/products/";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const saved = await res.json();

      if (isEdit) {
        const updatedProducts = [...products];
        updatedProducts[editIndex] = saved;
        setProducts(updatedProducts);
        setEditIndex(null);
      } else {
        setProducts([...products, saved]);
      }

      setFormData({ name: "", price: "", user: "" });
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setFormData(products[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredProducts = products.filter((_, i) => i !== index);
    setProducts(filteredProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };

    fetchProducts();
    fetchUser();
  }, []);

  return (
    <div className="container my-5">

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ProductModal">
          Add New Product
        </button>
      </div>

     

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4">No products available</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.user}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(index)}
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
      <ProductModal products={products} users={users} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} editIndex={editIndex} />

    </div>
  );
}