const express = require("express")
require('dotenv').config();
const bodyParser = require('body-parser');
const app  = express()
const cors = require('cors'); 
const port = process.env.PORT || 4000;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');


// Convierte una petición recibida (POST-GET...) a objeto JSON
/*
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));

app.get('/', function(req, res){
	res.status(200).send({
		message: 'GET inicio'
	});
});

const loginRouter = require('./routes/login')
app.use('/login',loginRouter)

const anunciosRouter = require('./routes/anuncios')
app.use('/anuncios',anunciosRouter)

const usuariosRouter = require('./routes/usuarios')
app.use('/usuarios',usuariosRouter)

const calendarioRouter = require('./routes/calendario')
app.use('/calendario',calendarioRouter)

const jornadaRouter = require('./routes/jornada')
app.use('/jornada',jornadaRouter)

const docentesRouter = require('./routes/docentes')
app.use('/docentes',docentesRouter)

const profesionRouter = require('./routes/profesion')
app.use('/profesion',profesionRouter)

const gradosRouter = require('./routes/grados')
app.use('/grados',gradosRouter)

const materiasRouter = require('./routes/materias')
app.use('/materias',materiasRouter)

const materiasrelacionRouter = require('./routes/materiasrelacion')
app.use('/materiasrelacion',materiasrelacionRouter)

const estudiantesRouter = require('./routes/estudiantes')
app.use('/estudiantes',estudiantesRouter)

const estudiantesrelacionRouter = require('./routes/estudiantesrelacion')
app.use('/estudiantesrelacion',estudiantesrelacionRouter)

const tipoidentificacionRouter = require('./routes/tipoidentificacion')
app.use('/tipoidentificacion',tipoidentificacionRouter)

const notasRouter = require('./routes/notas')
app.use('/notas',notasRouter)

const reportesRouter = require('./routes/reportes')
app.use('/reportes',reportesRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.status(200).send({
		message: 'No existe el modulo especificado'
	});
  });

app.listen(port, () => console.log('Puerto utilizado' ,port))