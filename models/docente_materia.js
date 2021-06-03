'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Docente_MateriaSchema = Schema({
		ano: String,
		descripcion: String,
		docente: { type: Schema.ObjectId, ref: 'Docente'},
		materia: { type: Schema.ObjectId, ref: 'Materia'}
}); 

module.exports = mongoose.model('Docente_Materia', Docente_MateriaSchema);