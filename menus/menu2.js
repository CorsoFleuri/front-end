import {ThermalPrinter, Print} from "../assets/thermalPrinter/src/index.js";

let articles = [];
let artilesName = [];

let articleSave = [];

let defaultPaymentModalContent = "";

window.showOptions = function (category, categoryName) {
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

window.addItem = function (itemName, itemID) {
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

window.removeItem = function (itemID, ItemName) {
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

window.validateCart = function () {
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

window.addCard = function () {
    artilesName.forEach(item => {
        articleSave.push(item);
    });
    artilesName = [];
    document.getElementById('selected-items-list').innerHTML= '';
}

window.showCard = function () {
    const cart = document.getElementById('cart');
    cart.style.display = 'block';
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    articleSave.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `<span>${item}</span>`;
        cartItemsContainer.appendChild(itemElement);
        total += 1;
    });

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.innerHTML = `Total: ${total} items`;
}

window.closeCard = function () {
    const cart = document.getElementById('cart');
    cart.style.display = 'none';
}

window.initCategory = function (){
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

window.init = function () {
    initCategory();
    defaultPaymentModalContent = document.querySelector('.modal-content').innerHTML;

    document.getElementById('add-to-cart').addEventListener('click', addCard);
    document.getElementById('show-cart').addEventListener('click', showCard);
    document.getElementById('close-cart').addEventListener('click', closeCard);
    document.getElementById('checkout').addEventListener('click', showPaymentModal);
    
    const paymentButtons = document.querySelectorAll('.payment-button');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            choosePaymentMethod(method);
        });
    });
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
}


window.closePaymentModal = function () {
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
}

window.choosePaymentMethod = function (method) {
    const modalContent = document.querySelector('.modal-content');
    const methodText = method === 'cash' ? 'Espèces' :
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
}

window.finalizeOrder = async function () {
    validateCart();
    const printer = new ThermalPrinter()
    console.log(navigator.bluetooth)
    await printer.conect()
}
async function connectPrinter(printer) {
    await printer.conect()
}
async function printTicket (printer, ticket) {
    await printer.printText(null, null, ticket)
}
function createTicket (line, ticket)  {
    if (line === "<<align: center>>") {
        ticket.alignCenter()
    } else if (line === "<<align: left>>") {
        ticket.alignLeft()
    } else if (line === "<<line>>")  {
        const l = "-".repeat(32) + "\n";
        ticket.addText(l)
    } else {
        ticket.addText(line + "\n")
    }
}

async function prepareTicket(printer) {
    fetch('http://api-corso-fleuri.local/app/ticket', {
        method: 'GET'
    })
        .then(reponse => reponse.json())
        .then(data => {
            const ticket = new Print()
            const body = data.body.split("\n")
            body.forEach(function (line) {
                createTicket(line, ticket)
            })
            ticket.newLine()
            ticket.newLine()
            ticket.newLine()
            ticket.newLine()
            ticket.fullCut()

            printTicket(printer, ticket)
        })
        .catch(error => console.error(error))
}

document.addEventListener('DOMContentLoaded', init);