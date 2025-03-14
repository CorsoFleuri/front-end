function showOptions(category) {
    const optionsTitle = document.getElementById('options-title');
    const optionsList = document.getElementById('options-list');
    optionsTitle.textContent = `Choisissez un ${category}`;
    let optionsHtml = '';

    if (category === 'Dessert') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Dessert 1', 'dessert-list')">Dessert 1</button></li>
            <li><button class="option-button" onclick="addItem('Dessert 2', 'dessert-list')">Dessert 2</button></li>
            <li><button class="option-button" onclick="addItem('Dessert 3', 'dessert-list')">Dessert 3</button></li>
        `;
    } else if (category === 'Plat') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Plat 1', 'plat-list')">Plat 1</button></li>
            <li><button class="option-button" onclick="addItem('Plat 2', 'plat-list')">Plat 2</button></li>
            <li><button class="option-button" onclick="addItem('Plat 3', 'plat-list')">Plat 3</button></li>
        `;
    } else if (category === 'Frite') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Frite 1', 'frite-list')">Frite 1</button></li>
            <li><button class="option-button" onclick="addItem('Frite 2', 'frite-list')">Frite 2</button></li>
        `;
    } else if (category === 'Soft') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Soft 1', 'soft-list')">Soft 1</button></li>
            <li><button class="option-button" onclick="addItem('Soft 2', 'soft-list')">Soft 2</button></li>
        `;
    } else if (category === 'Boisson') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Boisson 1', 'boisson-list')">Boisson 1</button></li>
            <li><button class="option-button" onclick="addItem('Boisson 2', 'boisson-list')">Boisson 2</button></li>
        `;
    } else if (category === 'Salade') {
        optionsHtml += `
            <li><button class="option-button" onclick="addItem('Salade 1', 'salade-list')">Salade 1</button></li>
            <li><button class="option-button" onclick="addItem('Salade 2', 'salade-list')">Salade 2</button></li>
        `;
    }

    optionsList.innerHTML = optionsHtml;
}

function addItem(item, listId) {
    const list = document.getElementById(listId);
    if (!list) {
        const newList = document.createElement('ul');
        newList.id = listId;
        document.getElementById('selected-items-list').appendChild(newList);
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `${item} <button class="remove-button" onclick="removeItem(this)">Supprimer</button>`;
    document.getElementById(listId).appendChild(listItem);

    // Clear the options section
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    const optionsTitle = document.getElementById('options-title');
    optionsTitle.textContent = '';
}

function removeItem(button) {
    const listItem = button.parentElement;
    listItem.remove();
}