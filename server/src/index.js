import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import express from 'express';
import { query, getClient } from './db.js';
import { requireAuth } from './middleware/auth.js';
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

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const { rows } = await query(
        `SELECT id, full_name, email, phone, role, password_hash
           FROM users WHERE email = $1`,
        [email.toLowerCase()]
      );
      const user = rows[0];
      const passwordOk = user && (await bcrypt.compare(password, user.password_hash));
  
      if (!passwordOk) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      const { password_hash, ...safeUser } = user;
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ user: safeUser, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const { rows } = await query(
        'SELECT id, full_name, email, phone, role FROM users WHERE id = $1',
        [req.user.id]
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/orders', requireAuth, async (req, res) => {
    const { items, shippingAddress, contactPhone } = req.body;
  
    if (!Array.isArray(items) || items.length === 0 || !shippingAddress || !contactPhone) {
      return res.status(400).json({ message: 'Items, address and phone are required.' });
    }
  
    const client = await getClient();
    try {
      await client.query('BEGIN');
  
      let total = 0;
      const lines = [];
  
      for (const item of items) {
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          const err = new Error('Invalid quantity.');
          err.status = 400;
          throw err;
        }
  
        const { rows } = await client.query(
          `UPDATE products SET stock = stock - $1
            WHERE id = $2 AND stock >= $1
        RETURNING id, price`,
          [quantity, item.id]
        );
        if (rows.length === 0) {
          const err = new Error('A product is unavailable or out of stock.');
          err.status = 409;
          throw err;
        }
  
        total += Number(rows[0].price) * quantity;
        lines.push({ productId: rows[0].id, quantity, unitPrice: rows[0].price });
      }
  
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total, shipping_address, contact_phone)
         VALUES ($1, $2, $3, $4)
         RETURNING id, total, status, created_at`,
        [req.user.id, total, shippingAddress, contactPhone]
      );
      const order = orderResult.rows[0];
  
      for (const line of lines) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, line.productId, line.quantity, line.unitPrice]
        );
      }
  
      await client.query('COMMIT');
      res.status(201).json(order);
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(err.status || 500).json({ message: err.message });
    } finally {
      client.release();
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