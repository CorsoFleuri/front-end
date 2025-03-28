function openModal(modalId) {
    if (modalId === 'ticket-edit') {

        document.getElementById('ticketModal').style.display = 'flex';

        document.querySelector('#titre-ticket').value = document.getElementById('ticket-title').textContent
        document.querySelector('#sous-titre-ticket').value = document.getElementById('ticket-sub-title').textContent
        document.querySelector('#pied-page-ticket').value = document.getElementById('ticket-footer').textContent
    } else if (modalId === 'ticket') {

        document.getElementById('myModal').style.display = 'flex'
        document.getElementById('modal-body').innerHTML = '<textarea id="ticketTemplate"></textarea>' +
            '<button type="button" id="saveTicket" onclick="saveTicket()">Sauvgarder le Ticket</button>'

        document.querySelector('#ticketTemplate').value = document.getElementById('ticket').textContent
    } else if (modalId === 'color') {

        document.getElementById('myModal').style.display = 'flex'
        document.getElementById('primaryColor').value = document.querySelector('#color-box').textContent
        document.getElementById('secondaryColor').value = document.querySelector('#color-box-secondary').textContent
    } else if (modalId === 'logo') {

        document.getElementById('myModal').style.display = 'flex'
        document.getElementById('modal-body').innerHTML = '<label for="">Logo</label>' +
            '<input type="file" id="imageInput">' +
            '<button type="button" id="saveImage" onclick="saveChangesImage()">Sauvgarder l images</button>'
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveChangesColor() {
    const newTitle = document.getElementById('titre-ticket').value;
    const newSubtitle = document.getElementById('sous-titre-ticket').value;
    const newFooter = document.getElementById('pied-page-ticket').value;

    fetch(`http://api-corso-fleuri.local/app/edit/ticket-value/${newTitle}/${newSubtitle}/${newFooter}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(reponse => reponse.json())
        .then(data => {

        })
        .catch(error => console.error(error))

    document.getElementById('current-titre').getElementsByTagName('span')[0].innerText = newTitle;
    document.getElementById('current-sous-titre').getElementsByTagName('span')[0].innerText = newSubtitle;
    document.getElementById('current-pied-page').getElementsByTagName('span')[0].innerText = newFooter;

    closeModal('ticketModal');
    setValue()
}

function saveChangesImage() {
    const formData = new FormData
    formData.append('image',document.querySelector('#imageInput').files[0]);

    fetch('http://api-corso-fleuri.local/app/edit/logo', {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
        .then(reponse => reponse.json())
        .then(data => {

        })
        .catch(error => console.error(error))

    closeModal('myModal')
    setValue()
}
function saveColor() {
    const primaryColor = document.querySelector('#primaryColor').value.replace('#', '');
    const secondaryColor = document.querySelector('#secondaryColor').value.replace('#', '');

    fetch(`http://api-corso-fleuri.local/app/edit/colors/${primaryColor}/${secondaryColor}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(reponse => reponse.json())
        .then(data => {
            document.querySelector('#color-box').textContent = `#${primaryColor}`;
            document.querySelector('#color-box-secondary').textContent = `#${secondaryColor}`;

            document.querySelector(':root').style.setProperty('--principal', `#${primaryColor}`);
            document.querySelector(':root').style.setProperty('--secondaire', `#${secondaryColor}`);
        })
        .catch(error => console.error(error));

    closeModal('myModal');
}
function saveTicket() {
    fetch('http://api-corso-fleuri.local/app/edit/ticket', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ticket=${document.querySelector('#ticketTemplate').value}`
    })
        .then(reponse => reponse.json())
        .then(data => {

        })
        .catch(error => console.error(error))

    closeModal('myModal')
    setValue()
}
function setValue() {
    fetch('http://api-corso-fleuri.local/app', {
        method: 'GET',
        credentials: 'include',
    })
        .then(reponse => reponse.json())
        .then(data => {
            const parseData = JSON.parse(data.body)
            document.querySelector(':root').style.setProperty('--principal', parseData.primary_color)
            document.querySelector(':root').style.setProperty('--secondaire', parseData.secondary_color)
            document.querySelector('#color-box').innerText = parseData.primary_color
            document.querySelector('#color-box-secondary').innerText = parseData.secondary_color
            document.querySelector('#ticket-title').innerText = parseData.title
            document.querySelector('#ticket-sub-title').innerText = parseData.sub_title
            document.querySelector('#ticket-footer').innerText = parseData.footer
        })
        .catch(error => console.error(error))
}

document.addEventListener('DOMContentLoaded', () => {
    setValue()
})