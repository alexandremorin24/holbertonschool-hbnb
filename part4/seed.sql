-- Insert Administrator User
INSERT INTO users (id, email, first_name, last_name, password, is_admin) VALUES 
('36c9050e-ddd3-4c3b-9731-9f487208bbc1', 'admin@hbnb.io', 'Admin', 'HBnB', '$2b$12$XXXXXXXXXXXXXXX', TRUE);

-- Insert Initial Amenities
INSERT INTO amenities (id, name) VALUES
('e12a7c77-0b32-4b1f-91cc-1fc7a501a1c1', 'WiFi'),
('ae477e9b-44ee-4a2f-b6a3-1d7f9a843b3b', 'Swimming Pool'),
('21dfac66-fcc5-4065-90b7-8c12ef0f7fbd', 'Air Conditioning');

-- Insert Place
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id) 
VALUES 
('0a6476eb-9427-4b8e-9177-ea0a865c394f', 'Luxury Villa', 'Beautiful beachfront villa', 250.00, 40.7128, -74.0060, '36c9050e-ddd3-4c3b-9731-9f487208bbc1');

-- Insert Review
INSERT INTO reviews (id, text, rating, user_id, place_id) 
VALUES 
('c39478d3-b624-4426-8f36-408e067eafbd', 'Amazing place!', 5, '36c9050e-ddd3-4c3b-9731-9f487208bbc1', '0a6476eb-9427-4b8e-9177-ea0a865c394f');

-- Associate Amenity to Place
INSERT INTO amenities_places (place_id, amenity_id) 
VALUES 
('0a6476eb-9427-4b8e-9177-ea0a865c394f', 'e12a7c77-0b32-4b1f-91cc-1fc7a501a1c1');

-- Insert second review to test constraint (can be removed if error)
INSERT INTO reviews (id, text, rating, user_id, place_id) 
VALUES 
('d52948e7-8137-4c6b-a5c9-bd47be671255', 'Another review', 3, '36c9050e-ddd3-4c3b-9731-9f487208bbc1', '0a6476eb-9427-4b8e-9177-ea0a865c394f');
