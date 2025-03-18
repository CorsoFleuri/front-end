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
                            <button class="btn">Modifier</button>
                            <button class="btn btn-danger">Supprimer</button>
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
        const btn = document.getElementById("btn-ajouter");
        const span = document.getElementsByClassName("close")[0];

        btn.onclick = function() {
            modal.style.display = "block";
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const buttonSubmit = document.querySelector('.btn222222');

        buttonSubmit.addEventListener('click', event => {
            event.preventDefault();
            const form = document.querySelector('#user-form');
            const formData = new FormData(form);
            const check = document.querySelector('#is_admin');

            fetch('http://api-corso-fleuri.local/users/add', {
                method: 'POST',
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
        })
       
    }
}

PasswordToggle.fetchUserData = function() {
    simulateFetchUserData()
        .then(data => {
            const table = document.querySelector('.table');
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
                        <button class="btn">Modifier</button>
                        <button class="btn btn-danger">Supprimer</button>
                    </td>
                `;
                table.appendChild(row);
            });
            PasswordToggle.initialize();
        })
        .catch(error => console.error('Error fetching user data:', error));
};

PasswordToggle.fetchUserData();