import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

function App() {
  return (
    <>
      <header className="jp-header py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="fw-bold fs-4 text-white text-decoration-none">JojoPay</Link>
          <nav className="d-flex gap-3">
            <Link to="/login" className="text-white">Login</Link>
            <Link to="/register" className="text-white">Register</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;