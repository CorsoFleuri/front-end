class Produit {
    constructor() {
        this.datas = [];

        this.content = document.querySelector('.content');
        this.modal = document.querySelector('.modal');
        this.btnAjouter = document.querySelector('.btn-ajouter');

        this.run();
    }

    async run() {
        this.datas = await this.fetchUserData();
        this.category = await this.fetchCategoryData();
        console.log(this.category);
        this.content.innerHTML = await this.displayProduit(this.datas);
        this.createEvents();
    }

    async fetchUserData() {
        const url = 'http://api-corso-fleuri.local/articles';
        const options = {
            method: 'GET',
            credentials: 'include',
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
            console.error("Erreur lors de la récupération des articles :", err);
        });
        return result;
    }

    async fetchCategoryData() {
        const url = 'http://api-corso-fleuri.local/category';
        const options = {
            method: 'GET',
            credentials: 'include',
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

    async displayProduit(datas) {
        return datas.map(data => {
            return `
            <div class="produit-card" data-id="${data.id}">
                <img src="http://api-corso-fleuri.local/${data.product_image}" alt="${data.product_name}">
                <h2>${data.product_name}</h2>
                <div class="details">
                    <p>Stocks : ${data.product_quantity} ${data.unit}</p>
                    <p>Prix : ${data.product_price}€</p>
                </div>
                <div>
                    <button type="button" class="btn modification">Modifier</button>
                    ${!data.is_active ? `<button type="button" class="btn is_active activation">Activer</button>` : `<button type="button" class="btn is_active desactivation">Désactiver</button>`}
                </div>
            </div>`;         
        }).join('');
    }

    displayModal(action, produit = {}) {
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${action === 'Ajouter' ? 'Ajouter un produit' : `Modifier le produit '${produit.product_name}'`}</h2>
                <form id="form-produit" enctype="multipart/form-data" data-id="${produit.id}">
                    <div class="input-group">
                        <label for="image">Image (${!produit.product_image ? 'fichier à uploader' : 'Optionnelle'})</label>
                        ${!produit.product_image ? '<input type="file" name="image" id="image" accept="image/*" required>' : '<input type="file" name="image" id="image" accept="image/*">'}
                    </div>
                    <div class="input-group">
                        <label for="product_name">Nom du produit</label>
                        <input type="text" name="product_name" id="product_name" required value="${produit.product_name || ''}">
                    </div>
                    <div class="input-group">
                        <label for="product_price">Prix</label>
                        <input type="number" name="product_price" id="product_price" step="0.01" required value="${produit.product_price || ''}">
                    </div>
                    <div class="input-group">
                        <label for="product_quantity">Quantité</label>
                        <input type="number" name="product_quantity" id="product_quantity" required value="${produit.product_quantity || ''}">
                    </div>
                    <div class="input-group">
                        <label for="product_buy_price">Prix d'achat</label>
                        <input type="number" name="product_buy_price" id="product_buy_price" step="0.01" required value="${produit.product_buy_price || ''}">
                    </div>
                    <div class="input-group">
                        <label for="unit">Unité</label>
                        <input type="text" name="unit" id="unit" required value="${produit.unit || ''}">
                    </div>
                    <div class="input-group" id="category">
                        <label for="category_id">Catégorie</label>
                        <select name="category_id" id="category_id" required>
                        ${this.category.map(category => {
                            return `
                                <option value="${category.id}" ${produit.id == category.id ? 'selected' : ''}>${category.name}</option>
                            `;
                        })}
                        </select>
                    </div>
                    <label>Produit chaud <input type="checkbox" id="is_hot" name="is_hot" ${produit.is_hot ? 'checked' : ''}></label>
                    <button type="submit" id="submit-produit" class="btn btn-${action === 'Ajouter' ? 'ajouter' : 'modifier'}">${action}</button>
                </form>
            </div>
        `;
    }    

    createEvents() {
        this.onClickOpenModal();
        this.updateEvents();
        
        this.research();
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
        document.getElementById("submit-produit").addEventListener('click', async (event) => {
            event.preventDefault();
            const form = document.getElementById("form-produit");
            if (!form.checkValidity()) return form.reportValidity();

            const articleId = form.getAttribute('data-id');

            const formData = new FormData(form);
            // const product_name = formData.get('product_name');
            // const product_price = parseFloat(formData.get('product_price'));
            // const product_quantity = parseInt(formData.get('product_quantity'));
            // const product_buy_price = parseFloat(formData.get('product_buy_price'));
            // const unit = formData.get('unit');
            // const is_hot = document.querySelector('#is_hot').checked;
            // const category_id = parseInt(formData.get('category_id'));

            this.modal.style.display = "none";

            if(articleId !== 'undefined') {
                const data = this.datas.find(data => data.id == articleId);
                formData.append('product_image', data.product_image);
                formData.append('is_active', data.is_active);
            }

            const url = articleId !== 'undefined' ? `http://api-corso-fleuri.local/articles/edit/${articleId}` : 'http://api-corso-fleuri.local/articles/add';
            const options = {
                method: 'POST',
                credentials: 'include',
                body: formData
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                // body: `product_name=${product_name}&&product_price=${product_price}&&product_quantity=${product_quantity}&&product_buy_price=${product_buy_price}&&unit=${unit}&&product_image=${product_image}&&is_hot=${is_hot}&&category_id=${category_id}`
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
                    this.content.insertAdjacentHTML('beforeend', await this.displayProduit([this.datas[this.datas.length - 1]]));
                    this.updateEvents(this.datas.length - 1);
                } else {
                    const dataProduit = this.datas.find(data => data.id == articleId);
                    dataProduit.id = data.id;
                    dataProduit.product_name = data.product_name;
                    dataProduit.product_price = data.product_price;
                    dataProduit.product_quantity = data.product_quantity;
                    dataProduit.product_buy_price = data.product_buy_price;
                    dataProduit.unit = data.unit;
                    dataProduit.product_image = data.product_image;
                    dataProduit.is_hot = data.is_hot;
                    dataProduit.is_active = data.is_active;
                    dataProduit.category_id = data.category_id;

                    eventTarget.outerHTML = await this.displayProduit([data]);
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
                    credentials: 'include',
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
            this.content.innerHTML = await this.displayProduit(result);
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

new Produit();