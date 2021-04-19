const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta2", async (req, res) => {
    console.log("metodo consulta2");
    await execQuery(`
    SELECT DISTINCT Victima.Nombre, Victima.Apellido FROM Victima
    INNER JOIN Detalle_Tratamiento ON Victima.ID_Victima = Detalle_Tratamiento.ID_Victima
    INNER JOIN Estado ON Victima.ID_Estado = Estado.ID_Estado
    INNER JOIN Tratamiento ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
    WHERE Estado.Nombre like '%Cuarentena%' AND Detalle_Tratamiento.Efectividad_Victima > 5 AND Tratamiento.Nombre like '%Transfusiones de sangre%';

    
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