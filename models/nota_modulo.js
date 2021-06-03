'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Nota_ModuloSchema = Schema({
		identificador: String,
		tipo_nota: String,
		valor: String,
		descripcion: String,
		publica: Boolean,
		fecha: String,
		modulo: { type: Schema.ObjectId, ref: 'Modulo'},
		alumno: { type: Schema.ObjectId, ref: 'Alumno'},
		curso:{type: Schema.ObjectId, ref: 'Alumno'},
		
}); 

module.exports = mongoose.model('Nota_Modulo', Nota_ModuloSchema);