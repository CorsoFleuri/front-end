import MenuManager from './menu_manager.js';

class Menu {
    constructor() {
        this.datas = [];

        this.content = document.querySelector('.content');
        this.modal = document.querySelector('.modal');
        this.btnAjouter = document.querySelector('.btn-ajouter');

        this.run();
    }

    async run() {
        this.datas = await this.fetchMenuData();
        this.content.innerHTML = await this.displayMenu(this.datas);
        this.createEvents();
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
            console.log(result);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des menus :", err);
        });
        return result;
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

    createEvents() {
        this.onClickAdd();
        this.updateEvents();
        
        this.research();
    }

    onClickAdd() {
        this.btnAjouter.addEventListener("click", () => {
            this.menuManager();
        });
    }

    onClickModify() {
        this.btnModifier.addEventListener("click", () => { //! get le menu_id
            this.menuManager();
        });
    }

    menuManager() {
        new MenuManager().run();
        return;
    }

    updateEvents(indice = false) {
        this.onClickActive(document.querySelectorAll('.is_active'), indice);
        this.onClickModification(document.querySelectorAll('.modification'), indice);
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
                console.log(json);
                const data = JSON.parse(json.body);
                console.log(data);

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
            const result = this.datas.filter(data => data.menu_name.toLowerCase().includes(value.toLowerCase()));
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

new Menu();