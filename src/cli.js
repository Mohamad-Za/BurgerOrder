"use strict";

const config = require("../config/db/burger_orderer.json");
const mysql = require("promise-mysql");

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

async function showIngredients() {
    const db = await mysql.createConnection(config);
    let sql = `SELECT * FROM ingredients`;

    let res = await db.query(sql);
    return res;
}

async function insertOrder(customerName) {
    const db = await mysql.createConnection(config);
    let sql = `INSERT INTO orders (customer_name) VALUES (?)`;

    let res = await db.query(sql, [customerName]);
    return res.insertId;  
}

async function insertOrderItem(orderId, burgerId, quantity) {
    const db = await mysql.createConnection(config);
    let sql = `INSERT INTO order_items (order_id, burger_id, quantity) VALUES (?, ?, ?)`;

    await db.query(sql, [orderId, burgerId, quantity]);
}


async function insertBurgerIngredients(burgerId, ingredientIds) {
    try {
        const db = await mysql.createConnection(config);

        for (let ingredientId of ingredientIds) {
            let checkSql = `SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;
            let existing = await db.query(checkSql, [burgerId, ingredientId]);

            if (existing.length === 0) {
                let sql = `INSERT INTO burger_ingredients (burger_id, ingredient_id) VALUES (?, ?)`;
                await db.query(sql, [burgerId, ingredientId]);
            }
        }
    } catch (err) {
        console.error("Error inserting burger ingredients:", err);
        throw new Error("Failed to insert burger ingredients");
    }
}



async function getBurgerById(burgerId) {
    const db = await mysql.createConnection(config);
    let sql = `SELECT * FROM burgers WHERE id = ?`;
    let res = await db.query(sql, [burgerId]);
    return res[0];
}


async function deleteOrder(orderId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM orders WHERE id = ?`;

    await db.query(sql, [orderId]);
}


async function showOrderDetails() {
    const db = await mysql.createConnection(config);
    
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




async function deleteOrder(orderId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM orders WHERE id = ?`;

    await db.query(sql, [orderId]);
}


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


async function insertOrUpdateBurgerIngredient(burgerId, ingredientId) {
    const db = await mysql.createConnection(config);

    let checkSql = `SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;
    let existing = await db.query(checkSql, [burgerId, ingredientId]);

    if (existing.length > 0) {
        console.log(`Ingredient ID ${ingredientId} already exists for burger ID ${burgerId}`);
    } else {
        let insertSql = `INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES (?, ?, 1)`;
        await db.query(insertSql, [burgerId, ingredientId]);
        console.log(`Added ingredient ID ${ingredientId} to burger ID ${burgerId}`);
    }
}



async function removeBurgerIngredient(burgerId, ingredientId) {
    const db = await mysql.createConnection(config);
    let sql = `DELETE FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?`;

    await db.query(sql, [burgerId, ingredientId]);
}


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
    deleteOrder: deleteOrder,
    showOrderDetails: showOrderDetails,
    getBurgerIngredients: getBurgerIngredients,
    insertOrUpdateBurgerIngredient: insertOrUpdateBurgerIngredient,
    removeBurgerIngredient: removeBurgerIngredient,
    insertOrderIngredient: insertOrderIngredient,
    getIngredientById: getIngredientById
};