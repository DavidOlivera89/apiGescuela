'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Alumno_MateriaSchema = Schema({
		ano: String,
		alumno: { type: Schema.ObjectId, ref: 'Alumno'},
		materia: { type: Schema.ObjectId, ref: 'Materia'}

}); 

module.exports = mongoose.model('Alumno_Materia', Alumno_MateriaSchema);