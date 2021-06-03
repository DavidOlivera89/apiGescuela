'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Nota_MateriaSchema = Schema({
		identificador: String,
		tipo_nota: String,
		valor: String,
		descripcion: String,
		publica: Boolean,
		fecha: String,
		materia: { type: Schema.ObjectId, ref: 'Materia'},
		alumno: { type: Schema.ObjectId, ref: 'Alumno'},
		curso: { type: Schema.ObjectId, ref: 'Curso'}
}); 

module.exports = mongoose.model('Nota_Materia', Nota_MateriaSchema);