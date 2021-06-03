'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Curso_MateriaSchema = Schema({
		ano: String,
		curso: { type: Schema.ObjectId, ref: 'Curso'},
		materia: { type: Schema.ObjectId, ref: 'Materia'}
}); 

module.exports = mongoose.model('Curso_Materia', Curso_MateriaSchema);