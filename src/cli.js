"use strict";

const config = require("../config/db/burger_orderer.json");
const mysql = require("promise-mysql");

// Show all burgers in the menu
async function showBurgers() {
    try {
        const db = await mysql.createConnection(config);
        let sql = `SELECT * FROM burgers`;
        let res = await db.query(sql);
        return res;
    } catch (err) {
        console.error("Error fetching burgers:", err);
        throw new Error("Database query failed");
    }
}

// Show all ingredients for customization
async function showIngredients() {
    const db = await mysql.createConnection(config);
    let sql = `SELECT * FROM ingredients`;

    let res = await db.query(sql);
    return res;
}

// Place a new order
async function insertOrder(customerName) {
    const db = await mysql.createConnection(config);
    let sql = `INSERT INTO orders (customer_name) VALUES (?)`;

    let res = await db.query(sql, [customerName]);
    return res.insertId;  // Return the order ID for further use
}

// Insert a burger into the order_items table
async function insertOrderItem(orderId, burgerId, quantity) {
    const db = await mysql.createConnection(config);
    let sql = `INSERT INTO order_items (order_id, burger_id, quantity) VALUES (?, ?, ?)`;

    await db.query(sql, [orderId, burgerId, quantity]);
}


// Insert selected ingredients for the burger in the burger_ingredients table
async function insertBurgerIngredients(burgerId, ingredientIds) {
    try {
        const db = await mysql.createConnection(config);

        for (let ingredientId of ingredientIds) {
            // Check if the combination already exists
            let checkSql = `SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;
            let existing = await db.query(checkSql, [burgerId, ingredientId]);

            if (existing.length === 0) {
                // Only insert if the combination doesn't exist
                let sql = `INSERT INTO burger_ingredients (burger_id, ingredient_id) VALUES (?, ?)`;
                await db.query(sql, [burgerId, ingredientId]);
            }
        }
    } catch (err) {
        console.error("Error inserting burger ingredients:", err);
        throw new Error("Failed to insert burger ingredients");
    }
}



// Fetch a specific burger by ID
async function getBurgerById(burgerId) {
    const db = await mysql.createConnection(config);
    let sql = `SELECT * FROM burgers WHERE id = ?`;
    let res = await db.query(sql, [burgerId]);
    return res[0];
}


// Delete an order by ID
async function deleteOrder(orderId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM orders WHERE id = ?`;

    await db.query(sql, [orderId]);
}

// // Fetch all orders (for kitchen display)
// async function showOrders() {
//     const db = await mysql.createConnection(config);
//     let sql = `SELECT * FROM orders`;

//     let res = await db.query(sql);
//     return res;
// }


// Fetch all orders with their burgers and ingredients
async function showOrderDetails() {
    const db = await mysql.createConnection(config);
    
    // Fetch orders, burgers, and custom ingredients from order_ingredients
    let sql = `
      SELECT o.id AS order_id, o.customer_name, o.order_date, 
             b.name AS burger_name, oi.quantity AS burger_quantity,
             GROUP_CONCAT(i.name SEPARATOR ', ') AS ingredients
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN burgers b ON oi.burger_id = b.id
      LEFT JOIN order_ingredients oi2 ON o.id = oi2.order_id
      LEFT JOIN ingredients i ON oi2.ingredient_id = i.id
      GROUP BY o.id, b.name;
    `;
    
    let res = await db.query(sql);
    return res;
}




// Delete an order by ID
async function deleteOrder(orderId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM orders WHERE id = ?`;

    await db.query(sql, [orderId]);
}


// Fetch the default ingredients for a specific burger
async function getBurgerIngredients(burgerId) {
    const db = await mysql.createConnection(config);
    let sql = `
      SELECT i.id, i.name, i.extra_price, bi.quantity
      FROM ingredients i
      JOIN burger_ingredients bi ON i.id = bi.ingredient_id
      WHERE bi.burger_id = ?
    `;
    let res = await db.query(sql, [burgerId]);
    return res;
}


// Insert or update a burger ingredient with default quantity of 1
async function insertOrUpdateBurgerIngredient(burgerId, ingredientId) {
    const db = await mysql.createConnection(config);

    // Check if the ingredient already exists for the burger
    let checkSql = `SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;
    let existing = await db.query(checkSql, [burgerId, ingredientId]);

    if (existing.length > 0) {
        // If it exists, no need to update since quantity is no longer needed
        console.log(`Ingredient ID ${ingredientId} already exists for burger ID ${burgerId}`);
    } else {
        // Insert the new ingredient with a quantity of 1
        let insertSql = `INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES (?, ?, 1)`;
        await db.query(insertSql, [burgerId, ingredientId]);
        console.log(`Added ingredient ID ${ingredientId} to burger ID ${burgerId}`);
    }
}



// Remove an ingredient from the burger_ingredients table
async function removeBurgerIngredient(burgerId, ingredientId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;

    await db.query(sql, [burgerId, ingredientId]);
}


// Insert an ingredient into the order_ingredients table
async function insertOrderIngredient(orderId, ingredientId, quantity) {
    const db = await mysql.createConnection(config);
    let sql = `INSERT INTO order_ingredients (order_id, ingredient_id, quantity) VALUES (?, ?, ?)`;

    await db.query(sql, [orderId, ingredientId, quantity]);
}


async function getIngredientById(ingredientId) {
    const db = await mysql.createConnection(config);
    let sql = `SELECT * FROM ingredients WHERE id = ?`;
    let res = await db.query(sql, [ingredientId]);
    return res[0];
}



module.exports = {
    showBurgers: showBurgers,
    showIngredients: showIngredients,
    insertOrder: insertOrder,
    insertOrderItem: insertOrderItem,
    insertBurgerIngredients: insertBurgerIngredients,
    getBurgerById: getBurgerById,
    // showOrders: showOrders,
    deleteOrder: deleteOrder,
    showOrderDetails: showOrderDetails,
    getBurgerIngredients: getBurgerIngredients,
    insertOrUpdateBurgerIngredient: insertOrUpdateBurgerIngredient,
    removeBurgerIngredient: removeBurgerIngredient,
    insertOrderIngredient: insertOrderIngredient,
    getIngredientById: getIngredientById
};