document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#login-btn").addEventListener('click', async (e) => {
        const loginId = document.querySelector("#id").value
        const password = document.querySelector("#password").value

        fetch('http://api-corso-fleuri.local/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${loginId}&password=${password}`
        })
        .then(response => response.json())
        .then(results => {
            // results = JSON.parse(results.body);
            switch (results.body) {
                case 'admin':
                    window.location = "http://corso-fleuri.local/vue_admin/produit.html"
                    break;
                case 'caisse':
                    window.location = "http://corso-fleuri.local"
                    break;
                case 'borne':
                    window.location = "http://corso-fleuri.local"
                    break;
            }
        })
        .catch(error => console.error("Erreur:", error));
    })
})