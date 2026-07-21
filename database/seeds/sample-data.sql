-- Sample Users
INSERT INTO users (email, password, first_name, last_name, phone, location, bio, verified) VALUES
  ('coach1@example.com', '$2a$10$example_hash', 'John', 'Smith', '+1-555-0001', 'Dallas, TX', 'High school football coach', true),
  ('coach2@example.com', '$2a$10$example_hash', 'Sarah', 'Johnson', '+1-555-0002', 'Austin, TX', 'College recruiter', true);

-- Sample Listings
INSERT INTO listings (user_id, title, description, category, condition, price, location, status) VALUES
  (1, 'Riddell Speedflex Helmet', 'Adult football helmet in excellent condition', 'Helmets', 'Good', 149.99, 'Dallas, TX', 'active'),
  (2, 'Nike Vapor Cleats', 'Size 12, like new, only wore for practice', 'Cleats', 'Like New', 89.99, 'Austin, TX', 'active');
