const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PW,
    database: process.env.DB_DATABASE,
})

db.connect(function(err){
    if(err) throw err;
    console.log("DATABASE CONNECT!")
});

module.exports = db;


