import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";

const Dashboad = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center">
            <p>No products available.</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div className="col-3 mt-4">
              <ProductCard name={product.name} price={product.price} />
            </div>
          ))
        )}
      </div>{" "}
    </div>
  );
};

export default Dashboad;
