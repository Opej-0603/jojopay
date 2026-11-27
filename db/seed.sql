INSERT INTO categories (name, slug) VALUES
  ('Phones and Tablets', 'phones-tablets'),
  ('Computing', 'computing'),
  ('Electronics', 'electronics'),
  ('Fashion', 'fashion'),
  ('Home and Kitchen', 'home-kitchen'),
  ('Beauty', 'beauty'),
  ('Groceries', 'groceries'),
  ('Sports', 'sports');

INSERT INTO products (category_id, name, brand, description, price, old_price, stock) VALUES
  (1, 'Sample Smartphone', 'SampleBrand', 'Sample description.', 150000, 180000, 20),
  (2, 'Sample Laptop', 'SampleBrand', 'Sample description.', 450000, 500000, 8),
  (3, 'Sample Earbuds', 'SampleBrand', 'Sample description.', 18000, 22000, 40),
  (4, 'Sample Sneakers', 'SampleBrand', 'Sample description.', 32000, NULL, 25),
  (5, 'Sample Blender', 'SampleBrand', 'Sample description.', 28000, 33000, 12);