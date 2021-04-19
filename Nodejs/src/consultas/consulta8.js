const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta8", async (req, res) => {
    console.log("Metodo consulta8");
    await execQuery(`
    (SELECT Nombre, Apellido, (SELECT count(ID_DetalleTratamiento)
    FROM Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) AS Cantidad,MONTH(Victima.Fecha_Registro) as Numero_Mes FROM Victima
    ORDER BY Cantidad DESC LIMIT 5)
    UNION 
    (SELECT Nombre, Apellido, (SELECT count(ID_DetalleTratamiento) 
    FROM Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) AS Cantidad ,MONTH(Victima.Fecha_Registro) as Numero_Mes FROM Victima
    ORDER BY Cantidad ASC LIMIT 5);
    
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