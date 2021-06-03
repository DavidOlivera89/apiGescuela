'use strict'

var express = require('express');
var ObservacionCursoController = require('../controllers/observacionCurso');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveObservacionCurso', md_auth.ensureAuth, ObservacionCursoController.saveObservacionCurso);
api.get('/getObservacionesPorCurso/:id?', md_auth.ensureAuth, ObservacionCursoController.getObservacionesPorCurso);
api.get('/getObservacionCurso/:id', md_auth.ensureAuth, ObservacionCursoController.getObservacionCurso);
api.delete('/deleteObservacionCurso/:id?', md_auth.ensureAuth, ObservacionCursoController.deleteObservacionCurso);
api.put('/updateObservacionCurso/:id', md_auth.ensureAuth, ObservacionCursoController.updateObservacionCurso);


module.exports = api;