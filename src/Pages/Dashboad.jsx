// Dashboard.jsx
import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FiPackage, FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp, FiTrendingDown, FiLogOut } from 'react-icons/fi';
import { BsBoxSeam, BsGraphUp, BsClockHistory } from 'react-icons/bs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  // Calculate metrics
  const totalProducts = products.length;
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0);
  const totalOrders = sales.length;
  const totalUsers = users.length;
  
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
  
  const averageOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

  // Get recent sales (last 5)
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Prepare data for charts
  const salesByDay = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = Array(7).fill(0);
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.created_at);
      const diffDays = Math.floor((today - saleDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7 && diffDays >= 0) {
        data[6 - diffDays] += parseFloat(sale.total_price);
      }
    });
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Sales',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    };
  };

  const productPerformance = () => {
    const productSales = {};
    sales.forEach(sale => {
      if (productSales[sale.product]) {
        productSales[sale.product] += sale.quantity;
      } else {
        productSales[sale.product] = sale.quantity;
      }
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, quantity]) => {
        const product = products.find(p => p.id === parseInt(id));
        return {
          name: product?.name || 'Unknown',
          quantity
        };
      });

    return {
      labels: topProducts.map(p => p.name),
      datasets: [
        {
          data: topProducts.map(p => p.quantity),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderWidth: 0,
        }
      ]
    };
  };

  const stockStatus = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [
          products.filter(p => p.quantity >= 10).length,
          lowStock,
          outOfStock
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      }
    ]
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, salesRes, usersRes] = await Promise.all([
          apiCall("http://127.0.0.1:8000/api/products/"),
          apiCall("http://127.0.0.1:8000/api/sales/"),
          apiCall("http://127.0.0.1:8000/api/user/")
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!salesRes.ok) throw new Error('Failed to fetch sales');
        if (!usersRes.ok) throw new Error('Failed to fetch users');

        const productsData = await productsRes.json();
        const salesData = await salesRes.json();
        const usersData = await usersRes.json();

        setProducts(productsData);
        setSales(salesData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return 'TZS ' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      }
    },
    cutout: '70%',
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f3f4f6' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-gray-600">Loading dashboard data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f3f4f6' }}>
        <div className="text-center">
          <div className="text-danger mb-3">
            <FiPackage size={48} />
          </div>
          <h5 className="text-gray-800 mb-2">Error Loading Dashboard</h5>
          <p className="text-gray-600 mb-3">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: '#f3f4f6' }}>
      {/* Header */}
      <div className="bg-white border-bottom" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <BsGraphUp size={28} className="text-primary" />
              <h4 className="mb-0 fw-bold" style={{ color: '#111827' }}>Inventory Dashboard</h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex gap-2">
                <button 
                  className={`btn btn-sm ${selectedView === 'overview' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setSelectedView('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`btn btn-sm ${selectedView === 'analytics' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setSelectedView('analytics')}
                >
                  Analytics
                </button>
                <button 
                  className={`btn btn-sm ${selectedView === 'logs' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setSelectedView('logs')}
                >
                  Activity Logs
                </button>
              </div>
              <button 
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                onClick={handleSignOut}
              >
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                    <FiPackage size={24} className="text-primary" />
                  </div>
                  <span className="badge bg-light text-dark">Total</span>
                </div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3 className="fw-bold mb-0">{totalProducts}</h3>
                <div className="mt-2">
                  <small className="text-success">
                    <FiTrendingUp className="me-1" />
                    {products.filter(p => p.quantity > 0).length} in stock
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3">
                    <FiDollarSign size={24} className="text-success" />
                  </div>
                  <span className="badge bg-light text-dark">Revenue</span>
                </div>
                <h6 className="text-muted mb-1">Total Sales</h6>
                <h3 className="fw-bold mb-0">TZS{totalSales.toFixed(2)}</h3>
                <div className="mt-2">
                  <small className="text-muted">
                    Avg: TZS{averageOrderValue} per order
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                    <FiShoppingCart size={24} className="text-warning" />
                  </div>
                  <span className="badge bg-light text-dark">Orders</span>
                </div>
                <h6 className="text-muted mb-1">Total Orders</h6>
                <h3 className="fw-bold mb-0">{totalOrders}</h3>
                <div className="mt-2">
                  <small className="text-muted">
                    {recentSales.length} recent orders
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3">
                    <FiUsers size={24} className="text-info" />
                  </div>
                  <span className="badge bg-light text-dark">Users</span>
                </div>
                <h6 className="text-muted mb-1">Active Users</h6>
                <h3 className="fw-bold mb-0">{totalUsers}</h3>
                <div className="mt-2">
                  <small className="text-muted">
                    Registered customers
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedView === 'overview' && (
          <>
            {/* Charts Row */}
            <div className="row g-4 mb-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-semibold mb-0">Sales Overview</h6>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-light'}`}
                          onClick={() => setTimeRange('week')}
                        >
                          Week
                        </button>
                        <button 
                          className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-light'}`}
                          onClick={() => setTimeRange('month')}
                        >
                          Month
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Bar data={salesByDay()} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="fw-semibold mb-0">Stock Status</h6>
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <div style={{ height: '250px', width: '100%' }}>
                      <Doughnut data={stockStatus} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="fw-semibold mb-0">Top Products</h6>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '250px' }}>
                      <Doughnut data={productPerformance()} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 className="fw-semibold mb-0">Recent Activity</h6>
                    <BsClockHistory className="text-muted" />
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {recentSales.length > 0 ? (
                        recentSales.map((sale, index) => {
                          const product = products.find(p => p.id === sale.product);
                          const user = users.find(u => u.id === sale.user);
                          return (
                            <div key={index} className="list-group-item border-0 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-light rounded-3 p-2">
                                  <BsBoxSeam size={20} className="text-primary" />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1 fw-semibold">{product?.name || 'Unknown Product'}</h6>
                                      <small className="text-muted">
                                        Sold to {user?.username || 'Unknown'} • Qty: {sale.quantity}
                                      </small>
                                    </div>
                                    <div className="text-end">
                                      <span className="fw-bold text-success">TZS{sale.total_price}</span>
                                      <br />
                                      <small className="text-muted">
                                        {new Date(sale.created_at).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted mb-0">No recent sales</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedView === 'analytics' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="fw-semibold mb-0">Detailed Analytics</h6>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <h5 className="mb-3">Inventory Value</h5>
                    <h2 className="fw-bold text-primary">
                      TZS{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                    </h2>
                    <p className="text-muted mb-0">Total value of current stock</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <h5 className="mb-3">Average Order Value</h5>
                    <h2 className="fw-bold text-success">TZS {averageOrderValue}</h2>
                    <p className="text-muted mb-0">Per transaction</p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-4 bg-light rounded-4">
                    <h5 className="mb-3">Stock Health</h5>
                    <div className="row">
                      <div className="col-4">
                        <div className="text-center">
                          <h3 className="text-success">{products.filter(p => p.quantity >= 10).length}</h3>
                          <p className="text-muted mb-0">Healthy Stock</p>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <h3 className="text-warning">{lowStock}</h3>
                          <p className="text-muted mb-0">Low Stock</p>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <h3 className="text-danger">{outOfStock}</h3>
                          <p className="text-muted mb-0">Out of Stock</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'logs' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="fw-semibold mb-0">Activity Logs</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">Time</th>
                      <th className="border-0 px-4 py-3">Product</th>
                      <th className="border-0 px-4 py-3">Customer</th>
                      <th className="border-0 px-4 py-3">Quantity</th>
                      <th className="border-0 px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length > 0 ? (
                      [...sales]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((sale, index) => {
                          const product = products.find(p => p.id === sale.product);
                          const user = users.find(u => u.id === sale.user);
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                {new Date(sale.created_at).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="fw-semibold">{product?.name || 'Unknown'}</div>
                              </td>
                              <td className="px-4 py-3">{user?.username || 'Unknown'}</td>
                              <td className="px-4 py-3">{sale.quantity}</td>
                              <td className="px-4 py-3">
                                <span className="fw-bold text-success">TZS {sale.total_price}</span>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No activity logs available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for minimal design */}
      <style jsx>{`
        .min-vh-100 {
          min-height: 100vh;
        }
        .card {
          border-radius: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .btn-group .btn {
          padding: 0.25rem 1rem;
          border-radius: 20px !important;
        }
        .list-group-item {
          transition: background-color 0.2s;
        }
        .list-group-item:hover {
          background-color: #f8f9fa !important;
        }
        .rounded-4 {
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;