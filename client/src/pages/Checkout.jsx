import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    shippingAddress: '',
    contactPhone: user?.phone || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  if (!user) return <Navigate to="/login" />;

  if (order) {
    return (
      <main className="container py-4" style={{ maxWidth: 560 }}>
        <div className="jp-card p-4 text-center">
          <h1 className="h3">Order placed</h1>
          <p>Your order number is <strong>#{order.id}</strong>.</p>
          <p>Total: ₦{Number(order.total).toLocaleString()}</p>
          <Link to="/" className="btn jp-btn">Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          shippingAddress: form.shippingAddress,
          contactPhone: form.contactPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setOrder(data);
        clearCart();
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Checkout</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <section className="col-lg-7">
          <form onSubmit={handleSubmit} className="jp-card p-4">
            <h2 className="h5 mb-3">Delivery details</h2>
            <div className="mb-3">
              <label htmlFor="shippingAddress" className="form-label">Delivery address</label>
              <textarea id="shippingAddress" name="shippingAddress" rows="3"
                className="form-control" value={form.shippingAddress}
                onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="contactPhone" className="form-label">Phone number</label>
              <input id="contactPhone" name="contactPhone" type="tel"
                className="form-control" value={form.contactPhone}
                onChange={handleChange} required />
            </div>
            <button className="btn jp-btn w-100" disabled={loading}>
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </form>
        </section>
        <aside className="col-lg-5">
          <div className="jp-card p-3">
            <h2 className="h5">Order summary</h2>
            {items.map((i) => (
              <div key={i.id} className="d-flex justify-content-between my-2">
                <span>{i.name} × {i.quantity}</span>
                <span>₦{(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}