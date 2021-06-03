'use strict'

var express = require('express');
var CursoController = require('../controllers/curso');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveCurso', md_auth.ensureAuth, CursoController.saveCurso);
api.get('/getCursosPorAlumno/:alumno?', md_auth.ensureAuth, CursoController.getCursosAlumno);
api.delete('/deleteCurso/:id?', md_auth.ensureAuth, CursoController.deleteCurso);
api.put('/updateCurso/:id', md_auth.ensureAuth, CursoController.updateCurso);
api.get('/getCurso/:id', md_auth.ensureAuth, CursoController.getCurso);
api.get('/getCursos/:page?', md_auth.ensureAuth, CursoController.getCursos);
api.get('/getTodosLosCursos', md_auth.ensureAuth, CursoController.getTodosLosCursos);
api.post('/getCursosPorMateria/', md_auth.ensureAuth, CursoController.getCursosPorMateria);
api.post('/getCursosPorBusqueda/', md_auth.ensureAuth, CursoController.getCursosPorBusqueda);
api.post('/getCursosPorModulo/', md_auth.ensureAuth, CursoController.getCursosPorModulo);
api.get('/getCursosPorPreceptor/:id', md_auth.ensureAuth, CursoController.getCursosPorPreceptor);
api.get('/getCursoMMPorAlumno/:id', md_auth.ensureAuth, CursoController.getCursoMMPorAlumno);
api.get('/getAlumnos_Curso/:id', md_auth.ensureAuth, CursoController.getAlumnos_Curso);
api.post('/getCursosPorrBusqueda/:page?', md_auth.ensureAuth, CursoController.getCursosPorrBusqueda);


module.exports = api;