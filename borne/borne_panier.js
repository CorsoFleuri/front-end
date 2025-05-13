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
    fetch("http://api-corso-fleuri.local/menus", {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then(response => response.json())
    .then(results => {
        results = JSON.parse(results.body);
        console.log(results);
        const mainContent = document.getElementById('main-content');
        results.forEach(article => {
            mainContent.innerHTML += `
                <div class="menu">
                    <img src="http://api-corso-fleuri.local/${article.menu_image}" alt="Image menu">
                    <h2>${article.menu_name}</h2>
                    <div class="price">${article.menu_price}€</div>
                    <button onclick="redirectToMenuPage('../../menus/menu2.html')">Sélectionner</button>
                </div>
            `;
        });
    })
    .catch(error => console.error("Erreur:", error));
}

function redirectToProductsPage() {
    window.location.href = 'borne_produit.html';
}

document.addEventListener('DOMContentLoaded', showMenu);