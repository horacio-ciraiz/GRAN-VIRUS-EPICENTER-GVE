const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/cargarTemporal", async (req, res) => {
    console.log("Metodo cargarTemporal");
    await execQuery(`DROP TABLE IF EXISTS Tabla_Temporal;

    CREATE TABLE IF NOT EXISTS Tabla_Temporal(
        ID_DATOS INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        NOMBRE_VICTIMA VARCHAR(100),
        APELLIDO_VICTIMA VARCHAR(100),
        DIRECCION_VICTIMA VARCHAR(100),
        FECHA_PRIMERA_SOSPECHA VARCHAR(100),
        FECHA_CONFIRMACION VARCHAR(100),
        FECHA_MUERTE VARCHAR(100),
        ESTADO_VICTIMA VARCHAR(100),
        NOMBRE_ASOCIADO VARCHAR(100),
        APELLIDO_ASOCIADO VARCHAR(100),
        FECHA_CONOCIO VARCHAR(100),
        CONTACTO_FISICO VARCHAR(100),
        FECHA_INICIO_CONTACTO VARCHAR(100),
        FECHA_FIN_CONTACTO VARCHAR(100),
        NOMBRE_HOSPITAL VARCHAR(100),
        DIRECCION_HOSPITAL VARCHAR(100),
        UBICACION_VICTIMA VARCHAR(100),
        FECHA_LLEGADA VARCHAR(100),
        FECHA_RETIRO VARCHAR(100),
        TRATAMIENTO VARCHAR(100),
        EFECTIVIDAD VARCHAR(100),
        FECHA_INICIO_TRATAMIENTO VARCHAR(100),
        FECHA_FIN_TRATAMIENTO VARCHAR(100),
        EFECTIVIDAD_EN_VICTIMA VARCHAR(100)
    );
    
    LOAD DATA 
    INFILE '/var/lib/mysql-files/GRAND_VIRUS_EPICENTER.csv' INTO TABLE Tabla_Temporal
    FIELDS TERMINATED BY ';'
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES
    (
    NOMBRE_VICTIMA,
    APELLIDO_VICTIMA,
    DIRECCION_VICTIMA,
    FECHA_PRIMERA_SOSPECHA,
    FECHA_CONFIRMACION,
    FECHA_MUERTE,
    ESTADO_VICTIMA,
    NOMBRE_ASOCIADO,
    APELLIDO_ASOCIADO,
    FECHA_CONOCIO,
    CONTACTO_FISICO,
    FECHA_INICIO_CONTACTO,
    FECHA_FIN_CONTACTO,
    NOMBRE_HOSPITAL,
    DIRECCION_HOSPITAL,
    UBICACION_VICTIMA,
    FECHA_LLEGADA,
    FECHA_RETIRO,
    TRATAMIENTO,
    EFECTIVIDAD,
    FECHA_INICIO_TRATAMIENTO,
    FECHA_FIN_TRATAMIENTO,
    EFECTIVIDAD_EN_VICTIMA);
    
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