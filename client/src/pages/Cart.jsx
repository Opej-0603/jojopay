import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="container py-4">
        <h1 className="h3 mb-3">Shopping cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn jp-btn">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Shopping cart</h1>
      <div className="row g-4">
        <section className="col-lg-8">
          {items.map((item) => (
            <div key={item.id} className="jp-card p-3 mb-3 d-flex flex-wrap align-items-center gap-3">
              <div className="flex-grow-1">
                <strong>{item.name}</strong>
                <div className="jp-price">₦{item.price.toLocaleString()}</div>
                <button className="btn btn-link p-0" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  aria-label="Decrease quantity"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn btn-outline-secondary"
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <strong>₦{(item.price * item.quantity).toLocaleString()}</strong>
            </div>
          ))}
        </section>
        <aside className="col-lg-4">
          <div className="jp-card p-3">
            <h2 className="h5">Order summary</h2>
            <div className="d-flex justify-content-between fw-bold my-3">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button className="btn jp-btn w-100">Proceed to checkout</button>
          </div>
        </aside>
      </div>
    </main>
  );
}