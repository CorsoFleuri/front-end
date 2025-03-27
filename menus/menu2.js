let articles = [];
let artilesName = [];

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
    artilesName.push(itemName);
    const list = document.getElementById(itemID);
    if (!list) {
        const newList = document.createElement('ul');
        newList.id = itemID;
        document.getElementById('selected-items-list').appendChild(newList);
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `${itemName} <button class="remove-button" onclick="removeItem(${itemID},'${itemName}')">Supprimer</button>`;
    document.getElementById(itemID).appendChild(listItem);

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    const optionsTitle = document.getElementById('options-title');
    optionsTitle.textContent = '';

}

function removeItem(itemID, ItemName) {
    document.getElementById('selected-items-list').innerHTML= '';
    articles = articles.filter(item => item !== itemID);
    artilesName = artilesName.filter(item => item !== ItemName);
    for(let i = 0; i < articles.length; i++){
        const id = articles[i];
        const name = artilesName[i];
        const list = document.getElementById(itemID);
        if (!list) {
            const newList = document.createElement('ul');
            newList.id = itemID;
            document.getElementById('selected-items-list').appendChild(newList);
        }
        const listItem = document.createElement('li');
        listItem.innerHTML = `${name} <button class="remove-button" onclick="removeItem(${id}, '${name}')">Supprimer</button>`;
        document.getElementById(itemID).appendChild(listItem);
    }
}

function validateCart() {

    const menuId = 2;

    const params = new URLSearchParams();
    params.append("menus", menuId);
    params.append("articles", articles);
    console.log(articles);
    console.log(params.toString());
    
    fetch("http://api-corso-fleuri.local/addCommand", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    })
    .then(response => response.json())
    .then(result => {
        console.log("Succès:", result);
        document.getElementById('selected-items-list').innerHTML= '';
        articles = [];
        artilesName = [];
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
}

function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closePaymentModal()">&times;</span>
        <h2>Choisissez votre mode de paiement</h2>
        <div class="payment-buttons">
            <button class="payment-button Especes" onclick="choosePaymentMethod('cash')">Espèces</button>
            <button class="payment-button" onclick="choosePaymentMethod('credit-card')">Carte Bancaire</button>
            <button class="payment-button SumUp" onclick="closePaymentModal()">SumUp</button>
            <button class="payment-button VIP" onclick="closePaymentModal()">VIP</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
}

function choosePaymentMethod(method) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closePaymentModal()">&times;</span>
        <h2>Vous avez choisi de payer par ${method === 'cash' ? 'Espèces' : 'Carte Bancaire'}</h2>
        <div class="payment-buttons">
            <button class="return-button" onclick="showPaymentModal()">Retour</button>
            <button class="payment-button" onclick="finalizeOrder()">Finaliser la commande</button>
        </div>
    `;
}

function finalizeOrder() {
    console.log('Commande finalisée');
    // Implement order finalization logic here
    closePaymentModal();
}

document.addEventListener('DOMContentLoaded', init);