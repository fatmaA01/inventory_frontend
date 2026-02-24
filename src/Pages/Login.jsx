import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            window.location.href = '/'
        }
    }, [])

    const [form, setForm] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }
    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                setError(data.message || 'Login failed')
                setLoading(false)
                return
            }

            if (data.token && data.user_id) {
                localStorage.setItem('auth', data.token)
                localStorage.setItem('user_id', data.user_id)
                window.location.href = '/'
            } else {
                setError('Invalid credentials')
            }
        } catch (error) {
            setError('Login failed: ' + error.message)
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold">Login</h2>
          {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label fw-bold" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                className="form-control form-control-lg" 
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold" htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                id="password" 
                className="form-control form-control-lg" 
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="remember" />
                  <label className="form-check-label" htmlFor="remember">Remember me</label>
                </div>
              </div>
              <div className="col-6 text-end">
                <a href="#!" className="text-decoration-none">Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 mb-3" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-muted">Don't have an account? <a href="/signup" className="text-decoration-none fw-bold">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
