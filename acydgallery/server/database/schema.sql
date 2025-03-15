-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS acydgallery;

-- Use the database
USE acydgallery;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Clothing', 'ACYD branded clothing items'),
('Accessories', 'ACYD branded accessories'),
('Posters', 'ACYD art posters and prints');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('ACYD T-Shirt', 'Premium cotton t-shirt with ACYD logo', 49.99, '/imgs/products/tshirt.jpg', 'Clothing', 100),
('ACYD Hoodie', 'Comfortable hoodie with ACYD logo', 79.99, '/imgs/products/hoodie.jpg', 'Clothing', 50),
('ACYD Cap', 'Stylish cap with embroidered ACYD logo', 29.99, '/imgs/products/cap.jpg', 'Accessories', 75),
('ACYD Poster', 'High-quality art print', 19.99, '/imgs/products/poster.jpg', 'Posters', 200);

-- Create a demo user (password: Password123)
INSERT INTO users (name, email, password) VALUES
('Demo User', 'demo@example.com', '$2b$10$6jXzJPHXGT7W7yJJ7eHqPeVCB.ZZQfLFCuDQUe.6TgmGOTIXoTSbm'); 