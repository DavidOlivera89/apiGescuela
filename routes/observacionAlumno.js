'use strict'

var express = require('express');
var ObservacionAlumnoController = require('../controllers/observacionAlumno');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveObservacionAlumno', md_auth.ensureAuth,  ObservacionAlumnoController.saveObservacionAlumno);
api.get('/getAllObservacionesAlumno', md_auth.ensureAuth, ObservacionAlumnoController.getAllObservacionesAlumno);
api.get('/getObservacionesPorAlumno/:alumno', md_auth.ensureAuth, ObservacionAlumnoController.getObservacionesPorAlumno);
api.get('/getObservacionAlumno/:id', md_auth.ensureAuth, ObservacionAlumnoController.getObservacionAlumno);
api.delete('/deleteObservacionAlumno/:id?', md_auth.ensureAuth, ObservacionAlumnoController.deleteObservacionAlumno);
api.put('/updateObservacionAlumno/:id', md_auth.ensureAuth, ObservacionAlumnoController.updateObservacionAlumno);


module.exports = api;