// Expense Tracker - frontend logic


// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:3000/api/expenses";


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
// GET HTML ELEMENTS
// ==========================================

// Alert
const alertContainer =
    document.getElementById("alertContainer");


// Summary cards
const totalAmount =
    document.getElementById("totalAmount");

const expenseCount =
    document.getElementById("expenseCount");

const highestExpense =
    document.getElementById("highestExpense");


// Add form
const expenseForm =
    document.getElementById("expenseForm");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");


// Category filter
const categoryFilter =
    document.getElementById("categoryFilter");


// Month filter
const monthFilter =
    document.getElementById("monthFilter");


// Search
const searchInput =
    document.getElementById("searchInput");


// Export button
const exportCsvButton =
    document.getElementById("exportCsvButton");

// Clear filters button
const clearFiltersButton =
    document.getElementById("clearFiltersButton");


// Table
const expensesTableBody =
    document.getElementById("expensesTableBody");


// Spinner
const loadingSpinner =
    document.getElementById("loadingSpinner");


// Edit form
const editExpenseForm =
    document.getElementById("editExpenseForm");

const editExpenseId =
    document.getElementById("editExpenseId");

const editTitle =
    document.getElementById("editTitle");

const editAmount =
    document.getElementById("editAmount");

const editCategory =
    document.getElementById("editCategory");

const editDate =
    document.getElementById("editDate");


// Edit modal
const editExpenseModal =
    document.getElementById("editExpenseModal");


// ==========================================
// STORE EXPENSES
// ==========================================

let expenses = [];


// ==========================================
// LOAD EXPENSES
// GET /api/expenses
// ==========================================

async function loadExpenses() {

    // Show spinner
    loadingSpinner.classList.remove("d-none");

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load expenses."
            );

        }


        expenses =
            await response.json();


        // Display expenses
        renderExpenses();


        // Update summary cards
        updateSummary();

    } catch (error) {

        showAlert(
            "Could not load expenses. Make sure the server is running.",
            "danger"
        );

    } finally {

        // Hide spinner
        loadingSpinner.classList.add("d-none");

    }

}


// ==========================================
// DISPLAY EXPENSES IN TABLE
// ==========================================

function renderExpenses() {

    // Clear current table
    expensesTableBody.innerHTML = "";


    // Make a copy of all expenses
    let displayedExpenses = [...expenses];


    // ======================================
    // CATEGORY FILTER
    // ======================================

    const selectedCategory =
        categoryFilter.value;


    if (selectedCategory !== "All") {

        displayedExpenses =
            displayedExpenses.filter(
                function (expense) {

                    return (
                        expense.category ===
                        selectedCategory
                    );

                }
            );

    }


    // ======================================
    // MONTH FILTER
    // ======================================

    const selectedMonth =
        monthFilter.value;


    if (selectedMonth !== "") {

        displayedExpenses =
            displayedExpenses.filter(
                function (expense) {

                    return expense.date.startsWith(
                        selectedMonth
                    );

                }
            );

    }


    // ======================================
    // SEARCH BY TITLE
    // ======================================

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchText !== "") {

        displayedExpenses =
            displayedExpenses.filter(
                function (expense) {

                    return expense.title
                        .toLowerCase()
                        .includes(searchText);

                }
            );

    }

    


    // ======================================
    // NO RESULTS
    // ======================================

    if (displayedExpenses.length === 0) {

        const row =
            document.createElement("tr");

        const cell =
            document.createElement("td");


        cell.colSpan = 5;

        cell.className =
            "text-center text-muted";

        cell.textContent =
            "No expenses found.";


        row.appendChild(cell);

        expensesTableBody.appendChild(row);

        return;

    }


    // ======================================
    // CREATE TABLE ROWS
    // ======================================

    displayedExpenses.forEach(
        function (expense) {

            const row =
                document.createElement("tr");


            // ======================================
            // TITLE
            // ======================================

            const titleCell =
                document.createElement("td");

            titleCell.textContent =
                expense.title;


            // ======================================
            // AMOUNT
            // ======================================

            const amountCell =
                document.createElement("td");

            amountCell.textContent =
                Number(expense.amount).toFixed(2);


            // ======================================
            // CATEGORY
            // ======================================

            const categoryCell =
                document.createElement("td");


            const categoryBadge =
                document.createElement("span");


            categoryBadge.className =
                "badge " +
                getCategoryBadgeClass(
                    expense.category
                );


            categoryBadge.textContent =
                expense.category;


            categoryCell.appendChild(
                categoryBadge
            );


            // ======================================
            // DATE
            // ======================================

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                expense.date;


            // ======================================
            // ACTIONS
            // ======================================

            const actionsCell =
                document.createElement("td");

            actionsCell.className =
                "actions-cell";


            const buttonContainer =
                document.createElement("div");

            buttonContainer.className =
                "action-buttons";


            // Edit button
            const editButton =
                document.createElement("button");

            editButton.className =
                "btn btn-warning btn-sm";

            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function () {

                    openEditModal(
                        expense.id
                    );

                }
            );


            // Delete button
            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "btn btn-danger btn-sm";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteExpense(
                        expense.id
                    );

                }
            );


            buttonContainer.appendChild(
                editButton
            );

            buttonContainer.appendChild( 
                deleteButton
            );


            actionsCell.appendChild(
                buttonContainer
            );


            // ======================================
            // ADD CELLS TO ROW
            // ======================================

            row.appendChild(titleCell);

            row.appendChild(amountCell);

            row.appendChild(categoryCell);

            row.appendChild(dateCell);

            row.appendChild(actionsCell);


            // Add row to table
            expensesTableBody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// CATEGORY BADGE COLOR
