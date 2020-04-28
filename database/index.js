const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'astrilalia',
    password: 'um7',
    database: 'moviesindoxxi',
    port: 3306
})

module.exports = db
