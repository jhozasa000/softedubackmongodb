const express = require("express")
require('dotenv').config();
const bodyParser = require('body-parser');
const app  = express()
const cors = require('cors'); 
const port = process.env.PORT || 4000;



// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
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

app.listen(port, () => console.log('Puerto utilizado' ,port))