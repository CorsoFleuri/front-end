let articles = [];

function showOptions(category) {
    const optionsTitle = document.getElementById('options-title');
    const optionsList = document.getElementById('options-list');
    optionsTitle.textContent = `Choisissez un ${category}`;
    let optionsHtml = '';

    // if (category === 'Dessert') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Dessert 1', '1', 'dessert-list')">Dessert 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Dessert 2', '2', 'dessert-list')">Dessert 2</button></li>
    //         <li><button class="option-button" onclick="addItem('Dessert 3', '3', 'dessert-list')">Dessert 3</button></li>
    //     `;
    // } else if (category === 'Plat') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Plat 1', '5', 'plat-list')">Plat 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Plat 2', '6', 'plat-list')">Plat 2</button></li>
    //         <li><button class="option-button" onclick="addItem('Plat 3', '7', 'plat-list')">Plat 3</button></li>
    //     `;
    // } else if (category === 'Frite') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Frite 1', '8', 'frite-list')">Frite 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Frite 2', '9', 'frite-list')">Frite 2</button></li>
    //     `;
    // } else if (category === 'Soft') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Soft 1', '10', 'soft-list')">Soft 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Soft 2', '11', 'soft-list')">Soft 2</button></li>
    //     `;
    // } else if (category === 'Boisson') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Boisson 1', '12', 'boisson-list')">Boisson 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Boisson 2', '13', 'boisson-list')">Boisson 2</button></li>
    //     `;
    // } else if (category === 'Salade') {
    //     optionsHtml += `
    //         <li><button class="option-button" onclick="addItem('Salade 1', '14', 'salade-list')">Salade 1</button></li>
    //         <li><button class="option-button" onclick="addItem('Salade 2', '15', 'salade-list')">Salade 2</button></li>
    //     `;
    // }

    fetch("http://api-corso-fleuri.local/articles", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(articles => {
        let html = "";
        console.log(articles);
        articles.forEach(article => {
            if(category == article.category_id){
                html += `
                <div class="article">
                    <img src="${article.product_image}" alt="${article.product_name}" width="100">
                    <h3>${article.product_name}</h3>
                    <p>Prix : ${article.product_price} €</p>
                    <p>Stock : ${article.product_quantity}</p>
                </div>
            `;
            }
        });
        optionsList.innerHTML = html;
    })
    .catch(error => console.error("Erreur:", error));
}

function addItem(itemName, itemID, listId) {
    articles.push(itemID);
    const list = document.getElementById(listId);
    if (!list) {
        const newList = document.createElement('ul');
        newList.id = listId;
        document.getElementById('selected-items-list').appendChild(newList);
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `${itemName} <button class="remove-button" onclick="removeItem(this, itemID)">Supprimer</button>`;
    document.getElementById(listId).appendChild(listItem);

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    const optionsTitle = document.getElementById('options-title');
    optionsTitle.textContent = '';

    // Add item to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: itemName, listId: listId });
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
        body: `menus=${'1'}&articles=${text}`
    })
    .then(response => response.json())
    .then(result => {
        console.log("Succès:", result);
        this.closeModal();
        this.formProduit.reset();
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

// Initialiser l'affichage du panier
document.addEventListener('DOMContentLoaded', updateCartDisplay);