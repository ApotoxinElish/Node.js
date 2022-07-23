const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 50,
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "compwordle",
});

module.exports = db;
