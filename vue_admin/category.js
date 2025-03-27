document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const btnAjouter = document.getElementById('btn-ajouter');
    const spanClose = document.getElementsByClassName('close')[0];
    const validBtn = document.getElementById('validBtn');
    const categoryForm = document.getElementById('category-form');
    const table = document.querySelector('.table tbody');

    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');

    let categories = [];
    let categoryIdToDelete = null;

    async function fetchCategories() {
        try {
            const response = await fetch('http://api-corso-fleuri.local/category');
            categories = JSON.parse((await response.json()).body);
            console.log('Categories:', categories);
            updateCategoryTable();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

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

    validBtn.onclick = async function() {
        const name = categoryForm.name.value.trim();
        const color = categoryForm.color.value.trim().replace("#", '');
        console.log("??????????", color);
        // const color = categoryForm.color.value.trim();  avant


        console.log('Category name:', name);
        console.log('Category color:', color);

        if (name !== '' && color !== '') {
            try {
                const response = await fetch(`http://api-corso-fleuri.local/category/add/${name}/${color}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    categories.push({ name, color: `#${color}` });
                    updateCategoryTable();
                    categoryForm.reset();
                    modal.style.display = 'none';
                } else {
                    console.error('Failed to add category:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding category:', error);
            }
        } else {
            console.error('Category name or color is empty');
        }
    }

    function updateCategoryTable() {
        const rows = categories.map((category, index) => `
            <tr>
                <td>${category.name}</td>
                <td><div class="color-square" style="background-color: ${category.color};"></div>${category.color}</td>
                <td>
                    <button class="btn btn-danger" onclick="showDeleteConfirm(${index}, ${category.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
        
        table.innerHTML = rows;
    }

    window.showDeleteConfirm = function(index, id) {
        confirmModal.style.display = 'block';
        categoryIdToDelete = id;
        confirmDeleteBtn.onclick = async function() {
            try {
                const response = await fetch(`http://corso-fleuri.local/category/delete/${categoryIdToDelete}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    categories.splice(index, 1);
                    updateCategoryTable();
                    confirmModal.style.display = 'none';
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
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

    fetchCategories();
});