// ==========================================

function getCategoryBadgeClass(category) {

    if (category === "Food") {

        return "bg-success";

    }


    if (category === "Transport") {

        return "bg-primary";

    }


    if (category === "Bills") {

        return "bg-danger";

    }


    if (category === "Entertainment") {

        return "bg-warning text-dark";

    }


    return "bg-secondary";

}


// ==========================================
// UPDATE SUMMARY CARDS
// ==========================================

function updateSummary() {

    // Number of expenses
    expenseCount.textContent =
        expenses.length;


    // No expenses
    if (expenses.length === 0) {

        totalAmount.textContent =
            "0.00";

        highestExpense.textContent =
            "0.00";

        return;

    }


    // ======================================
    // TOTAL AMOUNT
    // ======================================

    let total = 0;


    expenses.forEach(
        function (expense) {

            total +=
                Number(expense.amount);

        }
    );


    totalAmount.textContent =
        total.toFixed(2);


    // ======================================
    // HIGHEST EXPENSE
    // ======================================

    let highest =
        expenses[0];


    expenses.forEach(
        function (expense) {

            if (
                Number(expense.amount) >
                Number(highest.amount)
            ) {

                highest = expense;

            }

        }
    );


    highestExpense.textContent =
        highest.title +
        " - " +
        Number(
            highest.amount
        ).toFixed(2);

}


// ==========================================
// VALIDATE EXPENSE DATA
// ==========================================

function validateExpense(
    title,
    amount,
    category,
    date
) {

    // Title
    if (
        typeof title !== "string" ||
        title.trim() === ""
    ) {

        return "Title is required.";

    }


    // Amount
    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {

        return "Amount must be greater than 0.";

    }


    // Category
    if (
        !allowedCategories.includes(
            category
        )
    ) {

        return "Please choose a valid category.";

    }


    // Date
    if (
        typeof date !== "string" ||
        date.trim() === ""
    ) {

        return "Date is required.";

    }


    return null;

}


// ==========================================
// ADD EXPENSE
// POST /api/expenses
// ==========================================

expenseForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page reload
        event.preventDefault();


        const title =
            titleInput.value.trim();

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        // Validate data
        const validationError =
            validateExpense(
                title,
                amount,
                category,
                date
            );


        if (validationError) {

            showAlert(
                validationError,
                "danger"
            );

            return;

        }


        const newExpense = {

            title: title,

            amount: amount,

            category: category,

            date: date

        };


        try {

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                newExpense
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not add expense."
                );

            }


            showAlert(
                "Expense added successfully.",
                "success"
            );


            // Clear form
            expenseForm.reset();


            // Reload latest data
            await loadExpenses();

        } catch (error) {

            showAlert(
                error.message,
                "danger"
            );

        }

    }
);


// ==========================================
// DELETE EXPENSE
// DELETE /api/expenses/:id
// ==========================================

async function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE"

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not delete expense."
            );

        }


        showAlert(
            "Expense deleted successfully.",
            "success"
        );


        // Reload latest data
        await loadExpenses();

    } catch (error) {

        showAlert(
            error.message,
            "danger"
        );

    }

}


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(id) {

    // Find expense
    const expense =
        expenses.find(
            function (expense) {

                return expense.id === id;

            }
        );


    if (!expense) {

        showAlert(
            "Expense not found.",
            "danger"
        );

        return;

    }


    // Put expense values into modal
    editExpenseId.value =
        expense.id;

    editTitle.value =
        expense.title;

    editAmount.value =
        expense.amount;

    editCategory.value =
        expense.category;

    editDate.value =
        expense.date;


    // Open Bootstrap modal
    const modal =
        bootstrap.Modal.getOrCreateInstance(
            editExpenseModal
        );


    modal.show();

}


