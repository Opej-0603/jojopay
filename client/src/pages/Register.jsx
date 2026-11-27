import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      fullName: '', email: '', phone: '', password: '', confirm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    function handleChange(e) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  
    async function handleSubmit(e) {
      e.preventDefault();
      setError('');
      if (form.password !== form.confirm) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
        } else {
          navigate('/login', { state: { registered: true } });
        }
      } catch {
        setError('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    }
    return (
        <main className="container py-4" style={{ maxWidth: 480 }}>
        <h1 className="h3 mb-3">Create your account</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="jp-card p-4">
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full name</label>
            <input id="fullName" name="fullName" className="form-control"
              value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone number</label>
            <input id="phone" name="phone" type="tel" className="form-control"
              value={form.phone} onChange={handleChange} required />
            <div className="form-text">
              We use it for order updates and so buyers and sellers can reach you.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-control"
              value={form.password} onChange={handleChange} required minLength={8} />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm" className="form-label">Confirm password</label>
            <input id="confirm" name="confirm" type="password" className="form-control"
              value={form.confirm} onChange={handleChange} required />
          </div>
          <button className="btn jp-btn w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="mt-3 mb-0">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    );
  }