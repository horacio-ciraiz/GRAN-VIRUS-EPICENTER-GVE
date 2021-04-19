const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta9", async (req, res) => {
    console.log("Metodo consulta9");
    await execQuery(`
    SELECT Hospital.Nombre,
((SELECT count(ID_Victima) FROM Victima WHERE ID_Hospital = Hospital.ID_Hospital) / (SELECT count(ID_Victima) FROM Victima WHERE ID_Hospital IS NOT NULL) ) * 100 AS Porcentaje
FROM Hospital
INNER JOIN Victima ON Hospital.ID_Hospital = Victima.ID_Victima;
    `)
        .then(serRes => res.json(serRes))
        .catch(e => {
            return res.status(400).json({
                ok: false,
                err: e
            })
        })
    

})


module.exports = app;