// ==========================================
// UPDATE EXPENSE
// PUT /api/expenses/:id
// ==========================================

editExpenseForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            editExpenseId.value;

        const title =
            editTitle.value.trim();

        const amount =
            Number(editAmount.value);

        const category =
            editCategory.value;

        const date =
            editDate.value;


        // Validate
        const validationError =
            validateExpense(
                title,
                amount,
                category,
                date
            );


        if (validationError) {

            showAlert(
                validationError,
                "danger"
            );

            return;

        }


        const updatedExpense = {

            title: title,

            amount: amount,

            category: category,

            date: date

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                updatedExpense
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not update expense."
                );

            }


            // Close modal
            const modal =
                bootstrap.Modal.getInstance(
                    editExpenseModal
                );


            if (modal) {

                modal.hide();

            }


            showAlert(
                "Expense updated successfully.",
                "success"
            );


            // Reload latest data
            await loadExpenses();

        } catch (error) {

            showAlert(
                error.message,
                "danger"
            );

        }

    }
);


// ==========================================
// FILTER BY CATEGORY
// ==========================================

categoryFilter.addEventListener(
    "change",
    function () {

        renderExpenses();

    }
);


// ==========================================
// FILTER BY MONTH
// ==========================================

monthFilter.addEventListener(
    "change",
    function () {

        renderExpenses();

    }
);


// ==========================================
// SEARCH BY TITLE
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        renderExpenses();

    }
);


// ==========================================
// EXPORT EXPENSES TO CSV
// ==========================================

function exportExpensesToCSV() {

    if (expenses.length === 0) {

        showAlert(
            "There are no expenses to export.",
            "warning"
        );

        return;

    }


    // CSV headers
    const rows = [

        [
            "ID",
            "Title",
            "Amount",
            "Category",
            "Date"
        ]

    ];


    // Add expenses
    expenses.forEach(
        function (expense) {

            rows.push([
                expense.id,
                expense.title,
                Number(
                    expense.amount
                ).toFixed(2),
                expense.category,
                expense.date
            ]);

        }
    );


    // Convert data to CSV
    const csvContent =
        rows.map(
            function (row) {

                return row.map(
                    function (value) {

                        const text =
                            String(value);


                        return (
                            '"' +text.replace(/"/g, '""') + '"');

                    }
                ).join(",");

            }
        ).join("\n");


    // Create CSV file
    const blob =
        new Blob(//binary large object  becouse it can't create a file directly in the browser, so we create a blob and then create a temporary URL for it
            [csvContent],//string format of the csv content
            {
                type:
                    "text/csv;charset=utf-8;" //test/csv is the type of the file, charset=utf-8 is the character encoding(you can use it for save the english .arabic and other languages)
            }
        );


    // Create temporary URL
    const url =
        URL.createObjectURL(
            blob
        );


    // Create temporary download link
    const link =
        document.createElement("a");


    link.href =
        url;

    link.download =
        "expenses.csv";


    // Start download
    link.click();


    // Remove temporary URL
    URL.revokeObjectURL(
        url
    );


    showAlert(
        "Expenses exported successfully.",
        "success"
    );

}


// ==========================================
// EXPORT BUTTON
// ==========================================

exportCsvButton.addEventListener(
    "click",
    exportExpensesToCSV
);

// ==========================================
// CLEAR FILTERS
// ==========================================

clearFiltersButton.addEventListener(
    "click",
    function () {

        // Reset category
        categoryFilter.value = "All";

        // Clear month
        monthFilter.value = "";

        // Clear search text
        searchInput.value = "";

        // Show all expenses again
        renderExpenses();

    }
);


categoryFilter.addEventListener(
    "change",
    function () {

        renderExpenses();

    }
);


// ==========================================
// SHOW ALERT
// ==========================================

function showAlert(
    message,
    type
) {

    // Remove previous alert
    alertContainer.innerHTML = "";


    // Create alert
    const alert =
        document.createElement("div");


    alert.className =
        `alert alert-${type}`;

    alert.setAttribute(
        "role",
        "alert"
    );


    alert.textContent =
        message;


    alertContainer.appendChild(
        alert
    );


    // Remove alert after 4 seconds
    setTimeout(
        function () {

            alert.remove();

        },
        4000
    );

}


// ==========================================
// START APPLICATION
// ==========================================

loadExpenses();