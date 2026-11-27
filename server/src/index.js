import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import { query } from './db.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('JojoPay API is running');
});

app.get('/api/health', async (req, res) => {
    try {
      const { rows } = await query('SELECT now() AS time');
      res.json({ status: 'ok', databaseTime: rows[0].time });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/products', async (req, res) => {
    try {
      const { rows } = await query(
        `SELECT p.id, p.name, p.brand, p.price, p.old_price, p.stock,
                c.name AS category
           FROM products p
           JOIN categories c ON c.id = p.category_id
          ORDER BY p.id`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, phone, password } = req.body;
  
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
  
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const { rows } = await query(
        `INSERT INTO users (full_name, email, phone, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, email, phone, role`,
        [fullName, email.toLowerCase(), phone, passwordHash]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }
      res.status(500).json({ message: err.message });
    }
  });