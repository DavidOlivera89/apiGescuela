'use strict'

var express = require('express');
var AlumnoController = require('../controllers/alumno');
var UserController = require('../controllers/user');
var DocenteController = require('../controllers/docente');


var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/alumnos'});


api.get('/probando', AlumnoController.pruebas);
api.post('/loginAlumno', AlumnoController.loginUser);
api.put('/updateDocente/:id', md_auth.ensureAuth, DocenteController.updateDocente);
api.post('/loginUser', UserController.loginUser);


module.exports = api;