'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObservacionAlumnoSchema = Schema({
		fecha: String,
		hora: String,
		descripcion: String,
		docente_observador: { type: Schema.ObjectId, ref: 'Docente'},
		alumno_observado: { type: Schema.ObjectId, ref: 'Alumno'}
}); 

module.exports = mongoose.model('ObservacionAlumno', ObservacionAlumnoSchema);