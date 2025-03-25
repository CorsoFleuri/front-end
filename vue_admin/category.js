document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const btnAjouter = document.getElementById('btn-ajouter');
  const spanClose = document.getElementsByClassName('close')[0];
  const validBtn = document.getElementById('validBtn');
  const categoryForm = document.getElementById('category-form');
  const table = document.querySelector('.table');

  const confirmModal = document.getElementById('confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');

  let categories = [];

  btnAjouter.onclick = function() {
      modal.style.display = 'block';
  }

  spanClose.onclick = function() {
      modal.style.display = 'none';
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }

  validBtn.onclick = function() {
      const name = categoryForm.name.value.trim();
      
      if(name !== '') {
          categories.push(name);
          updateCategoryTable();
          categoryForm.reset();
          modal.style.display = 'none';
      }
  }

  function updateCategoryTable() {
      const rows = categories.map((category, index) => `
          <tr>
              <td>${category}</td>
              <td>
                  <button class="btn btn-danger" onclick="showDeleteConfirm(${index})">Supprimer</button>
              </td>
          </tr>
      `).join('');
      
      table.querySelector('tbody').innerHTML = rows;
  }

  window.showDeleteConfirm = function(index) {
      confirmModal.style.display = 'block';
      confirmDeleteBtn.onclick = function() {
          categories.splice(index, 1);
          updateCategoryTable();
          confirmModal.style.display = 'none';
      }
  }

  cancelDeleteBtn.onclick = function() {
      confirmModal.style.display = 'none';
  }

  window.onclick = function(event) {
      if (event.target == confirmModal) {
          confirmModal.style.display = 'none';
      }
  }
});