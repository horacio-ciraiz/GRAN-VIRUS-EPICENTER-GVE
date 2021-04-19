const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta7", async (req, res) => {
    console.log("Metodo consulta7");
    await execQuery(`
    SELECT Victima.Nombre, Victima.Apellido, Direccion.Nombre AS Direccion FROM Conocio
INNER JOIN Victima ON Conocio.ID_Victima = Victima.ID_Victima
INNER JOIN Direccion ON Victima.ID_Direccion = Direccion.ID_Direccion
INNER JOIN Asociado ON Conocio.ID_Asociado = Asociado.ID_Asociado
WHERE Asociado.Nombre = Victima.Nombre AND Asociado.Apellido = Victima.Apellido
AND Victima.ID_Hospital IS NOT NULL 
AND (SELECT count(ID_Conocio) FROM Conocio WHERE ID_Victima = Victima.ID_Victima) < 2
AND (SELECT count(ID_Tratamiento) Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) = 2;
    
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