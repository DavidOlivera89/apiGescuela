'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlumnoSchema = Schema({

		name: String,
		surname: String,
		image: String,
		tipo_dni: String,
		n_dni: String,
		fecha_nacimiento: String,
		telefono: String,
		email: String,
		password: String,
		profesor: Boolean,
	    preceptor: Boolean,
	    tutor: Boolean,
	    alumno: Boolean,
	    ultimoCurso: { type: Schema.ObjectId, ref: 'Curso'}
}); 

module.exports = mongoose.model('Alumno', AlumnoSchema);
