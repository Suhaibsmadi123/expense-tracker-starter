// Expense Tracker - Backend
// Express API + PostgreSQL


// ==========================================
// IMPORT PACKAGES
// ==========================================

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

// Allow frontend to communicate with backend
app.use(cors());

// Allow server to read JSON request bodies
app.use(express.json());


// ==========================================
// POSTGRESQL CONNECTION
// ==========================================

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});


// ==========================================
// ALLOWED CATEGORIES
// ==========================================

const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other"
];


// ==========================================
// VALIDATE EXPENSE
// ==========================================

function validateExpense(title, amount, category, date) {

    // Check title
    if (
        typeof title !== "string" ||
        title.trim() === ""
    ) {
        return "Title is required.";
    }


    // Convert amount to number
    const numericAmount = Number(amount);


    // Check amount
    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {
        return "Amount must be a number greater than 0.";
    }


    // Check category
    if (!allowedCategories.includes(category)) {
        return "Invalid category.";
    }


    // Check date
    if (
        typeof date !== "string" ||
        date.trim() === ""
    ) {
        return "Date is required.";
    }


    return null;
}


// ==========================================
// VALIDATE ID
// ==========================================

function getValidId(id) {

    const numberId = Number(id);


    if (
        !Number.isInteger(numberId) ||
        numberId <= 0
    ) {
        return null;
    }


    return numberId;
}


// ==========================================
// GET ALL EXPENSES
// GET /api/expenses
// ==========================================

app.get("/api/expenses", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
            ORDER BY id
        `);


        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }

});


// ==========================================
// GET ONE EXPENSE
// GET /api/expenses/:id
// ==========================================

app.get("/api/expenses/:id", async (req, res) => {

    const id = getValidId(req.params.id);


    // Invalid ID
    if (id === null) {

        return res.status(404).json({
            message: "Expense not found."
        });
    }


    try {

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
            WHERE id = $1
            `,
            [id]
        );


        // Expense does not exist
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found."
            });
        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }

});


// ==========================================
// ADD EXPENSE
// POST /api/expenses
// ==========================================

app.post("/api/expenses", async (req, res) => {

    const {
        title,
        amount,
        category,
        date
    } = req.body;


    // Validate expense data
    const validationError = validateExpense(
        title,
        amount,
        category,
        date
    );


    if (validationError) {

        return res.status(400).json({
            message: validationError
        });
    }


    try {

        const result = await pool.query(
            `
            INSERT INTO expenses
                (title, amount, category, date)

            VALUES
                ($1, $2, $3, $4)

            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            `,
            [
                title.trim(),
                Number(amount),
                category,
                date
            ]
        );


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }

});


// ==========================================
// UPDATE EXPENSE
// PUT /api/expenses/:id
// ==========================================

app.put("/api/expenses/:id", async (req, res) => {

    const id = getValidId(req.params.id);


    // Invalid ID
    if (id === null) {

        return res.status(404).json({
            message: "Expense not found."
        });
    }


    const {
        title,
        amount,
        category,
        date
    } = req.body;


    // Validate expense data
    const validationError = validateExpense(
        title,
        amount,
        category,
        date
    );


    if (validationError) {

        return res.status(400).json({
            message: validationError
        });
    }


    try {

        const result = await pool.query(
            `
            UPDATE expenses

            SET
                title = $1,
                amount = $2,
                category = $3,
                date = $4

            WHERE id = $5

            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            `,
            [
                title.trim(),
                Number(amount),
                category,
                date,
                id
            ]
        );


        // Expense does not exist
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found."
            });
        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }

});


// ==========================================
// DELETE EXPENSE
// DELETE /api/expenses/:id
// ==========================================

app.delete("/api/expenses/:id", async (req, res) => {

    const id = getValidId(req.params.id);


    // Invalid ID
    if (id === null) {

        return res.status(404).json({
            message: "Expense not found."
        });
    }


    try {

        const result = await pool.query(
            `
            DELETE FROM expenses

            WHERE id = $1

            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            `,
            [id]
        );


        // Expense does not exist
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Expense not found."
            });
        }


        res.status(200).json({
            message: "Expense deleted successfully.",
            expense: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }

});


// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});