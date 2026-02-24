import React, { useState, useEffect } from "react";
import SalesModal from "../Components/SalesModal";

const Sales = () => {
   
   const [sales, setSales] = useState([]);
    const [users, setUser] = useState([]);
    const [products, setProducts] = useState([]);
   const [formData, setFormData] = useState({
    
    product: "",
    quantity: "",
    total_price: "",
    user: "",
    customer: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto calculate total
    if (name === "quantity" || name === "price") {
      const quantity = name === "quantity" ? Number(value) : Number(updatedForm.quantity);
      const price = name === "price" ? Number(value) : Number(updatedForm.price);
      updatedForm.total = (quantity * price).toFixed(2);
    }

    setFormData(updatedForm);
  };

  // Add or update sale
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedSales = [...sales];
      updatedSales[editIndex] = formData;
      setSales(updatedSales);
      setEditIndex(null);
    } else {
      setSales([...sales, formData]);
    }
    setFormData({ customer: "", product: "", quantity: "", price: "", total: "" });
  };

  const handleEdit = (index) => {
    setFormData(sales[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredSales = sales.filter((_, i) => i !== index);
    setSales(filteredSales);
  };


  
useEffect(() => {
    const fetchSales = async () => {
        setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/sales/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setSales(data);
      } catch (err) {
        setError(err.message || "Failed to fetch sales");
      }
    };

     const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setProducts(data);

      } catch (err) {
        setError(err.message || "Failed to fetch products");
      }
    };

    fetchSales();
    fetchUser();
    fetchProducts();
  }, []);



  return (
    <div className="container my-5">

      {/* Modal Trigger Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#SalesModal">
          Add New Sale
        </button>
      </div>


      {/* Sales Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>PRODUCT</th>
              <th>QUANTITY</th>
              <th>TOTAL PRICE</th>
              <th>USER</th>
              <th>CUSTOMER</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6">No sales available</td>
              </tr>
            ) : (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.total_price}</td>
                  <td>{sale.user}</td>
                  <td>{sale.customer}</td>
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
            <SalesModal products={products} users={users} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} editIndex={editIndex} />

    </div>
  );
}

export default Sales
