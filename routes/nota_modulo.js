'use strict'

var express = require('express');
var Nota_ModuloController = require('../controllers/nota_modulo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveNotaModulo', md_auth.ensureAuth, Nota_ModuloController.saveNotaModulo);
api.get('/getNotasModuloPorParametros/:alumno?&:modulo?', md_auth.ensureAuth, Nota_ModuloController.getNotasModuloPorParametros);
api.get('/getNotasModuloPorParametros/:alumno?', md_auth.ensureAuth, Nota_ModuloController.getNotasModuloPorParametros);
api.post('/getNotasModuloPorModuloCurso', md_auth.ensureAuth,  Nota_ModuloController.getNotasModuloPorModuloCurso);
api.get('/getNotasModuloPorModulo/:id', md_auth.ensureAuth, Nota_ModuloController.getNotasModuloPorModulo);
api.post('/getNotaModuloPorAlumnoYModulo', md_auth.ensureAuth, Nota_ModuloController.getNotaModuloPorAlumnoYModulo);
api.get('/getNotaModulo/:id?', md_auth.ensureAuth, Nota_ModuloController.getNotaModulo);
api.put('/updateNotaModulo/:id', md_auth.ensureAuth, Nota_ModuloController.updateNotaModulo);
api.delete('/deleteNotaModulo/:id?', md_auth.ensureAuth, Nota_ModuloController.deleteNotaModulo);


module.exports = api;