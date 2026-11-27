CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  phone         VARCHAR(20)  NOT NULL,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'buyer',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  seller_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name        VARCHAR(160) NOT NULL,
  brand       VARCHAR(80),
  description TEXT,
  price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  old_price   NUMERIC(12,2) CHECK (old_price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id),
  total              NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  status             VARCHAR(12) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','returned')),
  paystack_reference VARCHAR(100) UNIQUE,
  shipping_address   TEXT NOT NULL,
  contact_phone      VARCHAR(20) NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0)
);