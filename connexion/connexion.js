document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#login-btn").addEventListener('click', async (e) => {
        const loginId = document.querySelector("#id").value
        const password = document.querySelector("#password").value

        fetch('http://api-corso-fleuri.local/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${loginId}&password=${password}`
        })
            .then(reponse => {
                const result = reponse.json()
                if (reponse.status === 200) {
                    switch (result.body) {
                        case 'admin':
                            window.location = "http://corso-fleuri.local"
                            break;
                        case 'caisse':
                            window.location = "http://corso-fleuri.local"
                            break;
                        case 'borne':
                            window.location = "http://corso-fleuri.local"
                            break;
                    }
                }
            })
            .then()
            .catch(error => console.error('Error', error))
    })
})