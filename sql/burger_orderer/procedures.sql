-- DELIMITER ;;
-- DROP PROCEDURE IF EXISTS get_order_details;

-- CREATE PROCEDURE get_order_details()
-- BEGIN
--     SELECT o.id AS order_id, o.customer_name, o.order_date, 
--            b.name AS burger_name, oi.quantity AS burger_quantity,
--            GROUP_CONCAT(i.name SEPARATOR ', ') AS ingredients
--     FROM orders o
--     JOIN order_items oi ON o.id = oi.order_id
--     JOIN burgers b ON oi.burger_id = b.id
--     LEFT JOIN order_ingredients oi2 ON o.id = oi2.order_id
--     LEFT JOIN ingredients i ON oi2.ingredient_id = i.id
--     GROUP BY o.id, b.name;
-- END ;;

-- DELIMITER ;