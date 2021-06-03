'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocenteSchema = Schema({
		name: String,
		surname: String,
		image: String,
		tipo_dni: String,
		n_dni: Number,
		fecha_nacimiento: String,
		telefono: String,
		email: String,
		password: String,
		profesor: Boolean,
	    preceptor: Boolean,
	    tutor: Boolean,
	    alumno: Boolean,
	    titulo: String
	
}); 

module.exports = mongoose.model('Docente', DocenteSchema);