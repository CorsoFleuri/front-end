function showOptions(category) {
    const optionsTitle = document.getElementById('options-title');
    const optionsList = document.getElementById('options-list');
    optionsTitle.textContent = `Choisissez un ${category}`;
    let optionsHtml = '';

    if (category === 'Dessert') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Dessert 1', 'dessert-list')">Dessert 1</button></li>
            <li><button class="option-button" onclick="addItem('Dessert 2', 'dessert-list')">Dessert 2</button></li>
            <li><button class="option-button" onclick="addItem('Dessert 3', 'dessert-list')">Dessert 3</button></li>
        `;
    } else if (category === 'Plat') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Plat 1', 'plat-list')">Plat 1</button></li>
            <li><button class="option-button" onclick="addItem('Plat 2', 'plat-list')">Plat 2</button></li>
            <li><button class="option-button" onclick="addItem('Plat 3', 'plat-list')">Plat 3</button></li>
        `;
    } else if (category === 'Frite') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Frite 1', 'frite-list')">Frite 1</button></li>
            <li><button class="option-button" onclick="addItem('Frite 2', 'frite-list')">Frite 2</button></li>
        `;
    } else if (category === 'Soft') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Soft 1', 'soft-list')">Soft 1</button></li>
            <li><button class="option-button" onclick="addItem('Soft 2', 'soft-list')">Soft 2</button></li>
        `;
    } else if (category === 'Boisson') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Boisson 1', 'boisson-list')">Boisson 1</button></li>
            <li><button class="option-button" onclick="addItem('Boisson 2', 'boisson-list')">Boisson 2</button></li>
        `;
    } else if (category === 'Salade') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Salade 1', 'salade-list')">Salade 1</button></li>
            <li><button class="option-button" onclick="addItem('Salade 2', 'salade-list')">Salade 2</button></li>
        `;
    }

    optionsList.innerHTML = optionsHtml;
}

function addItem(itemName, listId) {
    const list = document.getElementById(listId);
    if (!list) {
        const newList = document.createElement('ul');
        newList.id = listId;
        document.getElementById('selected-items-list').appendChild(newList);
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `${itemName} <button class="remove-button" onclick="removeItem(this)">Supprimer</button>`;
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

function removeItem(button) {
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
    alert('Panier validé !');
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