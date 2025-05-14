class PasswordToggle {
    constructor(element) {
        this.element = element;
        this.input = element.previousElementSibling;
        this.element.addEventListener('click', () => this.togglePassword());
    }

    togglePassword() {
        if (this.input.type === "password") {
            this.input.type = "text";
            this.element.classList.remove("fa-eye");
            this.element.classList.add("fa-eye-slash");
        } else {
            this.input.type = "password";
            this.element.classList.remove("fa-eye-slash");
            this.element.classList.add("fa-eye");
        }
    }

    static fetchUserData() {
        fetch('http://api-corso-fleuri.local/users')
            .then(response => response.json())
            .then(data => {
                const table = document.querySelector('.table');
                // Reconstruire l'en-tête du tableau sans la colonne "Password"
                table.innerHTML = `
                    <tr>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                `;
                JSON.parse(data.body).forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>
                            <button class="btn modifier-btn" data-id="${user.id}">Modifier</button>
                            <button class="btn btn-danger supprimer-btn" data-id="${user.id}">Supprimer</button>
                        </td>
                    `;
                    table.appendChild(row);
                });
                PasswordToggle.initialize();
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    static initialize() {
        // Initialiser les toggles de mot de passe s'ils existent (ils ne devraient pas être dans le tableau)
        document.querySelectorAll('.password-container i').forEach(icon => {
            new PasswordToggle(icon);
        });

        const modal = document.getElementById("modal");
        const confirmModal = document.getElementById("confirm-modal");
        const btn = document.getElementById("btn-ajouter");
        const span = document.getElementsByClassName("close");

        // Lorsqu'on clique sur "Ajouter un utilisateur"
        btn.onclick = function() {
            document.querySelector('.modal h2').textContent = "Ajouter un Utilisateur";
            document.getElementById('user-form').removeAttribute('data-id');
            // Pour l'ajout, on affiche le champ password et on le vide
            document.querySelector('label[for="password"]').style.display = "block";
            document.getElementById('password').style.display = "block";
            document.getElementById('password').value = "";
            modal.style.display = "block";
        };

        Array.from(span).forEach(element => {
            element.onclick = function() {
                element.closest('.modal').style.display = "none";
            };
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            } else if (event.target == confirmModal) {
                confirmModal.style.display = "none";
            }
        };

        document.querySelector('.table').addEventListener('click', (event) => {
            if (event.target.classList.contains('modifier-btn')) {
                const userId = event.target.getAttribute('data-id');
                fetch(`http://api-corso-fleuri.local/users/${userId}`)
                    .then(response => response.json())
                    .then(user => {
                        const userData = JSON.parse(user.body);
                        // Remplir le champ "Nom" avec le nom actuel
                        document.getElementById('name').value = userData.name;
                        // Stocker le mot de passe actuel dans une variable globale (pour l'utiliser si l'utilisateur ne le modifie pas)
                        window.currentPassword = userData.password;
                        // Laisser le champ "Mot de passe" vide
                        document.getElementById('password').value = "";
                        // Afficher le champ et son label pour qu'un nouveau mot de passe puisse être renseigné si désiré
                        document.querySelector('label[for="password"]').style.display = "block";
                        document.getElementById('password').style.display = "block";
                        // Remplir le champ "Administrateur"
                        document.getElementById('is_admin').checked = userData.is_admin;
                        document.getElementById('user-form').setAttribute('data-id', userId);
                        document.querySelector('.modal h2').textContent = "Modifier un Utilisateur";
                        modal.style.display = "block";
                    })
                    .catch(error => console.error('Error fetching user data:', error));
            }

            if (event.target.classList.contains('supprimer-btn')) {
                const userId = event.target.getAttribute('data-id');
                confirmModal.style.display = "block";
                document.getElementById('confirm-delete').onclick = function() {
                    fetch(`http://api-corso-fleuri.local/users/delete/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        confirmModal.style.display = "none";
                        PasswordToggle.fetchUserData(); 
                    })
                    .catch(error => console.error('Error:', error));
                };
                document.getElementById('cancel-delete').onclick = function() {
                    confirmModal.style.display = "none";
                };
            }
        });

        document.querySelector('#validBtn').addEventListener('click', event => {
            event.preventDefault();
            const form = document.querySelector('#user-form');
            const formData = new FormData(form);
            const userId = form.getAttribute('data-id');
            const check = document.querySelector('#is_admin');

            let params = new URLSearchParams();
            params.set('name', formData.get('name'));
            // Si le champ password n'est pas vide, on utilise la nouvelle saisie,
            // sinon on envoie le mot de passe stocké (pour conserver l'ancien)
            if (formData.get('password').trim() !== "") {
                console.log("Nouveau mot de passe saisi :", formData.get('password')); // Pour débogage
                params.set('password', formData.get('password'));
            // } else if (window.currentPassword) {
            //     console.log("Ancien mot de passe utilisé :", window.currentPassword); // Pour débogage
            //     params.set('password', window.currentPassword);
            // }
            } else {
                console.log("Aautre"); // Pour débogage
                params.set('password', false);
            }
            params.set('is_admin', check.checked);

            const method = 'POST';
            const url = userId ? `http://api-corso-fleuri.local/users/edit/${userId}` : 'http://api-corso-fleuri.local/users/add';

            console.log("Envoi des paramètres :", params.toString()); // Pour débogage

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                modal.style.display = "none";
                // PasswordToggle.fetchUserData();
            })
            .catch(error => console.error('Error:', error));
        });
    }
}

PasswordToggle.fetchUserData();
