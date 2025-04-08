-- Table User
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Table Place
CREATE TABLE places (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    latitude FLOAT,
    longitude FLOAT,
    owner_id CHAR(36),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table Review
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY,
    text TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    user_id CHAR(36),
    place_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE (user_id, place_id)
);

-- Table Amenity
CREATE TABLE amenities (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

-- Table Place_Amenity (Association Many-to-Many)
CREATE TABLE amenities_places (
    place_id CHAR(36),
    amenity_id CHAR(36),
    PRIMARY KEY (place_id, amenity_id),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

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

-- Lister les utilisateurs
SELECT * FROM users;

-- Lister les lieux
SELECT * FROM places;

-- Lister les avis d'un lieu
SELECT * FROM reviews WHERE place_id = '0a6476eb-9427-4b8e-9177-ea0a865c394f';

-- Lister les commodités d'un lieu
SELECT a.name 
FROM amenities a 
JOIN amenities_places ap ON a.id = ap.amenity_id 
WHERE ap.place_id = '0a6476eb-9427-4b8e-9177-ea0a865c394f';

-- Mettre à jour le titre d’un lieu
UPDATE places 
SET title = 'Luxury Villa Updated' 
WHERE id = '0a6476eb-9427-4b8e-9177-ea0a865c394f';

-- Modifier la note d’un avis
UPDATE reviews 
SET rating = 4 
WHERE id = 'c39478d3-b624-4426-8f36-408e067eafbd';

-- Supprimer un avis
DELETE FROM reviews WHERE id = 'c39478d3-b624-4426-8f36-408e067eafbd';

-- Supprimer une commodité d'un lieu
DELETE FROM amenities_places 
WHERE place_id = '0a6476eb-9427-4b8e-9177-ea0a865c394f' 
AND amenity_id = 'e12a7c77-0b32-4b1f-91cc-1fc7a501a1c1';

-- Supprimer un lieu
DELETE FROM places WHERE id = '0a6476eb-9427-4b8e-9177-ea0a865c394f';

-- Tester la contrainte d'unicité sur les avis (doit échouer si review existe déjà)
INSERT INTO reviews (id, text, rating, user_id, place_id) 
VALUES 
('d52948e7-8137-4c6b-a5c9-bd47be671255', 'Another review', 3, '36c9050e-ddd3-4c3b-9731-9f487208bbc1', '0a6476eb-9427-4b8e-9177-ea0a865c394f');

-- Lister les avis
SELECT * FROM reviews;
