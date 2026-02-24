import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerModal from "../Components/CustomerModal";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [users, setUser] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    Address: "",
    Username: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState([]);

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
        ? `http://127.0.0.1:8000/api/customer/${formData.id}/`
        : "http://127.0.0.1:8000/api/customer/";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const saved = await res.json();

      if (isEdit) {
        const updatedCustomer = [...customer];
        updatedCustomer[editIndex] = saved;
        setCustomer(updatedCustomer);
        setEditIndex(null);
      } else {
        setCustomer([...customer, saved]);
      }

      setFormData({ name: "", price: "", user: "" });
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setFormData(customer[index]);
    setEditIndex(index);
    // close model
      const modal = document.getElementById("CustomerModal");
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      bsModal.hide();
  };

  const handleDelete = async (index) => {
    const filteredCustomer = customer.filter((_, i) => i !== index);

    const url = `http://127.0.0.1:8000/api/customer/${customer[index].id}/`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


    setCustomer(filteredCustomer);
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/customer/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setCustomer(data);
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to fetch Customer");
      } finally {
        setLoading(false);
      }
    };


    fetchCustomer();
  }, []);

  return (
    <div className="container my-5">

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#CustomerModal">
          Add New Customer
        </button>
      </div>

     

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>phone</th>
              <th>Address</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customer.length === 0 ? (
              <tr>
                <td colSpan="4">No customer available</td>
              </tr>
            ) : (
              customer.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.phone}</td>
                  <td>{product.Address}</td>
                  <td>{product.Username}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"  data-bs-toggle="modal" data-bs-target="#CustomerModal"
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
      <CustomerModal Customer={Customer} users={users} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} editIndex={editIndex} handleChange={handleChange} />

    </div>
  );
}