const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/eliminarModelo", async (req, res) => {
    console.log("Metodo eliminarModelo");
    await execQuery(`DROP TABLE IF EXISTS Direccion,Estado,TipoContacto,Hospital,Conocio,Victima,Asociado,Contacto,Tratamiento,Detalle_Tratamiento,Ubicacion;`)
    
        .then(serRes => res.json(serRes))
        .catch(e => {
            return res.status(400).json({
                ok: false,
                err: e
            })
        })
    
})


module.exports = app;