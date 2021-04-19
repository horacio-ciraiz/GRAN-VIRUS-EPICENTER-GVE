const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta1", async (req, res) => {
    console.log("Metodo consulta1");
    await execQuery(`
    SELECT DISTINCT Hospital.Nombre as Nombre_Hospital, Direccion.Nombre Direccion_Hospital, 
    (SELECT count(Fecha_Muerte) FROM Victima WHERE Hospital.ID_Hospital = Victima.ID_Hospital) AS Muertos 
    FROM Hospital
    INNER JOIN Direccion ON Hospital.ID_Direccion = Direccion.ID_Direccion
    INNER JOIN Victima ON Hospital.ID_Hospital = Victima.ID_Hospital
    ORDER BY Hospital.Nombre;
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