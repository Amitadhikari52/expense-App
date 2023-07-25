const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  // console.log('db' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products';

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewAmount(amount, description, category) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO products (amount, description, category) VALUES (?, ?, ?)';

        connection.query(query, [amount, description, category], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return insertId;
    } catch (error) {
      console.log(error);
    }
  }

  async updateRowById(id, amount, description, category) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'UPDATE products SET amount=?, description=?, category=? WHERE id=?';

        connection.query(query, [amount, description, category, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows > 0);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowById(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'DELETE FROM products WHERE id=?';

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows > 0);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
