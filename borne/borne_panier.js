let defaultPaymentModalContent;

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then(response => response.json())
    .then(results => {
        results = JSON.parse(results.body);
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

window.showPaymentModal = function () {
    const modal = document.getElementById('payment-modal');
    const modalContent = document.querySelector('.modal-content');
    modal.style.display = 'flex';
    modalContent.innerHTML = defaultPaymentModalContent;

    const paymentButtons = document.querySelectorAll('.payment-button');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            choosePaymentMethod(method);
        });
    });
    
    document.getElementById('close-modal').addEventListener('click', closePaymentModal);
};

window.closePaymentModal = function () {
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
};

window.choosePaymentMethod = function (method) {
    const modalContent = document.querySelector('.modal-content');
    const methodText =
          method === 'cash' ? 'Espèces' :
          method === 'credit-card' ? 'Carte Bancaire' :
          method === 'sumup' ? 'SumUp' :
          method === 'vip' ? 'VIP' : 'Méthode inconnue';

    modalContent.innerHTML = `
        <span class="close-modal" id="close-modal-2">&times;</span>
        <h2 id="chosen-method-text">Vous avez choisi de payer par ${methodText}</h2>
        <div class="payment-buttons">
            <button class="return-button" id="return-button">Retour</button>
            <button class="payment-button" id="finalize-order">Finaliser la commande</button>
        </div>
    `;

    document.getElementById('close-modal-2').addEventListener('click', closePaymentModal);
    document.getElementById('return-button').addEventListener('click', showPaymentModal);
    document.getElementById('finalize-order').addEventListener('click', finalizeOrder);
};

function finalizeOrder() {
    console.log("Commande finalisée");
}

function init() {
    showMenu();

    let selectedItems = JSON.parse(localStorage.getItem("articlesName")) || [];
    for (let i = 0; i < selectedItems.length; i++) {
        const list = document.getElementById("selected-items-list");
        const newItem = document.createElement("li");
        newItem.textContent = selectedItems[i];
        list.appendChild(newItem);
    }

    const modalContentElement = document.querySelector('.modal-content');
    defaultPaymentModalContent = modalContentElement ? modalContentElement.innerHTML : "";

    document.getElementById('add-to-cart').addEventListener('click', showPaymentModal);

    const paymentButtons = document.querySelectorAll('.payment-button');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            choosePaymentMethod(method);
        });
    });
}

document.addEventListener('DOMContentLoaded', init);
