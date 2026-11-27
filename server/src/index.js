import 'dotenv/config';
import express from 'express';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

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