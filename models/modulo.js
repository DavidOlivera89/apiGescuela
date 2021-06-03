'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModuloSchema = Schema({
		nombre: String,
		ano_cursado: String,
		horarios: String,
		planificacion: String,
		bibliografia: String,
		materia: { type: Schema.ObjectId, ref: 'Materia'},
		nombre_materia: String,
		profesor1: { type: Schema.ObjectId, ref: 'Docente'},
		profesor2: { type: Schema.ObjectId, ref: 'Docente'},
		ano_gregoriano: String
}); 

module.exports = mongoose.model('Modulo', ModuloSchema);