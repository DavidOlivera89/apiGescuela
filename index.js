'use strict'
var mongoose = require('mongoose');
var app= require('./app');
var port = process.env.PORT || 3900;

//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/app_escuela_db', (err, res)=> {
mongoose.connect('mongodb+srv://AdminDavid:HidA5KaOXsD5d3t1@appclusterescuela.funeb.mongodb.net/app_Escuela1_db?retryWrites=true&w=majority', (err, res)=> {

	if (err){
		throw err;
	} else{
		console.log("La conexion a la base de datos esta funcionando correctamente");
		
		app.listen(port, function(){
			console.log("Servidor del api rest de APP_ESCUELA escuchando en localhost:"+port);
		});
		}
});
