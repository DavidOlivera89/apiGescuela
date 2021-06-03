'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Curso_DocenteSchema = Schema({
		ano: String,
		descripcion: String,
		tutor: Boolean,
		preceptor: Boolean,
		curso: { type: Schema.ObjectId, ref: 'Curso'},
		docente: { type: Schema.ObjectId, ref: 'Docente'}
}); 

module.exports = mongoose.model('Curso_Docente', Curso_DocenteSchema);