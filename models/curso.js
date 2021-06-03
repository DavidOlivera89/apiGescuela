'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursoSchema = Schema({
		ano: String,
		division: String,
		ano_gregoriano: String,
		tutor: { type: Schema.ObjectId, ref: 'Docente'},
		preceptor1:{ type: Schema.ObjectId, ref: 'Docente'},
		preceptor2:{ type: Schema.ObjectId, ref: 'Docente'}
}); 

module.exports = mongoose.model('Curso', CursoSchema);