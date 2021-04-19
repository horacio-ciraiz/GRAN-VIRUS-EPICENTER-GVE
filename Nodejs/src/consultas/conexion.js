const mysql = require('mysql')

const db = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 150,
    host: 'localhost',
    user: 'root',
    password: 'Seefland',
    database: 'Practica1'
})

/**
 * Ejecuta un 
 * @param {string} str 
 */
const execQuery = (str) => {
    return new Promise((resolve, reject) => {
        db.query(str, (err, res) => {
            if (err){
                reject(err)
            }
            resolve(res)
        })
    })
}

module.exports = execQuery;