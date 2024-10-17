
-- Insert burgers
INSERT INTO burgers (name, description, price) VALUES 
('Classic Cheeseburger', 'A classic cheeseburger with fresh toppings.', 6.50),
('Bacon BBQ Burger', 'A delicious burger with bacon and BBQ sauce.', 8.00),
('Veggie Delight', 'A fresh veggie burger with vegan options.', 7.00),
('Spicy Chicken Burger', 'A spicy chicken burger for those who love heat.', 7.50),
('Double Beef Deluxe', 'A double beef patty burger for extra hunger.', 9.50);

-- Insert ingredients (ensure no duplicates)
INSERT IGNORE INTO ingredients (name, extra_price) VALUES 
('Beef Patty', 2.00),
('Cheddar Cheese', 0.50),
('Lettuce', 0.25),
('Tomato', 0.25),
('Ketchup', 0.10),
('Bacon', 1.50),
('BBQ Sauce', 0.75),
('Onion Rings', 1.00),
('Veggie Patty', 2.00),
('Pickles', 0.25),
('Vegan Mayo', 0.50),
('Chicken Patty', 2.00),
('Jalapeños', 0.50),
('Pepper Jack Cheese', 0.75),
('Spicy Mayo', 0.50),
('Double Beef Patty', 3.00);


-- Insert default ingredients for each burger
-- Classic Cheeseburger
INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES 
(1, 1, 1),  -- Beef Patty
(1, 2, 1),  -- Cheddar Cheese
(1, 3, 1),  -- Lettuce
(1, 4, 1),  -- Tomato
(1, 5, 1);  -- Ketchup

-- Bacon BBQ Burger
INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES 
(2, 1, 1),  -- Beef Patty
(2, 6, 2),  -- Bacon
(2, 2, 1),  -- Cheddar Cheese
(2, 7, 1),  -- BBQ Sauce
(2, 8, 1);  -- Onion Rings

-- Veggie Delight
INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES 
(3, 9, 1),  -- Veggie Patty
(3, 3, 1),  -- Lettuce
(3, 4, 1),  -- Tomato
(3, 10, 1), -- Pickles
(3, 11, 1); -- Vegan Mayo

-- Spicy Chicken Burger
INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES 
(4, 12, 1), -- Chicken Patty
(4, 13, 1), -- Jalapeños
(4, 14, 1), -- Pepper Jack Cheese
(4, 15, 1), -- Spicy Mayo
(4, 3, 1);  -- Lettuce

-- Double Beef Deluxe
INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES 
(5, 16, 2), -- Double Beef Patty
(5, 6, 2),  -- Bacon
(5, 2, 1),  -- Cheddar Cheese
(5, 8, 1),  -- Onion Rings
(5, 7, 1),  -- BBQ Sauce
(5, 10, 1); -- Pickles

