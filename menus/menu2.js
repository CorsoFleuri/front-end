let articles = [];

function showOptions(category, categoryName) {
    const optionsTitle = document.getElementById('options-title');
    const optionsList = document.getElementById('options-list');
    optionsTitle.textContent = `Choisissez un ${categoryName}`;

    fetch("http://api-corso-fleuri.local/articles", {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then(response => response.json())
    .then(articles => {
        let html = "";
        articles = JSON.parse(articles.body);
        console.log(articles);
        articles.forEach(article => {
            if(category == article.category_id){
                html += `
                <button class="article" onclick="addItem('${article.product_name}', ${article.id})">
                    <img src="http://api-corso-fleuri.local/${article.product_image}" alt="${article.product_name}" width="100">
                    <h3>${article.product_name}</h3>
                    <p>Prix : ${article.product_price} €</p>
                    <p>Stock : ${article.product_quantity}</p>
                </button>
            `;
            }
        });
        optionsList.innerHTML = html;
    })
    .catch(error => console.error("Erreur:", error));
}

function addItem(itemName, itemID) {
    articles.push(itemID);
    const list = document.getElementById(itemID);
    if (!list) {
        const newList = document.createElement('ul');
        newList.id = itemID;
        document.getElementById('selected-items-list').appendChild(newList);
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `${itemName} <button class="remove-button" onclick="removeItem(this, itemID)">Supprimer</button>`;
    document.getElementById(itemID).appendChild(listItem);

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    const optionsTitle = document.getElementById('options-title');
    optionsTitle.textContent = '';

    // Add item to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: itemName, listId: itemID });
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartDisplay();
}

function removeItem(button, itemID) {
    articles = articles.filter(item => item !== itemID);

    const listItem = button.parentElement;
    const listId = listItem.parentElement.id;
    const itemName = listItem.textContent.replace(' Supprimer', '');

    // Remove item from cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.name === itemName && item.listId === listId));
    localStorage.setItem('cart', JSON.stringify(cart));

    listItem.remove();
    updateCartDisplay();
}

function validateCart() {

    let text = articles.join(",");
    
    fetch("http://api-corso-fleuri.local/addCommand", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `articles=3,4`
    })
    .then(response => response.json())
    .then(result => {
        console.log("Succès:", result);
    })
    .catch(error => console.error("Erreur:", error));
}

function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `<span>${item.name}</span>`;
        cartItemsContainer.appendChild(itemElement);
        total += 1; // Assuming each item is 1 unit for simplicity
    });

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.innerHTML = `Total: ${total} items`;

    toggleCart();
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'none' ? 'block' : 'none';
}

function updateCartDisplay() {
    const selectedItemsList = document.getElementById('selected-items-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    selectedItemsList.innerHTML = '';

    cart.forEach(item => {
        const list = document.getElementById(item.listId);
        if (!list) {
            const newList = document.createElement('ul');
            newList.id = item.listId;
            selectedItemsList.appendChild(newList);
        }
        const listItem = document.createElement('li');
        listItem.innerHTML = `${item.name} <button class="remove-button" onclick="removeItem(this)">Supprimer</button>`;
        document.getElementById(item.listId).appendChild(listItem);
    });
}

function initCategory(){
    fetch("http://api-corso-fleuri.local/category", {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(response => response.json())
    .then(results => {
        results = JSON.parse(results.body);
        const listElement = document.getElementById("showOptionsList");
        if (!listElement) {
            console.error("L'élément showOptionsList est introuvable.");
            return;
        }

        results.forEach(result => {
            let listItem = document.createElement("li");
            let button = document.createElement("button");
            button.textContent = result.name;
            button.onclick = () => showOptions(result.id, result.name);
            listItem.appendChild(button);
            listElement.appendChild(listItem);
        });
    })
    .catch(error => console.error("Erreur:", error));
}

function init(){
    initCategory();
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', init);