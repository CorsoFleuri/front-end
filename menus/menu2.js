import {ThermalPrinter, Print} from "../assets/thermalPrinter/src/index.js";

let articles = [];

let menuID;

let defaultPaymentModalContent = "";

let categories = [];

let currentCategoryIndex = 1;

let selectedItems = [];

window.showOptions = function () {
    let menu;

    fetch(`http://api-corso-fleuri.local/menus/${menuID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then(response => response.json())
    .then(results => {
        menu = JSON.parse(results.body);

            fetch("http://api-corso-fleuri.local/articles", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .then(response => response.json())
            .then(results => {
                results = JSON.parse(results.body);
                const container = document.getElementById('category-container');

                const productsDiv = document.createElement('div');
                productsDiv.className = 'products';

                results.forEach(product => {
                    if(product.category_id == currentCategoryIndex){
                        let isFind = false;
                        menu.articles.forEach(article => {
                            if(article.articles_id == product.id){
                                isFind = true;
                            }
                        });
                        if(isFind){
                            const btn = document.createElement('button');
                            btn.className = 'product-button';
                            btn.onclick = function() { selectItem(product.product_name, product.id); };

                            const img = document.createElement('img');
                            img.src = `http://api-corso-fleuri.local/${product.product_image}`;
                            img.alt = product.product_name;
                            btn.appendChild(img);

                            const span = document.createElement('span');
                            span.textContent = product.product_name;
                            btn.appendChild(span);

                            productsDiv.appendChild(btn);
                        }
                    }
                });
                container.appendChild(productsDiv);
            })
            .catch(error => console.error("Erreur:", error));
    })
    .catch(error => console.error("Erreur:", error));
}

window.selectItem = function (item, id) {
    articles.push(id);
    selectedItems.push(item);
    const list = document.getElementById("selected-items-list");
    const newItem = document.createElement("li");
    newItem.textContent = item;
    list.appendChild(newItem);

    currentCategoryIndex++;
    initCategory();
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
    })
    .catch(error => console.error("Erreur:", error));
}

window.closeCard = function () {
    const cart = document.getElementById('cart');
    cart.style.display = 'none';
}

window.initCategory = function () {
    fetch("http://api-corso-fleuri.local/category", {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(response => response.json())
    .then(results => {
        results = JSON.parse(results.body);

        categories = results;

        const container = document.getElementById('category-container');
        container.innerHTML = '';

        if (currentCategoryIndex < categories.length) {
            let category = categories[currentCategoryIndex - 1];
            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category.name;
            container.appendChild(title);

            showOptions();
        } else {
            localStorage.setItem("articles", JSON.stringify(articles));
            localStorage.setItem("articlesName", JSON.stringify(selectedItems));
            window.location.href = "/borne/borne_panier.html";
        }
    })
    .catch(error => console.error("Erreur:", error));
}

window.init = function () {
    menuID = JSON.parse(localStorage.getItem("menuID")) || 0;
    articles = JSON.parse(localStorage.getItem("articles")) || [];
    selectedItems = JSON.parse(localStorage.getItem("articlesName")) || [];
    for(let i = 0; i < selectedItems.length; i++){
        const list = document.getElementById("selected-items-list");
        const newItem = document.createElement("li");
        newItem.textContent = selectedItems[i];
        list.appendChild(newItem);
    }
    initCategory();
    defaultPaymentModalContent = document.querySelector('.modal-content').innerHTML;

    document.getElementById('add-to-cart').addEventListener('click', showPaymentModal);
    
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