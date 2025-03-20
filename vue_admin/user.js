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
                table.innerHTML = `
                    <tr>
                        <th>Nom</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                `; 
                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>
                            <div class="password-container">
                                <input type="password" value="${user.password}" readonly>
                                <i class="fas fa-eye"></i>
                            </div>
                        </td>
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
        document.querySelectorAll('.password-container i').forEach(icon => {
            new PasswordToggle(icon);
        });

        const modal = document.getElementById("modal");
        const confirmModal = document.getElementById("confirm-modal");
        const btn = document.getElementById("btn-ajouter");
        const span = document.getElementsByClassName("close");

        btn.onclick = function() {
            document.querySelector('.modal h2').textContent = "Ajouter un Utilisateur";
            document.getElementById('user-form').removeAttribute('data-id');
            modal.style.display = "block";
        }

        Array.from(span).forEach(element => {
            element.onclick = function() {
                element.closest('.modal').style.display = "none";
            }
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            } else if (event.target == confirmModal) {
                confirmModal.style.display = "none";
            }
        }

        document.querySelector('.table').addEventListener('click', (event) => {
            if (event.target.classList.contains('modifier-btn')) {
                const userId = event.target.getAttribute('data-id');
                fetch(`http://api-corso-fleuri.local/users/${userId}`)
                    .then(response => response.json())
                    .then(user => {
                        document.getElementById('name').value = user.name;
                        document.getElementById('password').value = user.password;
                        document.getElementById('is_admin').checked = user.is_admin;
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
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        confirmModal.style.display = "none";
                        PasswordToggle.fetchUserData(); 
                    })
                    .catch(error => console.error('Error:', error));
                }
                document.getElementById('cancel-delete').onclick = function() {
                    confirmModal.style.display = "none";
                }
            }
        });

        const buttonSubmit = document.querySelector('.btn222222');

        buttonSubmit.addEventListener('click', event => {
            event.preventDefault();
            const form = document.querySelector('#user-form');
            const formData = new FormData(form);
            const userId = form.getAttribute('data-id');
            const check = document.querySelector('#is_admin');

            const method = userId ? 'PUT' : 'POST';
            const url = userId ? `http://api-corso-fleuri.local/users/edit/${userId}` : 'http://api-corso-fleuri.local/users/add';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `name=${formData.get('name')}&password=${formData.get('password')}&is_admin=${check.checked}`
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                modal.style.display = "none";
                PasswordToggle.fetchUserData(); 
            })
            .catch(error => console.error('Error:', error));
        });
    }
}

const exampleData = [
    { id: 1, name: "Jean Dupont", password: "password123", is_admin: false },
    { id: 2, name: "Marie Curie", password: "password456", is_admin: true },
    { id: 3, name: "Albert Einstein", password: "password789", is_admin: false },
    { id: 4, name: "Isaac Newton", password: "gravity123", is_admin: true },
    { id: 5, name: "Niels Bohr", password: "quantum456", is_admin: false }
];

function simulateFetchUserData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(exampleData);
        }, 1000);
    });
}

PasswordToggle.fetchUserData = function() {
    simulateFetchUserData()
        .then(data => {
            const table = document.querySelector('.table');
            table.innerHTML = `
                <tr>
                    <th>Nom</th>
                    <th>Password</th>
                    <th>Actions</th>
                </tr>
            `; 
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>
                        <div class="password-container">
                            <input type="password" value="${user.password}" readonly>
                            <i class="fas fa-eye"></i>
                        </div>
                    </td>
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
};

PasswordToggle.fetchUserData();