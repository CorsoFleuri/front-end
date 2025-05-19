import bluetooth from './BluetoothPrinter.js';

class Borne {
    constructor() {
        this.dateCreated = new Date();
        this.category = [];
        this.datasProduct = [];

        this.menus = [];
        this.menuSelected = null;
        this.pannier = [];

        this.content = document.querySelector('#main-content');
        this.pannierHtml = document.querySelector('#selected-items-list');
        this.run();
    }

    async run() {
        this.menus = await this.fetchMenuData();
        this.content.innerHTML = await this.displayMenu();
        this.createEvents();
        this.category = await this.fetchCategoryData();
        this.datasProduct = await this.fetchProductData();
    }

    async fetchMenuById(menuID) {
        const url =`http://api-corso-fleuri.local/menus/${menuID}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let result = [];

        await fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
            result = JSON.parse(json.body);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des menus :", err);
        });
        return result;
    }

    async fetchProductData() {
        const url =`http://api-corso-fleuri.local/articles`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let result = [];
        await fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
            result = JSON.parse(json.body);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des menus :", err);
        });
        return result;
    }

    async fetchCategoryData() {
        const url = 'http://api-corso-fleuri.local/category';
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let result = [];

        await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
                result = JSON.parse(json.body);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des categories :", err);
            });
        return result;
    }

    async fetchMenuData() {
        const url = 'http://api-corso-fleuri.local/menus';
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let result = [];

        await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
                result = JSON.parse(json.body);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des categories :", err);
            });
        return result;
    }

    displayMenu() {
        this.displayPannier();
        return this.menus.map(article => `
            <div class="menu">
                <img src="http://api-corso-fleuri.local/${article.menu_image}" alt="Image menu">
                <h2>${article.menu_name}</h2>
                <div class="price">${article.menu_price}€</div>
                <button data-id="${article.id}">Sélectionner</button>
            </div>`
        ).join('');
    }

    displayProduct() {
        this.displayPannier();
        console.log(this.datasProduct);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]);
        this.datasProduct.push(this.datasProduct[0]); //! trouver pourquoi on peut pas scrooller
        return this.datasProduct.map(article => `
            <div class="product">
                <img src="http://api-corso-fleuri.local/${article.product_image}" alt="Image produit">
                <h2>${article.product_name}</h2>
                <div class="price">${article.product_price}€</div>
                <button data-id="${article.id}">Sélectionner</button>
            </div>`
        ).join('');
    }

    async displayMenuSelect() {
        const idCategory = this.menuSelected.uniqueCategories[this.menuSelected.categoryindex];
        const articles = this.menuSelected.articles.filter(article => article.category_id == idCategory);
        
        return `<div id="category-container" class="category-container">
            <h2 class="category-title">${this.category.find(x => x.id === `${idCategory}`).name}</h2>
            <div class="products">
                ${articles.map(article => {
                    return `
                        <button class="product-button" data-id="${article.id}">
                            <img src="http://api-corso-fleuri.local/${article.image}" alt="${article.name}">
                            <span>${article.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>`;
    }

    displayPannier() {
        console.log(this.pannier);
        this.pannierHtml.innerHTML = this.pannier.map((item, index) => {
            return `
                <li>
                    ${item.menu ? item.menu.menu_name : item.product_name}
                    <button class="btn desactivation" data-id="${index}">Supprimer</button>
                </li>`;
        }).join('');

        const validate_button = document.querySelector('.validate-button');
        validate_button.disabled = this.pannier.length ? false : true;
        this.onClickDeletePannier();
    }

    createEvents() {
        this.onClickSelectionMenu();
        this.onClickSelectionProduct();
        this.onClickMenu_Product();
        this.onClickValidate();
        // this.onClickOpenModal();
        // this.updateEvents();

        // this.research();
    }

    updateEvents() {
        this.onClickSelectionMenu();
    }

    onClickSelectionMenu() {
        const menuButtons = document.querySelectorAll('.menu button');
        menuButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                console.log("e.tagrer, ligne 150");
                console.log(e.target);
                
                this.menuSelected = await this.fetchMenuById(e.target.dataset.id);
                this.pannier.push({
                    menu: this.menuSelected,
                    articlesSelected: []
                })
                this.menuSelected.categoryindex = 0;

                this.menuSelected.articles = this.menuSelected.articles.map(article => {
                    const data = this.datasProduct.find(data => data.id == article.articles_id);
                    if(data) {
                        return {
                            id: data.id,
                            image: data.product_image,
                            name: data.product_name,
                            category_id: data.category_id,
                            quantity: article.quantity,
                            unit: data.unit
                        };
                    }
                });

                this.menuSelected.uniqueCategories = Array.from(
                    new Set(this.menuSelected.articles.map(article => article.category_id))
                );

                this.content.innerHTML = await this.displayMenuSelect();
                this.addProductEvents();
            });
        });
    }

    onClickSelectionProduct() {
        const productButtons = document.querySelectorAll('.product button');
        productButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                console.log("e.tagrer, ligne 233");
                console.log(e.target);
                const data = this.datasProduct.find(data => data.id == e.target.dataset.id);
                console.log(data);
                this.pannier.push(data);
                this.displayPannier();
            });
        });
    }

    onClickMenu_Product() {
        const menuButton = document.querySelector('#menu-button');

        menuButton.addEventListener('click', async (e) => {
            console.log("menu button");
            console.log(e.target);
            this.content.innerHTML = await this.displayMenu();
            this.createEvents();
        });

        const productButton = document.querySelector('#products-button');
        productButton.addEventListener('click', async (e) => {
            console.log("menu button");
            console.log(e.target);
            this.content.innerHTML = await this.displayProduct();
            this.createEvents();
        });
    }

    addProductEvents() {
        const productButtons = document.querySelectorAll('.product-button');
        productButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                console.log("add protect");
                console.log(e.target.parentElement);
                const productId = e.target.parentElement.dataset.id;
                const product = this.menuSelected.articles.find(article => article.id == productId);
                this.pannier[this.pannier.length - 1].articlesSelected.push(product);
                this.menuSelected.categoryindex += 1;

                if(this.menuSelected.categoryindex >= this.menuSelected.uniqueCategories.length) {
                    console.log(this.pannier);
                    console.log('ici')

                    this.content.innerHTML = await this.displayMenu();
                    this.onClickSelectionMenu();
                    this.menuSelected = null;
                    return;
                }
                this.content.innerHTML = await this.displayMenuSelect();
                this.addProductEvents();
            });
        });
    }

    onClickDeletePannier() {
        const deleteButtons = document.querySelectorAll('.desactivation');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const menuId = e.target.dataset.id;
                this.pannier.splice(menuId, 1);
                this.displayPannier();
            });
        });
    }

    onClickValidate() {
        const validate_button = document.querySelector('.validate-button');
        validate_button.addEventListener('click', () => {

            const formData = new FormData();

            formData.append('pannier', this.pannier);
            
            console.log(formData);
            fetch("http://api-corso-fleuri.local/addCommand", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(results => {
                results = JSON.parse(results.body);
                console.log(results);
                // new bluetooth(results);

                // document.getElementById('selected-items-list').innerHTML= '';
                // articles = [];
            })
            .catch(error => console.error("Erreur:", error));
        });
    }
}

new Borne();