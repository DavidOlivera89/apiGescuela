'use strict'

var express = require('express');
var Docente_ModuloController = require('../controllers/docente_modulo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveDocenteModulo', md_auth.ensureAuth, Docente_ModuloController.saveDocenteModulo);
api.get('/getDocentesPorModulo/:materia?', md_auth.ensureAuth, Docente_ModuloController.getDocentesPorModulo);
api.get('/getModuloPorDocente/:docente?', md_auth.ensureAuth,  Docente_ModuloController.getModuloPorDocente);

module.exports = api;