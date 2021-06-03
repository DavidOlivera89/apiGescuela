'use strict'

var express = require('express');
var Curso_DocenteController = require('../controllers/curso_docente');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveCursoDocente', md_auth.ensureAuth, Curso_DocenteController.saveCursoDocente);
api.get('/getCursosPorDocente/:docente?', md_auth.ensureAuth, Curso_DocenteController.getCursosPorDocente);
api.get('/getDocentesPorCurso/:curso?', md_auth.ensureAuth, Curso_DocenteController.getDocentePorCurso);

module.exports = api;