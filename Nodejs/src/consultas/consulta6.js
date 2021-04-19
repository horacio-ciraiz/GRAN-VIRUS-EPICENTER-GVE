const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta6", async (req, res) => {
    console.log("Metodo consulta6");
    await execQuery(`
    SELECT DISTINCT Victima.Nombre, Victima.Apellido, Victima.Fecha_Muerte
    FROM Victima
    INNER JOIN Ubicacion ON  Victima.ID_Victima = Ubicacion.ID_Victima
    INNER JOIN Direccion ON Ubicacion.ID_Direccion = Direccion.ID_Direccion
    INNER JOIN Detalle_Tratamiento ON Victima.ID_Victima =  Detalle_Tratamiento.ID_Victima
    INNER JOIN Tratamiento ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
    WHERE Direccion.Nombre like '%1987 Delphine Well%' AND Tratamiento.Nombre like '%Manejo de la presion arterial%'
    AND Fecha_Muerte is not null;
    
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