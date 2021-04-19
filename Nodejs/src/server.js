const  express  =  require ( 'express' )
let app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
app.set('port',process.env.PORT || 3030);
app.set('json spaces',2);



app.use(require('./consultas'));


//Servidor Escuchando

app.listen(app.get("port"), () => { 
  console.log(`http://localhost:${app.get("port")}`);
});
