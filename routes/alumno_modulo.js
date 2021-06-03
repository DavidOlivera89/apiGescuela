'use strict'

var express = require('express');
var Alumno_ModuloController = require('../controllers/alumno_modulo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/saveAlumnoModulo', md_auth.ensureAuth,  Alumno_ModuloController.saveAlumnoModulo);
api.get('/getAlumnoPorModulo/:modulo?', md_auth.ensureAuth, Alumno_ModuloController.getAlumnoPorModulo);
api.get('/getModuloPorAlumno/:alumno?', md_auth.ensureAuth, Alumno_ModuloController.getModuloPorAlumno);

module.exports = api;