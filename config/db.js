// /config/db.js
const mysql = require("mysql");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb1'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

module.exports = db;
