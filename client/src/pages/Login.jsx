import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const justRegistered = location.state?.registered;
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    function handleChange(e) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  
    async function handleSubmit(e) {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        }
      } catch {
        setError('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    }
    return (
        <main className="container py-4" style={{ maxWidth: 480 }}>
        <h1 className="h3 mb-3">Welcome back</h1>
        {justRegistered && (
          <div className="alert alert-success">
            Account created. Log in to start shopping.
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="jp-card p-4">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-control"
              value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn jp-btn w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <p className="mt-3 mb-0">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </main>
    );
  }