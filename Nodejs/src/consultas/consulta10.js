const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/consulta10", async (req, res) => {
    console.log("Metodo consulta10");
    await execQuery(`
    SELECT DISTINCT Nombre,Contacto,Cantidad,Porcentaje From (
        SELECT Hospital.Nombre as Nombre , tc.Nombre AS Contacto, COUNT(*) As Cantidad,
            
                    (COUNT(*) / (SELECT COUNT(*) FROM Hospital h
                        INNER JOIN Victima v on h.ID_Hospital = v.ID_Hospital 
                        INNER JOIN Contacto c on v.ID_Victima =c.ID_Victima 
                        INNER JOIN TipoContacto tc on c.ID_TipoContacto = tc.ID_TipoContacto 
                                )* 100
                
                ) as Porcentaje
    
    from Hospital  
    INNER JOIN Victima v on Hospital.ID_Hospital = v.ID_Hospital 
    INNER JOIN Contacto c on v.ID_Victima = c.ID_Victima 
    INNER JOIN TipoContacto tc on c.ID_TipoContacto = tc.ID_TipoContacto 
    GROUP BY Hospital.ID_Hospital , tc.Nombre
    ORDER BY Cantidad DESC 
    ) As Victimas
    GROUP BY Nombre;
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