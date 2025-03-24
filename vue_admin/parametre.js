function openModal(modalId) {
  if (modalId === 'ticket-edit') {
    document.getElementById('ticketModal').style.display = 'block';
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function saveChanges() {
  const newTitle = document.getElementById('titre-ticket').value;
  const newSubtitle = document.getElementById('sous-titre-ticket').value;
  const newFooter = document.getElementById('pied-page-ticket').value;

  document.getElementById('current-titre').getElementsByTagName('span')[0].innerText = newTitle;
  document.getElementById('current-sous-titre').getElementsByTagName('span')[0].innerText = newSubtitle;
  document.getElementById('current-pied-page').getElementsByTagName('span')[0].innerText = newFooter;

  closeModal('ticketModal');
}