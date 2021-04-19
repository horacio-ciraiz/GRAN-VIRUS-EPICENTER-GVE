const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta3", async (req, res) => {
    console.log("Metodo consulta3");
    await execQuery(`
    SELECT Victima.Nombre, Victima.Apellido, Direccion.Nombre AS Direccion,Victima.Fecha_Muerte FROM Victima
    INNER JOIN Direccion ON Victima.ID_Direccion = Direccion.ID_Direccion
    WHERE Fecha_Muerte is not null AND (SELECT count(ID_Asociado) FROM Conocio WHERE ID_Victima = Victima.ID_Victima) > 3;
    
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