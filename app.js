'use strict'

var express = require('express');
var bodyParser= require('body-parser');

var app= express();

//cargar rutas

var alumno_routes = require('./routes/alumno');
var docente_routes = require('./routes/docente');
var user_routes = require('./routes/user');
var observacionAlumno_routes = require('./routes/observacionAlumno');
var observacionCurso_routes = require('./routes/observacionCurso');
var curso_routes = require('./routes/curso');
var materia_routes = require('./routes/materia');
var modulo_routes = require('./routes/modulo');
var curso_alumno_routes = require('./routes/curso_alumno');
var curso_materia_routes = require('./routes/curso_materia');
//var docente_materia_routes = require('./routes/docente_materia');
var alumno_materia_routes = require('./routes/alumno_materia');
var alumno_modulo_routes = require('./routes/alumno_modulo');
var docente_modulo_routes = require('./routes/docente_modulo');
var curso_docente_routes = require('./routes/curso_docente');
var nota_materia_routes = require('./routes/nota_materia');
var nota_modulo_routes = require('./routes/nota_modulo');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});


//rutas base

app.use('/api', alumno_routes);
app.use('/api', docente_routes);
app.use('/api', user_routes);
app.use('/api', observacionAlumno_routes);
app.use('/api', observacionCurso_routes);
app.use('/api', curso_routes);
app.use('/api', materia_routes);
app.use('/api', modulo_routes);
app.use('/api', curso_alumno_routes);
app.use('/api', curso_materia_routes);
//app.use('/api', docente_materia_routes);
app.use('/api', alumno_materia_routes);
app.use('/api', alumno_modulo_routes);
app.use('/api', docente_modulo_routes);
app.use('/api', curso_docente_routes);
app.use('/api', nota_materia_routes);
app.use('/api', nota_modulo_routes);




app.get('/pruebaEscuchaApiRest', function(req, res){
	res.status(200).send({message:'Bienvenido, esta es una prueba del servidor de GeEscuela'}); 
});

module.exports = app;