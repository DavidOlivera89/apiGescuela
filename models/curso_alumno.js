'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Curso_AlumnoSchema = Schema({
		ano: String,
		curso: { type: Schema.ObjectId, ref: 'Curso'},
		alumno: { type: Schema.ObjectId, ref: 'Alumno'}
}); 

module.exports = mongoose.model('Curso_Alumno', Curso_AlumnoSchema);