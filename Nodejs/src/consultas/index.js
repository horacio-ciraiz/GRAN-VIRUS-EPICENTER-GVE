const express = require('express')
const app = express()

// Indica las rutas de la aplicación
app.use(require('./consulta1'))
app.use(require('./consulta2'))
app.use(require('./consulta3'))
app.use(require('./consulta4'))
app.use(require('./consulta5'))
app.use(require('./consulta6'))
app.use(require('./consulta7'))
app.use(require('./consulta8'))
app.use(require('./consulta9'))
app.use(require('./consulta10'))
app.use(require('./cargarTemporal'))
app.use(require('./eliminarModelo'))
app.use(require('./eliminarTemporal'))

module.exports = app;