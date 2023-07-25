function loadHTMLTable(data) {
    const table = document.querySelector('#table tbody');
    table.innerHTML = '';

    if (data.length === 0) {
        table.innerHTML = '<tr><td class="no-data" colspan="5">No Data</td></tr>';
        return;
    }

    data.forEach(({ id, amount, description, category }) => {
        const newRow = table.insertRow(table.rows.length);

        const amountCell = newRow.insertCell(0);
        amountCell.innerHTML = amount;

        const descriptionCell = newRow.insertCell(1);
        descriptionCell.innerHTML = description;

        const categoryCell = newRow.insertCell(2);
        categoryCell.innerHTML = category;

        const deleteCell = newRow.insertCell(3);
        deleteCell.innerHTML = `<button onclick="deleteExpense(${id})">Delete</button>`;

        const editCell = newRow.insertCell(4);
        editCell.innerHTML = `<button onclick="editExpense(${id}, '${amount}', '${description}', '${category}')">Edit</button>`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

const addBtn = document.querySelector('#add-expense-btn');
addBtn.onclick = function () {
    const amount = document.querySelector('#amount').value;
    const description = document.querySelector('#description').value;
    const category = document.querySelector('#category').value;

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ amount: amount, description: description, category: category })
    })
        .then(response => response.json())
        .then(data => {
            insertRowIntoTable(data['data']);
        })
        .catch(error => console.error('Error:', error));
};

function insertRowIntoTable(data) {
    const table = document.querySelector('#table tbody');
    const newRow = table.insertRow(table.rows.length);

    const amountCell = newRow.insertCell(0);
    amountCell.innerHTML = data.amount;

    const descriptionCell = newRow.insertCell(1);
    descriptionCell.innerHTML = data.description;

    const categoryCell = newRow.insertCell(2);
    categoryCell.innerHTML = data.category;

    const deleteCell = newRow.insertCell(3);
    deleteCell.innerHTML = `<button onclick="deleteExpense(${data.id})">Delete</button>`;

    const editCell = newRow.insertCell(4);
    editCell.innerHTML = `<button onclick="editExpense(${data.id}, '${data.amount}', '${data.description}', '${data.category}')">Edit</button>`;
}

function deleteExpense(id) {
    fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:5000/getAll')
                    .then(response => response.json())
                    .then(data => loadHTMLTable(data['data']));
            }
        })
        .catch(error => console.error('Error:', error));
}

function editExpense(id, amount, description, category) {
    const table = document.querySelector('#table');
    if (table.rows.length === 0) return; // Return if the table is empty

    const editForm = document.createElement('form');
    editForm.innerHTML = `
      <label for="editAmount">Amount:</label>
      <input type="number" id="editAmount" value="${amount}" required />
      <label for="editDescription">Description:</label>
      <input type="text" id="editDescription" value="${description}" required />
      <label for="editCategory">Category:</label>
      <select id="editCategory">
        <option value="grocery" ${category === 'grocery' ? 'selected' : ''}>Grocery</option>
        <option value="fuel" ${category === 'fuel' ? 'selected' : ''}>Fuel</option>
        <option value="goods" ${category === 'goods' ? 'selected' : ''}>Goods</option>
        <option value="entertainment" ${category === 'entertainment' ? 'selected' : ''}>Entertainment</option>
        <option value="others" ${category === 'others' ? 'selected' : ''}>Others</option>
      </select>
      <br /><br />
      <button type="button" onclick="updateExpense(${id})">Save</button>
    `;

    const editRowIndex = Array.from(table.rows).findIndex(row => row.cells[0].innerHTML === amount && row.cells[1].innerHTML === description && row.cells[2].innerHTML === category);
    if (editRowIndex !== -1) {
        const editCell = table.rows[editRowIndex].cells[table.rows[editRowIndex].cells.length - 1];
        editCell.innerHTML = '';
        editCell.appendChild(editForm);
    }
}

function updateExpense(id) {
    const editAmount = document.querySelector('#editAmount').value;
    const editDescription = document.querySelector('#editDescription').value;
    const editCategory = document.querySelector('#editCategory').value;

    fetch(`http://localhost:5000/update/${id}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({ amount: editAmount, description: editDescription, category: editCategory })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:5000/getAll')
                    .then(response => response.json())
                    .then(data => loadHTMLTable(data['data']));
            }
        })
        .catch(error => console.error('Error:', error));
}
