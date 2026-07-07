let selectedItemId = null;

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://csir-canteen-backend.onrender.com/api/login", {
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
        window.location.href = "index.html";
        return;
    }

    document.getElementById("welcome").innerText =
        "Welcome, " + admin;

    // Stats
    fetch("https://csir-canteen-backend.onrender.com/api/dashboard")
        .then(res => res.json())
        .then(data => {

            document.getElementById("totalItems").innerText =
                data.totalItems;

            document.getElementById("lowStock").innerText =
                data.lowStockItems;

        });


    // Low stock items
    fetch("https://csir-canteen-backend.onrender.com/api/items/low-stock")
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
        
}


// ---------------- TOGGLE LOW STOCK ----------------
function toggleLowStock() {

    const section = document.getElementById("lowStockSection");

    section.classList.toggle("hidden");
}


// ---------------- SEARCH ----------------
function searchItems() {

    let input = document.getElementById("itemSearch");
    if (!input) return; // prevents dashboard crash

    let name = input.value.toLowerCase();

    fetch("https://csir-canteen-backend.onrender.com/api/items")
        .then(res => res.json())
        .then(data => {

            let filtered = data.filter(item =>
                item.name.toLowerCase().includes(name)
            );

            let html = "";

            filtered.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.stock_quantity}</td>
                        <td>${item.unit}</td>
                        <td style="position:relative;">
                            <button class="menu-btn" onclick="openMenu(event, ${item.id})">⋮</button>

                            <div id="menu-${item.id}" class="dropdown-menu hidden">
                                <button onclick="increasePrompt(${item.id})">➕ Increase</button>
                                <button onclick="decreasePrompt(${item.id})">➖ Decrease</button>
                                <button onclick="deleteItem(${item.id})">🗑 Delete</button>
                            </div>
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

    fetch(`https://csir-canteen-backend.onrender.com/api/items/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadDashboard();
        loadItemsPage(); 
    });
}




// ---------------- ADD ITEM ----------------
function addItem() {

    const name = document.getElementById("itemName").value;
    const stock_quantity = document.getElementById("itemStock").value;
    const unit = document.getElementById("itemUnit").value;

    fetch("https://csir-canteen-backend.onrender.com/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stock_quantity, unit })
    })
    .then(res => res.json())
    .then(data => {

    document.getElementById("addMsg").innerText = data.message;

    document.getElementById("itemName").value = "";
    document.getElementById("itemStock").value = "";
    document.getElementById("itemUnit").value = "";

    loadDashboard();

    setTimeout(() => {
        document.getElementById("addMsg").innerText = "";
    }, 3000);

})
    .catch(err => {
        console.log(err);
        document.getElementById("addMsg").innerText = "Error adding item";
    });
}


// ---------------- LOGOUT ----------------
function logout() {
    localStorage.removeItem("admin");
    window.location.href = "index.html";
}


function openItemsPage() {
    window.location.href = "items.html";
}


function loadItemsPage() {

    fetch("https://csir-canteen-backend.onrender.com/api/items")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.stock_quantity}</td>
                        <td>${item.unit}</td>
                        <td style="position:relative;">
                
                    <button class="menu-btn" onclick="openMenu(event, ${item.id})">
                        ⋮
                    </button>

                        <div id="menu-${item.id}" class="dropdown-menu hidden">
                            <button onclick="increasePrompt(${item.id})">➕ Increase</button>
                            <button onclick="decreasePrompt(${item.id})">➖ Decrease</button>
                            <button onclick="deleteItem(${item.id})">🗑 Delete</button>
                        </div>

                        </td>
                    </tr>
                `;
            });

            document.getElementById("itemsTable").innerHTML = html;
        })
        .catch(err => {
            console.log(err);
            document.getElementById("itemsTable").innerHTML =
                "<tr><td colspan='3'>Error loading items</td></tr>";
        });
}


function loadLowStockPage() {

    fetch("https://csir-canteen-backend.onrender.com/api/items/low-stock")
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
}


function openLowStockPage() {
    window.location.href = "lowstock.html";
}




function toggleMenu(id) {

    const menu = document.getElementById(`menu-${id}`);

    // close all other menus first
    document.querySelectorAll(".dropdown-menu").forEach(m => {
        if (m !== menu) m.classList.add("hidden");
    });

    menu.classList.toggle("hidden");
}


function increasePrompt(id) {
    const value = prompt("Enter stock to ADD:");
    if (value === null) return;

    updateStockChange(id, Number(value)); // positive
}

function decreasePrompt(id) {
    const value = prompt("Enter stock to REMOVE:");
    if (value === null) return;

    updateStockChange(id, -Number(value)); // negative
}


function updateStockChange(id, change) {

    fetch(`https://csir-canteen-backend.onrender.com/api/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stock_change: change
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadItemsPage();
    });
}


function openMenu(event, itemId) {

    selectedItemId = itemId;

    const menu = document.getElementById("actionMenu");

    menu.style.left = (event.pageX + 10) + "px";
    menu.style.top = (event.pageY + 10) + "px";

    menu.classList.remove("hidden");
}


document.addEventListener("click", function (event) {

    const menu = document.getElementById("actionMenu");

    const isClickInsideMenu = menu.contains(event.target);

    const isClickOnButton = event.target.closest(".menu-btn");

    if (!isClickInsideMenu && !isClickOnButton) {
        menu.classList.add("hidden");
    }

});


function updateStock(id, change) {

    fetch(`https://csir-canteen-backend.onrender.com/api/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stock_quantity: change
        })
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        loadItemsPage();

        document.getElementById("actionMenu").classList.add("hidden");

    })
    .catch(err => {
        console.log(err);
        alert("Error updating stock");
    });
}


function increaseStock() {

    const value = prompt("Enter quantity to ADD:");

    if (value === null || value === "") return;

    fetch(`https://csir-canteen-backend.onrender.com/api/items`)
        .then(res => res.json())
        .then(data => {

            const item = data.find(i => i.id === selectedItemId);

            const newStock = Number(item.stock_quantity) + Number(value);

            updateStock(selectedItemId, newStock);
        });
}


function decreaseStock() {

    const value = prompt("Enter quantity to REMOVE:");

    if (value === null || value === "") return;

    fetch(`https://csir-canteen-backend.onrender.com/api/items`)
        .then(res => res.json())
        .then(data => {

            const item = data.find(i => i.id === selectedItemId);

            const newStock = Number(item.stock_quantity) - Number(value);

            if (newStock < 0) {
                alert("Stock cannot go below 0");
                return;
            }

            updateStock(selectedItemId, newStock);
        });
}

function loadHistory() {

    fetch("https://csir-canteen-backend.onrender.com/api/history")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(item => {
                const formattedDate = new Date(item.created_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                });
                html += `
                    <tr>
                        <td>${item.item_name}</td>
                        <td>${item.change_quantity}</td>
                        <td>${item.final_stock}</td>
                        <td>${item.action_type}</td>
                        <td>${formattedDate}</td>
                    </tr>
                `;
            });

            document.getElementById("historyTable").innerHTML = html;
        });
}


function openHistory() {
    window.location.href = "history.html";
}

function resetItems() {
    document.getElementById("itemSearch").value = "";
    loadItemsPage();
}
