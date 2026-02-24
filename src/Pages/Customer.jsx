import { useState } from "react";
import "./Customer.css"; // We'll create this CSS file for styling

function Customer() {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    username: "",
    password: ""
  });

  // kushika value za input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ku-add customer
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (formData.name && formData.phone && formData.address && formData.username && formData.password) {
      setCustomers([...customers, formData]);

      setFormData({
        name: "",
        phone: "",
        address: "",
        username: "",
        password: ""
      });

      setShowModal(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  // Close modal function
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      phone: "",
      address: "",
      username: "",
      password: ""
    });
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
    <div className="container mt-4">

      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add New Customer
        </button>
      </div>

      {/* Modal Pop-up */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h4 className="modal-title">Add New Customer</h4>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Customer Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter address"
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Customer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>ADDRESS</th>
            <th>USERNAME</th>
            <th>PASSWORD</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No customers available
              </td>
            </tr>
          ) : (
            customers.map((cust, index) => (
              <tr key={index}>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.address}</td>
                <td>{cust.username}</td>
                <td>{cust.password}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Customer;