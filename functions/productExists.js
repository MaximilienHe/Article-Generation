const connectToDB = require('../db');
const mysql = require('mysql');


const productExists = async (productName) => {
  const db = connectToDB();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM devices WHERE title = ${mysql.escape(
      productName
    )} AND technical_sheet_written = 0;`;

    db.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0);
    });
    
  });
};

module.exports = productExists;
