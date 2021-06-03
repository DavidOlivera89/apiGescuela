'use strict'

var express = require('express');
var Curso_MateriaController = require('../controllers/curso_materia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveCursoMateria', md_auth.ensureAuth, Curso_MateriaController.saveCursoMateria);
api.get('/getCursosPorMateria/:materia?', md_auth.ensureAuth, Curso_MateriaController.getCursosPorMateria);

module.exports = api;