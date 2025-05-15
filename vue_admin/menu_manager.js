export default class Menu_manager {
    constructor(id = false) {
        this.id = id;
        this.menu = {
            articles: []
        };
        this.datasProduct = [];
        this.category = [];

        this.mainContainer = document.querySelector('.main-container');
        this.modal = document.querySelector('.modal');
    }

    async run() {
        if(this.id) {
            this.menu = await this.fetch(`http://api-corso-fleuri.local/menus/${this.id}`);
            console.log(this.menu);
            console.log(this.id);
            // return;
        }
        this.mainContainer.innerHTML = await this.displayPageAdd();

        this.createEvents();
    }

    async fetch(url) {
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

    displayHeader() {
        return `
        <div class="header">
            <h1>Gestion des menus</h1>
            <div id="button-container">
                <a href="menu.html"> <button type="button" class="btn desactivation">Annuler</button> </a>
                <button type="button" class="btn modification" id="enregistrer-article">Enregistrer</button>
                <button type="button" class="btn btn-ajouter">Ajouter des produits</button>
            </div>
        </div>`;
    }

    async displayPageAdd() {
        console.log(this.menu.menu_name);
        return `
        ${this.displayHeader()}

        <div class="content-change">
            <div class="menu-details-container">
                <label class="upload-box">
                    <span id="upload-text">Mettre une image ici</span>
                    <img id="preview" src="${this.menu.menu_image ? `http://api-corso-fleuri.local/${this.menu.menu_image}` : ''}" style="display: ${this.menu.menu_image ? 'block' : 'none'};" >
                    <input type="file" id="fileInput" accept="image/*" >
                </label>
                <input type="file" id="fileInput" accept="image/*">
                <div class="menu-info">
                    <div class="input-group">
                        <label for="product_name" >Nom du menu</label>
                        <input type="text" name="product_name" id="product_name" required value="${this.menu.menu_name || ''}">
                    </div>
                    <div class="input-group">
                        <label for="product_price">Prix du menu</label>
                        <input type="number" name="product_price" id="product_price" required value="${this.menu.menu_price || ''}">
                    </div>
                </div>
            </div>
            <h2 id="article-title">Articles dans le menu</h2>
            <div id="menu-articles"></div>
        </div>`;
    }

    async putArticles() {
        this.menu.articles = this.menu.articles.map(article => {
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

        const menuArticles = document.querySelector("#menu-articles");
        menuArticles.innerHTML = await this.displayMenuArticle();
        this.onClickDelete();
        this.onClickInput();
    }

    async displayMenu(datas) {
        return datas.map(data => {
            return `
            <div class="menu-card" data-id="${data.id}">
                <img src="http://api-corso-fleuri.local/${data.menu_image}" alt="${data.menu_name}">
                <h2>${data.menu_name}</h2>
                <div class="details">
                    <p>Prix : ${data.menu_price}€</p>
                </div>
                <div>
                    <button type="button" class="btn modification">Modifier</button>
                    ${!data.is_active ? `<button type="button" class="btn is_active activation">Activer</button>` : `<button type="button" class="btn is_active desactivation">Désactiver</button>`}
                </div>
            </div>`;         
        }).join('');
    }

    async displayAddProduct() {
        return `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Ajouter des produits au menu</h2>
            
            <div class="input-group">
                <label id="label-articles" for="select-articles">Sélectionnez les articles :</label>
                <select id="select-articles" multiple>
                    ${!this.datasProduct.length ? '' : this.datasProduct.map(data => {
                        if(this.menu.articles.length && this.menu.articles.find(x => x.id === data.id)) return '';
                        return `<option value="${data.id}">${data.product_name}</option>`;
                    }).join('')}
                </select>
            </div>
            <button class= "btn btn-ajouter" id="ajouter-produits">Ajouter</button>
        </div>
        `;
    }

    async displayMenuArticle() {
        const uniqueCategories = Array.from(
            new Set(this.menu.articles.map(article => article.category_id))
        );

        return uniqueCategories.map(data => `<div class="category">
                <h3>${this.category.find(x => x.id == data).name} :</h3>
                <ul id="category-plat">
                ${this.menu.articles.filter(article => article.category_id === data).map(article => {
                    return `
                    <li data-id="${article.id}"><img src="http://api-corso-fleuri.local/${article.image}" alt="${article.name}"><span>${article.name}</span>
                        <div class="li-group">
                            <label for="product_price">Quantité</label>
                            <div class="input-unit-wrapper">
                                <input type="number" name="product_price" class="article_input" required value="${article.quantity || ''}">
                                <span class="unit">p</span>
                                <button class="btn desactivation">Supprimer</button>
                            </div>
                        </div>
                    </li>`;
                }).join('')}
                </ul>
            </div>`
        ).join('');
    }

    async createEvents() {
        this.onChangeImage();
        this.onClickAddProduct();
        this.enregistrerArticle();
        this.datasProduct = await this.fetch('http://api-corso-fleuri.local/articles');
        this.category = await this.fetch('http://api-corso-fleuri.local/category');
        if(this.id) this.putArticles();

        this.onClickDelete();
        return;
        this.onClickOpenModal();
        this.updateEvents();
        
        this.research();
    }

    updateEvents(indice = false) {
        this.onClickActive(document.querySelectorAll('.is_active'), indice);
        this.onClickModification(document.querySelectorAll('.modification'), indice);
    }

    onChangeImage() {
        document.getElementById("fileInput").addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById("preview");
                    img.src = e.target.result;
                    img.style.display = "block";
                    document.getElementById("upload-text").style.display = "none";
                };
              reader.readAsDataURL(file);
            }
        });
    }

    onClickAddProduct() {
        document.querySelector('.btn-ajouter').addEventListener("click", async() => {
            this.modal.innerHTML = await this.displayAddProduct();
            this.onClickValidProduct();
            this.onClickCloseModal();

            this.modal.style.display = "flex";
        });
    }

    onClickValidProduct() {
        document.getElementById("ajouter-produits").addEventListener('click', async (event) => {
            event.preventDefault();
            const select = document.getElementById("select-articles");
            
            const selectedValues = Array.from(select.selectedOptions).map(option => {
                const data = this.datasProduct.find(data => data.id == option.value);
                console.log(data);
                return {
                    id: data.id,
                    image: data.product_image,
                    name: data.product_name,
                    category_id: data.category_id,
                    qu: data.product_quantity
                };
            });

            this.modal.style.display = "none";
            this.menu.articles = this.menu.articles.concat(selectedValues);

            const menuArticles = document.querySelector("#menu-articles");
            menuArticles.innerHTML = await this.displayMenuArticle(this.datas);
        });
    }

    onClickOpenModal() {
        this.btnAjouter.addEventListener("click", () => {
            this.displayModal("Ajouter");
            this.modal.style.display = "flex";
            this.onClickSubmit();
            this.onClickCloseModal();
        });
    }

    onClickCloseModal() {
        const btnClose = this.modal.querySelector(".close");

        btnClose.addEventListener("click", () => {
            this.modal.style.display = "none";
        });
    }

    enregistrerArticle() {
        document.getElementById("enregistrer-article").addEventListener('click', async (event) => {
            event.preventDefault();
            const name = document.getElementById("product_name").value.trim();
            const price = document.getElementById("product_price").value.trim();

            const fileInput = document.getElementById("fileInput");;
            const image = fileInput.files.length > 0 ? fileInput.files[0] 
                : this.id ? document.querySelector("#preview").src.replace('http://api-corso-fleuri.local/', '') 
                : null;

            if(!name || !price || (!image && !this.id)) {
                console.log(name, price, image);
                alert("Veuillez remplir tous les champs");
                return;
            }

            if(!this.menu.articles.length) {
                alert("Veuillez ajouter des articles au menu");
                return;
            }
            this.menu.name = name;
            this.menu.price = price;
            this.menu.image = image;

            const formData = new FormData();
            formData.append("menu_name", name);
            if(this.id) formData.append("menu_id", this.id);
            formData.append("menu_price", price);
            formData.append("image", image);
            formData.append("articles", JSON.stringify(this.menu.articles));

            const url = !this.id ? 'http://api-corso-fleuri.local/menus/add' : `http://api-corso-fleuri.local/menus/edit/${this.id}`;
            const options = {
                method: 'POST',
                body: formData
            }

            fetch(url, options);
            window.location.href = './menu.html';
        });
    }

    onClickDelete() {
        const elsDelete = document.querySelectorAll('.desactivation');
        for (let i = 0; i < elsDelete.length; i += 1) {
            elsDelete[i].addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.parentElement;
                const { id } = target.dataset;

                this.menu.articles = this.menu.articles.filter(article => article.id != id);

                const Lis = target.parentElement.querySelectorAll('li').length;
                if(Lis === 1) {
                    target.parentElement.parentElement.remove();
                } else {
                    target.remove();
                }
            });
        }
    }

    onClickInput() {
        const input = document.querySelectorAll('.article_input');
        console.log(input);
        for (let i = 0; i < input.length; i += 1) {
            input[i].addEventListener('input',(e) => {
                const value = e.target.value;

                if (isNaN(value) || value.trim() === '') {
                    alert('Veuillez entrer un nombre valide');
                    return;
                }
                const { id } = e.target.parentElement.parentElement.parentElement.dataset;
                const data = this.menu.articles.find(data => data.id == id);
                data.quantity = value;
            });
        }
    }

    onClickSubmit(eventTarget = null) {
        document.getElementById("submit-menu").addEventListener('click', async (event) => {
            event.preventDefault();
            const form = document.getElementById("form-menu");
            if (!form.checkValidity()) return form.reportValidity();

            const articleId = form.getAttribute('data-id');

            const formData = new FormData(form);

            this.modal.style.display = "none";

            if(articleId !== 'undefined') {
                const data = this.datas.find(data => data.id == articleId);
                formData.append('product_image', data.product_image);
                formData.append('is_active', data.is_active);
            }

            const url = articleId !== 'undefined' ? `http://api-corso-fleuri.local/articles/edit/${articleId}` : 'http://api-corso-fleuri.local/articles/add';
            const options = {
                method: 'POST',
                body: formData
            }

            fetch(url, options)
            .then(response => response.json())
            .then(async (json) => {
                const data = JSON.parse(json.body);

                if (articleId === 'undefined' ) {
                    this.datas.push({
                        id: data.id,
                        product_name: data.product_name,
                        product_price: data.product_price,
                        product_quantity: data.product_quantity,
                        product_buy_price: data.product_buy_price,
                        unit: data.unit,
                        product_image: data.product_image,
                        is_hot: data.is_hot,
                        is_active: true,
                        category_id: data.category_id
                    });
                    this.content.insertAdjacentHTML('beforeend', await this.displayMenu([this.datas[this.datas.length - 1]]));
                    this.updateEvents(this.datas.length - 1);
                } else {
                    const datamenu = this.datas.find(data => data.id == articleId);
                    datamenu.id = data.id;
                    datamenu.product_name = data.product_name;
                    datamenu.product_price = data.product_price;
                    datamenu.product_quantity = data.product_quantity;
                    datamenu.product_buy_price = data.product_buy_price;
                    datamenu.unit = data.unit;
                    datamenu.product_image = data.product_image;
                    datamenu.is_hot = data.is_hot;
                    datamenu.is_active = data.is_active;
                    datamenu.category_id = data.category_id;

                    eventTarget.outerHTML = await this.displayMenu([data]);
                    this.updateEvents(this.datas.findIndex(data => data.id == data.id));
                }
    
            }).catch((err) => {
                console.error("Erreur lors de la modification d'un article :", err);
            })
        });
    }

    onClickActive(elsIsActive, indice = false) {
        for (let i = indice || 0; indice !== false ? i < indice + 1 : i < elsIsActive.length; i += 1) {
            elsIsActive[i].addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target;

                const { id } = target.parentElement.parentElement.dataset;

                const is_active = target.classList.contains('activation') ? true : false;
                target.outerHTML = !is_active ? `<button type="button" class="btn is_active activation">Activer</button>` : `<button type="button" class="btn is_active desactivation">Désactiver</button>`;

                this.onClickActive(document.querySelectorAll('.is_active'), i);

                const url = `http://api-corso-fleuri.local/articles/is_active/${id}`;
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `is_active=${is_active}`
                };

                fetch(url, options);
            });
        }
    }

    research() {
        const input = document.querySelector('#research');
        input.addEventListener('input', async (e) => {
            const value = e.target.value;
            const result = this.datas.filter(data => data.product_name.toLowerCase().includes(value.toLowerCase()));
            this.content.innerHTML = await this.displayMenu(result);
            this.updateEvents();
        });
    }

    onClickModification(elsModification, indice = false) {
        for (let i = indice || 0; indice !== false ? i < indice + 1 : i < elsModification.length; i += 1) {
            elsModification[i].addEventListener('click', (e) => {
                const targetParent = e.target.parentElement.parentElement;
                const { id } = targetParent.dataset;

                this.displayModal('Modifier', this.datas.find(data => data.id == id));
                this.modal.style.display = 'flex';
                this.onClickCloseModal();
                this.onClickSubmit(targetParent);
            });
        }
    }
}

new Menu_manager();