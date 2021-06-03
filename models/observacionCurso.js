'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObservacionCursoSchema = Schema({
		fecha: String,
		hora: String,
		descripcion: String,
		docente_observador: { type: Schema.ObjectId, ref: 'Docente'},
		curso_observado: { type: Schema.ObjectId, ref: 'Curso'}
}); 

module.exports = mongoose.model('ObservacionCurso', ObservacionCursoSchema);