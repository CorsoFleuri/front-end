function redirectToMenuPage(menuPage) {
    window.location.href = menuPage;
}

function addToCart(product, price) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = parseFloat(cartTotal.innerText.replace('Total: ', '').replace('€', ''));

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `<span>${product}</span><span>${price.toFixed(2)}€</span>`;
    cartItems.appendChild(cartItem);

    total += price;
    cartTotal.innerText = `Total: ${total.toFixed(2)}€`;
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'none' ? 'flex' : 'none';
}

function showMenu() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="menu">
            <img src="menu1.png" alt="Menu 1">
            <h2>Menu 1</h2>
            <p>Description courte du Menu 1.</p>
            <div class="price">10.00€</div>
            <button onclick="redirectToMenuPage('../../menus/menu1.html')">Sélectionner</button>
        </div>
        
        <div class="menu">
            <img src="menu2.png" alt="Menu 2">
            <h2>Menu 2</h2>
            <p>Description courte du Menu 2.</p>
            <div class="price">12.00€</div>
            <button onclick="redirectToMenuPage('../../menus/menu2.html')">Sélectionner</button>
        </div>
    `;
}

function redirectToProductsPage() {
    window.location.href = 'borne_produit.html';
}