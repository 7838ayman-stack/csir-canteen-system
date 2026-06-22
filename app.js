
function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {

        if (data.message === "Login Successful") {
            localStorage.setItem("admin", data.admin);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("msg").innerText = data.message;
        }

    })
    .catch(() => {
        document.getElementById("msg").innerText = "Server Error";
    });
}


// Auto-load dashboard
if (window.location.pathname.includes("dashboard.html")) {
    loadDashboard();
}


// ---------------- DASHBOARD ----------------
function loadDashboard() {

    const admin = localStorage.getItem("admin");

    if (!admin) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("welcome").innerText =
        "Welcome, " + admin;

    // Stats
    fetch("http://localhost:3000/api/dashboard")
        .then(res => res.json())
        .then(data => {

            document.getElementById("totalItems").innerText =
                data.totalItems;

            document.getElementById("lowStock").innerText =
                data.lowStockItems;

        });


    // Low stock items
    fetch("http://localhost:3000/api/items/low-stock")
        .then(res => res.json())
        .then(data => {

            let html = "";

            if (data.length === 0) {
                html = `<tr><td colspan="3">No low stock items 🎉</td></tr>`;
            } else {
                data.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.stock_quantity}</td>
                            <td>${item.unit}</td>
                        </tr>
                    `;
                });
            }

            document.getElementById("lowStockTable").innerHTML = html;
        });


    // Inventory
    fetch("http://localhost:3000/api/items")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.stock_quantity}</td>
                        <td>${item.unit}</td>
                        <td>
                            <button onclick="updateStock(${item.id})">Update</button>
                            <button onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("itemsTable").innerHTML = html;
        });
}


// ---------------- TOGGLE LOW STOCK ----------------
function toggleLowStock() {

    const section = document.getElementById("lowStockSection");

    section.classList.toggle("hidden");
}


// ---------------- SEARCH ----------------
function searchItem() {

    const name = document.getElementById("searchInput").value;

    fetch(`http://localhost:3000/api/items/search?name=${name}`)
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.stock_quantity}</td>
                        <td>${item.unit}</td>
                        <td>
                            <button onclick="updateStock(${item.id})">Update</button>
                            <button onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("itemsTable").innerHTML = html;
        });
}


// ---------------- DELETE ----------------
function deleteItem(id) {

    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`http://localhost:3000/api/items/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadDashboard();
    });
}


// ---------------- UPDATE ----------------
function updateStock(id) {

    const stock = prompt("Enter new stock quantity:");

    if (stock === null) return;

    fetch(`http://localhost:3000/api/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stock_quantity: stock
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadDashboard();
    });
}


// ---------------- ADD ITEM ----------------
function addItem() {

    const name = document.getElementById("itemName").value;
    const stock_quantity = document.getElementById("itemStock").value;
    const unit = document.getElementById("itemUnit").value;

    fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            stock_quantity,
            unit
        })
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("addMsg").innerText = data.message;

        document.getElementById("itemName").value = "";
        document.getElementById("itemStock").value = "";
        document.getElementById("itemUnit").value = "";

        loadDashboard();
    });
}


// ---------------- LOGOUT ----------------
function logout() {
    localStorage.removeItem("admin");
    window.location.href = "login.html";
}