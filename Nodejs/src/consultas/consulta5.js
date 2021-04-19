const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta5", async (req, res) => {
    console.log("Metodo consulta5");
    await execQuery(`
    SELECT DISTINCT Victima.Nombre, Victima.Apellido,(SELECT count(Detalle_Tratamiento.ID_Tratamiento) FROM Detalle_Tratamiento 
INNER JOIN Tratamiento ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
WHERE Tratamiento.Nombre like '%Oxigeno%' AND Detalle_Tratamiento.ID_Victima = Victima.ID_Victima) AS Cantidad FROM Victima
INNER JOIN Detalle_Tratamiento ON Victima.ID_Victima =  Detalle_Tratamiento.ID_Victima
INNER JOIN Tratamiento ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
ORDER BY Cantidad DESC LIMIT 5;
    
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