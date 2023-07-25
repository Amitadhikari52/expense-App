const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbService = require('./dbService');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = dbService.getDbServiceInstance();

// Create (Insert) a new expense
app.post('/insert', (request, response) => {
  const { amount, description, category } = request.body;

  const result = db.insertNewAmount(amount, description, category);

  result
    .then(data => response.json({ success: true, data: data }))
    .catch(err => console.log(err));
});

// Read (Get all expenses)
app.get('/getAll', (request, response) => {
  const result = db.getAllData();

  result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// Update an existing expense
app.put('/update/:id', (request, response) => {
  const { id } = request.params;
  const { amount, description, category } = request.body;

  const result = db.updateRowById(id, amount, description, category);

  result
    .then(data => response.json({ success: true, data: data }))
    .catch(err => console.log(err));
});

// Delete an expense
app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;

  const result = db.deleteRowById(id);

  result
    .then(data => response.json({ success: true, data: data }))
    .catch(err => console.log(err));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
