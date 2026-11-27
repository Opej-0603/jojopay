import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError('Could not reach the server.'));
  }, []);

  return (
    <>
      <header className="jp-header py-3">
        <div className="container fw-bold fs-4">JojoPay</div>
      </header>
      <main className="container py-4">
        <h1 className="h3 mb-3">Products</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {products.map((p) => (
            <div className="col" key={p.id}>
              <div className="card jp-card h-100 p-3">
                <h2 className="h6">{p.name}</h2>
                <p className="small mb-1">{p.category}</p>
                <p className="jp-price mb-1">₦{Number(p.price).toLocaleString()}</p>
                {p.old_price && (
                  <p className="small text-decoration-line-through">
                    ₦{Number(p.old_price).toLocaleString()}
                  </p>
                )}
                <button className="btn jp-btn mt-auto">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;