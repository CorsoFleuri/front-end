class ModalProduit {
    constructor() {
        this.modal = document.createElement("div");
        this.modal.id = "modal-produit";
        this.modal.classList.add("modal");
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Ajouter un produit</h2>
                <form id="form-produit">
                    <input type="text" name="product_name" placeholder="Nom du produit" required>
                    <input type="number" name="product_price" placeholder="Prix" required>
                    <input type="number" name="product_quantity" placeholder="Quantité" required>
                    <input type="number" name="product_buy_price" placeholder="Prix d'achat" required>
                    <input type="text" name="unit" placeholder="Unité" required>
                    <input type="text" name="product_image" placeholder="URL de l'image" required>
                    <input type="text" name="importances" placeholder="Importance" required>
                    <label>
                        <input type="checkbox" name="is_hot"> Produit chaud
                    </label>
                    <label>
                        <input type="checkbox" name="is_active"> Actif
                    </label>
                    <input type="number" name="category_id" placeholder="ID de la catégorie" required>
                    <button type="submit">Ajouter</button>
                </form>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.btnAjouter = document.querySelector(".btn-ajouter");
        this.spanClose = this.modal.querySelector(".close");
        this.formProduit = document.getElementById("form-produit");
        this.initEvents();
    }

    initEvents() {
        this.btnAjouter.addEventListener("click", () => this.openModal());
        this.spanClose.addEventListener("click", () => this.closeModal());
        window.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
        this.formProduit.addEventListener("submit", (event) => this.submitForm(event));
    }

    openModal() {
        this.modal.style.display = "block";
    }

    closeModal() {
        this.modal.style.display = "none";
    }

    submitForm(event) {
        event.preventDefault();
        const formData = new FormData(this.formProduit);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        fetch("http://api-corso-fleuri.local/articles/add", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString()
        })
        .then(response => response.json())
        .then(result => {
            console.log("Succès:", result);
            this.closeModal();
            this.formProduit.reset();
        })
        .catch(error => console.error("Erreur:", error));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ModalProduit();
});
