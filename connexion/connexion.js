document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#login-btn").addEventListener('click', async (e) => {
        const loginId = document.querySelector("#id").value
        const password = document.querySelector("#password").value

        console.log(loginId, password)

        fetch('http://api-corso-fleuri.local/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${loginId}&password=${password}`
        })
            .then(reponse => reponse.json())
            .then(data => {
                localStorage.setItem('role', data.body)
                if (data.code === 200) {
                    switch (data.body) {
                        case 'admin':
                            window.location = "http://corso-fleuri.local/vue_admin/create_menu.html"
                            break;
                        case 'caisse':
                            window.location = "http://corso-fleuri.local/borne/borne_panier.html"
                            break;
                    }
                }
            })
            .catch(error => console.error('Error', error))
    })
})