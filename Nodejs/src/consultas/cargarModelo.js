const express = require('express')
const execQuery = require('./conexion')
let app = express();

app.get("/cargarModelo", async (req, res) => {
    console.log("Metodo cargarModelo");
    await execQuery(`DROP TABLE IF EXISTS Direccion,Estado,Hospital,Victima,Asociado,Conocido,TipoContacto,Contacto,Tratamiento,Detalle_Tratamiento,Ubicacion;

    CREATE TABLE IF NOT EXISTS Direccion( 
        ID_Direccion INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID_Direccion)
    ); 
    
    CREATE TABLE IF NOT EXISTS Estado( 
        ID_Estado INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID_Estado)
    ); 
    
    CREATE TABLE IF NOT EXISTS Hospital( 
        ID_Hospital INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        ID_Direccion INT NOT NULL,
        PRIMARY KEY (ID_Hospital),
        FOREIGN KEY (ID_Direccion) REFERENCES Direccion (ID_Direccion) ON DELETE CASCADE  
    ); 
    
    CREATE TABLE IF NOT EXISTS Victima( 
        ID_Victima INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        Apellido VARCHAR(100) NOT NULL,
        ID_Direccion INT NOT NULL,
        Fecha_Registro DATETIME NOT NULL,
        Fecha_Confirmacion DATETIME NOT NULL,
        Fecha_Muerte DATETIME NULL,
        ID_Estado INT NOT NULL,
        ID_Hospital INT NULL,
        PRIMARY KEY (ID_Victima),
        FOREIGN KEY (ID_Direccion) REFERENCES Direccion (ID_Direccion) ON DELETE CASCADE,
        FOREIGN KEY (ID_Estado) REFERENCES Estado (ID_Estado) ON DELETE CASCADE,
        FOREIGN KEY (ID_Hospital) REFERENCES Hospital (ID_Hospital) ON DELETE CASCADE
    ); 
    
    CREATE TABLE IF NOT EXISTS Asociado ( 
        ID_Asociado INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        Apellido VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID_Asociado)
    ); 
    
    CREATE TABLE IF NOT EXISTS Conocio ( 
        ID_Conocio INT NOT NULL AUTO_INCREMENT,
        ID_Victima INT NOT NULL,
        ID_Asociado INT NOT NULL,
        Fecha_Conocio DATETIME NULL,
        PRIMARY KEY (ID_Conocio),
        FOREIGN KEY (ID_Victima) REFERENCES Victima (ID_Victima) ON DELETE CASCADE,
        FOREIGN KEY (ID_Asociado) REFERENCES Asociado (ID_Asociado) ON DELETE CASCADE
    ); 
    
    CREATE TABLE IF NOT EXISTS TipoContacto ( 
        ID_TipoContacto INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID_TipoContacto)    
    ); 
    
    CREATE TABLE IF NOT EXISTS Contacto ( 
        ID_Contacto INT NOT NULL AUTO_INCREMENT,
        ID_Victima INT NOT NULL,
        ID_Asociado INT NOT NULL,
        ID_TipoContacto INT NULL,
        Fecha_Inicio_Contacto DATETIME NULL,
        Fecha_Final_Contacto DATETIME NULL,
        PRIMARY KEY (ID_Contacto),
        FOREIGN KEY (ID_Victima) REFERENCES Victima (ID_Victima) ON DELETE CASCADE,
        FOREIGN KEY (ID_Asociado) REFERENCES Asociado (ID_Asociado) ON DELETE CASCADE,
        FOREIGN KEY (ID_TipoContacto) REFERENCES TipoContacto (ID_TipoContacto) ON DELETE CASCADE
    ); 
    
    CREATE TABLE IF NOT EXISTS Tratamiento ( 
        ID_Tratamiento INT NOT NULL AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        Efectividad INT NOT NULL,
        PRIMARY KEY (ID_Tratamiento)
    ); 
    
    CREATE TABLE IF NOT EXISTS Detalle_Tratamiento ( 
        ID_DetalleTratamiento INT NOT NULL AUTO_INCREMENT,
        ID_Victima INT NOT NULL,
        ID_Tratamiento INT NOT NULL,
        Efectividad_Victima INT NOT NULL,
        Fecha_Inicio_Tratamiento DATETIME NOT NULL,
        Fecha_Final_Tratamiento DATETIME NOT NULL,
        PRIMARY KEY (ID_DetalleTratamiento),
        FOREIGN KEY (ID_Victima) REFERENCES Victima (ID_Victima) ON DELETE CASCADE,
        FOREIGN KEY (ID_Tratamiento) REFERENCES Tratamiento (ID_Tratamiento) ON DELETE CASCADE
    ); 
    
    CREATE TABLE IF NOT EXISTS Ubicacion ( 
        ID_Ubicacion INT NOT NULL AUTO_INCREMENT,
        ID_Victima INT NOT NULL,
        ID_Direccion INT NOT NULL,
        Fecha_Llegada DATETIME NULL,
        Fecha_Salida DATETIME NULL,
        PRIMARY KEY (ID_Ubicacion),
        FOREIGN KEY (ID_Victima) REFERENCES Victima (ID_Victima) ON DELETE CASCADE,
        FOREIGN KEY (ID_Direccion) REFERENCES Direccion (ID_Direccion) ON DELETE CASCADE
    ); 
    
    
    -- Tabla Estado --
    INSERT INTO Estado(Nombre)
        SELECT DISTINCT(ESTADO_VICTIMA) FROM Tabla_Temporal WHERE ESTADO_VICTIMA !='';
    
    -- Tabla Tratamiento
    INSERT INTO Tratamiento(Nombre,Efectividad)
        SELECT DISTINCT TRATAMIENTO,CONVERT(EFECTIVIDAD,UNSIGNED INTEGER) FROM Tabla_Temporal WHERE TRATAMIENTO !='';
    
    -- Tabla TipoContacto
    
    INSERT INTO TipoContacto(Nombre)
       SELECT DISTINCT(CONTACTO_FISICO) FROM Tabla_Temporal WHERE CONTACTO_FISICO !='';
    
    -- Asociado
    INSERT INTO Asociado(Nombre,Apellido)
    SELECT DISTINCT NOMBRE_ASOCIADO,APELLIDO_ASOCIADO FROM Tabla_Temporal WHERE NOMBRE_ASOCIADO !='' ;
    
    
    -- Tabla Direccion
    INSERT INTO Direccion(Nombre)
        SELECT DISTINCT(DIRECCION_VICTIMA) FROM Tabla_Temporal WHERE DIRECCION_VICTIMA !='' and 
       NOT EXISTS (Select Nombre FROM Direccion WHERE Nombre= DIRECCION_VICTIMA);
    
    INSERT INTO Direccion(Nombre)
        SELECT DISTINCT(UBICACION_VICTIMA) FROM Tabla_Temporal WHERE UBICACION_VICTIMA !=''and 
        NOT EXISTS (Select Nombre FROM Direccion WHERE Nombre= UBICACION_VICTIMA);
    
    INSERT INTO Direccion(Nombre)
        SELECT DISTINCT(DIRECCION_HOSPITAL) FROM Tabla_Temporal WHERE DIRECCION_HOSPITAL !='' and 
        NOT EXISTS (Select Nombre FROM Direccion WHERE Nombre= DIRECCION_HOSPITAL);
    
    -- Hospital 
    INSERT INTO Hospital (Nombre,ID_Direccion)
    SELECT DISTINCT NOMBRE_HOSPITAL,Direccion.ID_Direccion AS DIRECCION_HOSPITAL 
    from Tabla_Temporal 
    INNER JOIN Direccion ON Tabla_Temporal.DIRECCION_HOSPITAL = Direccion.Nombre;
    -- Victima 
    INSERT INTO Victima(Nombre,Apellido,ID_Direccion,Fecha_Registro,Fecha_Confirmacion,Fecha_Muerte,ID_Estado,ID_Hospital) 
    SELECT DISTINCT NOMBRE_VICTIMA,APELLIDO_VICTIMA,Direccion.ID_Direccion AS DIRECCION_VICTIMA,
    FECHA_PRIMERA_SOSPECHA,FECHA_CONFIRMACION,
    CASE WHEN FECHA_MUERTE = '' THEN NULL 
    WHEN FECHA_MUERTE != '' THEN FECHA_MUERTE 
    END AS FECHA_MUERTE,
    Estado.ID_Estado,
    CASE WHEN NOMBRE_HOSPITAL= '' THEN NULL 
    WHEN NOMBRE_HOSPITAL!='' THEN Hospital.ID_Hospital 
    END AS ID_Hospital 
    FROM Tabla_Temporal   
    LEFT JOIN Estado ON Tabla_Temporal.ESTADO_VICTIMA = Estado.Nombre 
    LEFT JOIN  Hospital ON Tabla_Temporal.NOMBRE_HOSPITAL = Hospital.Nombre 
    INNER JOIN Direccion ON Tabla_Temporal.DIRECCION_VICTIMA = Direccion.Nombre;
    
    -- Detalle_Tratamiento
    INSERT INTO Detalle_Tratamiento(ID_Victima,ID_Tratamiento,Efectividad_Victima,Fecha_Inicio_Tratamiento,Fecha_Final_Tratamiento) 
    SELECT  Victima.ID_Victima AS NOMBRE_VICTIMA,Tratamiento.ID_Tratamiento AS TRATAMIENTO,EFECTIVIDAD_EN_VICTIMA,
    CASE WHEN FECHA_INICIO_TRATAMIENTO = '' THEN NULL 
    WHEN FECHA_INICIO_TRATAMIENTO != '' THEN FECHA_INICIO_TRATAMIENTO 
    END AS FECHA_INICIO_TRATAMIENTO,
    CASE WHEN FECHA_FIN_TRATAMIENTO = '' THEN NULL 
    WHEN FECHA_FIN_TRATAMIENTO != '' THEN FECHA_FIN_TRATAMIENTO 
    END AS FECHA_INICIO_TRATAMIENTO FROM Tabla_Temporal  
    INNER JOIN Victima ON Tabla_Temporal.NOMBRE_VICTIMA = Victima.Nombre
    INNER JOIN Tratamiento ON Tabla_Temporal.Tratamiento = Tratamiento.Nombre;
    -- Ubicacion
    INSERT INTO Ubicacion(ID_Victima,ID_Direccion,Fecha_Llegada,Fecha_Salida) 
    SELECT DISTINCT Victima.ID_Victima AS NOMBRE_VICTIMA,Direccion.ID_Direccion AS UBICACION_VICTIMA,
    CASE WHEN FECHA_LLEGADA = '' THEN NULL 
    WHEN FECHA_LLEGADA != '' THEN FECHA_LLEGADA 
    END AS FECHA_LLEGADA,
    CASE WHEN FECHA_RETIRO = '' THEN NULL 
    WHEN FECHA_RETIRO != '' THEN FECHA_RETIRO 
    END AS FECHA_RETIRO
    FROM Tabla_Temporal  
    INNER JOIN Victima ON Tabla_Temporal.NOMBRE_VICTIMA = Victima.Nombre 
    INNER JOIN Direccion ON Tabla_Temporal.UBICACION_VICTIMA = Direccion.Nombre;
    -- Contacto
    INSERT INTO Contacto(ID_Victima,ID_Asociado,ID_TipoContacto,Fecha_Inicio_Contacto,Fecha_Final_Contacto) 
    SELECT DISTINCT Victima.ID_Victima AS NOMBRE_VICTIMA,Asociado.ID_Asociado AS NOMBRE_ASOCIADO, 
    CASE WHEN CONTACTO_FISICO= '' THEN NULL 
    WHEN CONTACTO_FISICO!='' THEN TipoContacto.ID_TipoContacto 
    END AS ID_TipoContacto,
    CASE WHEN Tabla_Temporal.FECHA_INICIO_CONTACTO = '' THEN NULL 
    WHEN Tabla_Temporal.FECHA_INICIO_CONTACTO != '' THEN Tabla_Temporal.FECHA_INICIO_CONTACTO
    END AS FECHA_INICIO_CONTACTO,
    CASE WHEN FECHA_FIN_CONTACTO = '' THEN NULL 
    WHEN FECHA_FIN_CONTACTO != '' THEN FECHA_FIN_CONTACTO
    END AS FECHA_FIN_CONTACTO
    FROM Tabla_Temporal  
    INNER JOIN Victima ON Tabla_Temporal.NOMBRE_VICTIMA = Victima.Nombre 
    INNER JOIN Asociado ON Tabla_Temporal.NOMBRE_ASOCIADO = Asociado.Nombre 
    INNER JOIN TipoContacto ON Tabla_Temporal.CONTACTO_FISICO = TipoContacto.Nombre;
    -- Conocio
    INSERT INTO Conocio(ID_Victima, ID_Asociado, Fecha_Conocio)
    SELECT DISTINCT Victima.ID_Victima, Asociado.ID_Asociado,FECHA_CONOCIO FROM Tabla_Temporal
    INNER JOIN Victima ON Tabla_Temporal.NOMBRE_VICTIMA = Victima.Nombre
    INNER JOIN Asociado ON Tabla_Temporal.NOMBRE_ASOCIADO = Asociado.Nombre;
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