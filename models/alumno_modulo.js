'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Alumno_ModuloSchema = Schema({
		ano: String,
		descripcion: String,
		alumno: { type: Schema.ObjectId, ref: 'Alumno'},
		modulo: { type: Schema.ObjectId, ref: 'Modulo'}

}); 

module.exports = mongoose.model('Alumno_Modulo', Alumno_ModuloSchema);