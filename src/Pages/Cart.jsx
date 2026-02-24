import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

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
    fetchSales();
  }, []);

  return (
    <div className="container my-5">
      <h2>Shopping Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {sales.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          sales.map((item, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card" style={{maxWidth: "320px"}}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzaG9lfGVufDB8MHx8fDE3MjEwNDEzNjd8MA&ixlib=rb-4.0.3&q=80&w=1080" className="card-img-top" alt="Product Image"/>
                <div className="card-body">
                  <h5 className="card-title">{item.product_name || "Product"}</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0">${item.price || "99.99"}</span>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between bg-light">
                  <button className="btn btn-danger btn-sm">Remove from Cart</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
