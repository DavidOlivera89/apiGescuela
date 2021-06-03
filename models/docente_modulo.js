'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Docente_ModuloSchema = Schema({
		ano: String,
		descripcion: String,
		docente: { type: Schema.ObjectId, ref: 'Docente'},
		modulo: { type: Schema.ObjectId, ref: 'Modulo'}
}); 

module.exports = mongoose.model('Docente_Modulo', Docente_ModuloSchema);