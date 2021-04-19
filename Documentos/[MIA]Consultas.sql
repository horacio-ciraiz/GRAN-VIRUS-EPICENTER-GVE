-- Consulta 1--
SELECT DISTINCT Hospital.Nombre AS Nombre_Hospital, Direccion.Nombre Direccion_Hospital, 
    (SELECT count(Fecha_Muerte) FROM Victima 
    WHERE Hospital.ID_Hospital = Victima.ID_Hospital) AS Muertos 
    FROM Hospital
    INNER JOIN Direccion 
    ON Hospital.ID_Direccion = Direccion.ID_Direccion
    INNER JOIN Victima 
    ON Hospital.ID_Hospital = Victima.ID_Hospital
    ORDER BY Hospital.Nombre;
-- Consulta 2--
SELECT DISTINCT Victima.Nombre, Victima.Apellido FROM Victima
INNER JOIN Detalle_Tratamiento 
ON Victima.ID_Victima = Detalle_Tratamiento.ID_Victima
INNER JOIN Estado 
ON Victima.ID_Estado = Estado.ID_Estado
INNER JOIN Tratamiento 
ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
WHERE Estado.Nombre LIKE '%Cuarentena%' 
AND Detalle_Tratamiento.Efectividad_Victima > 5 
AND Tratamiento.Nombre LIKE '%Transfusiones de sangre%';
-- Consulta 3--
SELECT Victima.Nombre, Victima.Apellido, Direccion.Nombre AS Direccion FROM Victima
INNER JOIN Direccion 
ON Victima.ID_Direccion = Direccion.ID_Direccion
WHERE Fecha_Muerte IS NOT NULL AND (SELECT count(ID_Asociado) FROM Conocio
 WHERE ID_Victima = Victima.ID_Victima) > 3;
-- Consulta 4--
SELECT DISTINCT Victima.Nombre, Victima.Apellido FROM Victima
INNER JOIN Estado 
ON Victima.ID_Estado = Estado.ID_Estado
INNER JOIN Contacto 
ON Victima.ID_Victima = Contacto.ID_Victima
INNER JOIN TipoContacto 
ON Contacto.ID_TipoContacto = TipoContacto.ID_TipoContacto
WHERE TipoContacto.Nombre LIKE '%Beso%' 
AND (SELECT count(ID_Asociado) FROM Conocio WHERE ID_Victima = Victima.ID_Victima) > 2
AND Estado.Nombre LIKE '%Sospecha%';
-- Consulta 5--
SELECT DISTINCT Victima.Nombre, Victima.Apellido,(SELECT count(Detalle_Tratamiento.ID_Tratamiento) FROM Detalle_Tratamiento 
INNER JOIN Tratamiento 
ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
WHERE Tratamiento.Nombre LIKE '%Oxigeno%' 
AND Detalle_Tratamiento.ID_Victima = Victima.ID_Victima) AS Cantidad FROM Victima
INNER JOIN Detalle_Tratamiento 
ON Victima.ID_Victima =  Detalle_Tratamiento.ID_Victima
INNER JOIN Tratamiento 
ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
ORDER BY Cantidad DESC LIMIT 5;
-- Consulta 6 -- 
SELECT DISTINCT Victima.Nombre, Victima.Apellido, Victima.Fecha_Muerte
FROm Victima
INNER JOIN Ubicacion 
ON  Victima.ID_Victima = Ubicacion.ID_Victima
INNER JOIN Direccion 
ON Ubicacion.ID_Direccion = Direccion.ID_Direccion
INNER JOIN Detalle_Tratamiento 
ON Victima.ID_Victima =  Detalle_Tratamiento.ID_Victima
INNER JOIN Tratamiento 
ON Detalle_Tratamiento.ID_Tratamiento = Tratamiento.ID_Tratamiento
WHERE Direccion.Nombre LIKE '%1987 Delphine Well%' 
AND Tratamiento.Nombre LIKE '%Manejo de la presion arterial%'
AND Fecha_Muerte IS NOT NULL;

-- Consulta 7 --
SELECT Victima.Nombre, Victima.Apellido, Direccion.Nombre AS Direccion FROM Conocio
INNER JOIN Victima 
ON Conocio.ID_Victima = Victima.ID_Victima
INNER JOIN Direccion 
ON Victima.ID_Direccion = Direccion.ID_Direccion
INNER JOIN Asociado 
ON Conocio.ID_Asociado = Asociado.ID_Asociado
WHERE Asociado.Nombre = Victima.Nombre 
AND Asociado.Apellido = Victima.Apellido
AND Victima.ID_Hospital IS NOT NULL 
AND (SELECT count(ID_Conocio) FROM Conocio 
WHERE ID_Victima = Victima.ID_Victima) < 2
AND (SELECT count(ID_Tratamiento) Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) = 2;

--Consulta 8
(SELECT Nombre, Apellido, (SELECT count(ID_DetalleTratamiento)
FROM Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) 
AS Cantidad,MONTH(Victima.Fecha_Registro) as Numero_Mes FROM Victima
ORDER BY Cantidad DESC LIMIT 5)
UNION 
(SELECT Nombre, Apellido, (SELECT count(ID_DetalleTratamiento) 
FROM Detalle_Tratamiento WHERE ID_Victima = Victima.ID_Victima) 
AS Cantidad ,MONTH(Victima.Fecha_Registro) as Numero_Mes FROM Victima
ORDER BY Cantidad ASC LIMIT 5);

-- Consulta 9
SELECT Hospital.Nombre,
((SELECT count(ID_Victima) FROM Victima 
WHERE ID_Hospital = Hospital.ID_Hospital) / (SELECT count(ID_Victima) FROM Victima WHERE ID_Hospital IS NOT NULL) ) * 100 AS Porcentaje
FROM Hospital
INNER JOIN Victima 
ON Hospital.ID_Hospital = Victima.ID_Victima;

-- Consulta 10 
SELECT DISTINCT Nombre,Contacto,Cantidad,Porcentaje From (
    SELECT Hospital.Nombre as Nombre , tc.Nombre AS Contacto, COUNT(*) As Cantidad,
    			(COUNT(*) / (SELECT COUNT(*) FROM Hospital h
    				INNER JOIN Victima v 
                    on h.ID_Hospital = v.ID_Hospital 
    				INNER JOIN Contacto c 
                    on v.ID_Victima =c.ID_Victima 
    				INNER JOIN TipoContacto tc 
                    on c.ID_TipoContacto = tc.ID_TipoContacto 
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

-- Borrar
--Borrar Temporal
DROP TABLE IF EXISTS Tabla_Temporal;

--Borrar Modelo--

DROP TABLE IF EXISTS Direccion,Estado,Hospital,Victima,Asociado,Conocio,TipoContacto,Contacto,Tratamiento,Detalle_Tratamiento,Ubicacion;




