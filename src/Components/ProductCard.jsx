import { useState, useEffect } from "react";
import SalesModal from "./SalesModal";
import { apiCall } from "../utils/api";

const ProductCard = ({ name, price }) => {
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
      const quantity =
        name === "quantity" ? Number(value) : Number(updatedForm.quantity);
      const price =
        name === "price" ? Number(value) : Number(updatedForm.price);
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
    setFormData({
      customer: "",
      product: "",
      quantity: "",
      price: "",
      total: "",
    });
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
        const res = await apiCall("http://127.0.0.1:8000/api/sales/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setSales(data);
      } catch (err) {
        setError(err.message || "Failed to fetch sales");
      }
    };

    const fetchUser = async () => {
      try {
        const res = await apiCall("http://127.0.0.1:8000/api/user/");
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await apiCall("http://127.0.0.1:8000/api/products/");
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
    <>
      <div className="card" style={{ maxWidth: "320px" }}>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzaG9lfGVufDB8MHx8fDE3MjEwNDEzNjd8MA&ixlib=rb-4.0.3&q=80&w=1080"
          className="card-img-top"
          alt="Product Image"
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">{price}</span>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
          <button
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#SalesModal"
          >
            Sold
          </button>
        </div>
      </div>

      <SalesModal
        products={products}
        users={users}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editIndex={editIndex}
      />
    </>
  );
};

export default ProductCard;
