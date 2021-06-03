'use strict'

var express = require('express');
var Alumno_MateriaController = require('../controllers/alumno_materia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/saveAlumnoMateria', md_auth.ensureAuth, Alumno_MateriaController.saveAlumnoMateria);
api.get('/getAlumnoPorMateria/:materia?', md_auth.ensureAuth,  Alumno_MateriaController.getAlumnoPorMateria);
api.get('/getMateriaPorAlumno/:alumno?', md_auth.ensureAuth, Alumno_MateriaController.getMateriaPorAlumno);

module.exports = api;