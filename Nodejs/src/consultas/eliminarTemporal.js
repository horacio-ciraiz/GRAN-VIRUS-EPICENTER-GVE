const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/eliminarTemporal", async (req, res) => {
    console.log("Metodo eliminarTemporal");
    await execQuery(`DROP TABLE IF EXISTS Tabla_Temporal;`)
    
        .then(serRes => res.json(serRes))
        .catch(e => {
            return res.status(400).json({
                ok: false,
                err: e
            })
        })
    

})


module.exports = app;