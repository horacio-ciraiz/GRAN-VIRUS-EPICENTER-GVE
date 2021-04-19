const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta4", async (req, res) => {
    console.log("Metodo consulta4");
    await execQuery(`
    SELECT DISTINCT Victima.Nombre, Victima.Apellido from Victima
    INNER JOIN Estado ON Victima.ID_Estado = Estado.ID_Estado
    INNER JOIN Contacto ON Victima.ID_Victima = Contacto.ID_Victima
    INNER JOIN TipoContacto ON Contacto.ID_TipoContacto = TipoContacto.ID_TipoContacto
    WHERE TipoContacto.Nombre like '%Beso%' and (SELECT count(ID_Asociado) FROM Conocio WHERE ID_Victima = Victima.ID_Victima) > 2
    AND Estado.Nombre like '%Sospecha%';
    
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