# Expense Tracker

A full-stack web app that lets you track your daily expenses — add, edit, delete, and filter them by category or month, with a live summary of your total spending, expense count, and highest expense. All data is stored in a PostgreSQL database.

## How to run

**Database setup**

1. Open **pgAdmin** (or the `psql` terminal) and create a new database called `expense_tracker`.
2. Open the file `backend/schema.sql` in VS Code.
3. Run it against your new database. In `psql` that looks like:
   ```
   psql -U postgres -d expense_tracker -f backend/schema.sql
   ```
   This creates the `expenses` table and inserts some sample rows.

**Backend**

1. Open a terminal and go into the `backend` folder:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. The `.env` file is already in the `backend` folder. Open it and make sure the values match your PostgreSQL setup (the defaults are shown below — change them if yours differ):
   ```
   DB_USER=....
   DB_PASSWORD=....
   DB_HOST=....
   DB_PORT=....
   DB_NAME=....
   ```
4. Start the server:
   ```
   node server.js
   ```
   You should see: `Server running on http://localhost:3000`

**Frontend**

1. Open the file `frontend/index.html` directly in your browser (double-click it, or use the VS Code **Live Server** extension).
2. The page will load and automatically fetch your expenses from the backend.

## Features

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Screenshots

![Main view showing summary cards and the expense table](images/Screenshot%202026-09-30%20164049.png)

![Full expenses list with edit and delete buttons](images/Screenshot%202026-09-30%20164133.png)

![Export CSV dialog saving filtered expenses](images/Screenshot%202026-09-30%20164534.png)

## What was the hardest part?

The trickiest part was the **edit flow**. I used a `currentEditId` variable to know whether the user was adding or editing an expense. After saving, I reset the form and refreshed the table.

The hardest part was **connecting the backend to PostgreSQL**. I had to understand the `.env` settings and fix a connection error because PostgreSQL was not running.

Another challenge was **CSV export**. I had to convert the table data into CSV and create a download link using JavaScript.

I also worked on **frontend and backend validation** to show errors clearly without clearing the user's input.

