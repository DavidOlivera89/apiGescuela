'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MateriaSchema = Schema({
		nombre: String,
		ano_cursado: String,
		horarios: String,
		planificacion: String,
		bibliografia: String,
		profesor1: { type: Schema.ObjectId, ref: 'Docente'},
		profesor2: { type: Schema.ObjectId, ref: 'Docente'},
		ano_gregoriano: String
		
}); 

module.exports = mongoose.model('Materia', MateriaSchema);