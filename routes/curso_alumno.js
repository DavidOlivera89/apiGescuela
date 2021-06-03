'use strict'

var express = require('express');
var Curso_AlumnoController = require('../controllers/curso_alumno');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveCursoAlumno', md_auth.ensureAuth, Curso_AlumnoController.saveCursoAlumno);
api.get('/getCursosPorAlumno/:alumno?', md_auth.ensureAuth, Curso_AlumnoController.getCursosPorAlumno);
api.get('/getAlumnosPorCurso/:curso?', md_auth.ensureAuth, Curso_AlumnoController.getAlumnosPorCurso);

module.exports = api;