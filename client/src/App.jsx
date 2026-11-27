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
    <div>
      <h1>JojoPay</h1>
      {error && <p>{error}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} ({p.category}) - ₦{Number(p.price).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;