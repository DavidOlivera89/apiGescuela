'use strict'

var express = require('express');
var AlumnoController = require('../controllers/alumno');
var UserController = require('../controllers/user');


var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/alumnos'});

api.get('/probando', md_auth.ensureAuth, AlumnoController.pruebas);
api.get('/getAlumnos/:page?', md_auth.ensureAuth, AlumnoController.getAlumnos);
api.post('/saveAlumno', md_auth.ensureAuth,AlumnoController.saveAlumno);
api.put('/updateAlumno/:id', md_auth.ensureAuth, AlumnoController.updateAlumno);
api.put('/updateClaveAlumno/:id', AlumnoController.updateClaveAlumno);
api.post('/upload-image-alumno/:id' , [md_auth.ensureAuth, md_upload], AlumnoController.uploadImage);
api.get('/get-image-alumno/:imageFile', AlumnoController.getImageAlumno);
api.delete('/deleteAlumno/:id?', md_auth.ensureAuth, AlumnoController.deleteAlumno);
api.get('/getAlumnosPorCurso/:id?', md_auth.ensureAuth, AlumnoController.getAlumnosPorCurso);
api.get('/getAlumno/:id?', md_auth.ensureAuth, AlumnoController.getAlumno);
api.post('/getAlumnosPorBusqueda', md_auth.ensureAuth, AlumnoController.getAlumnosPorBusqueda);
api.post('/getAlumnosPorrBusqueda/:page?', md_auth.ensureAuth, AlumnoController.getAlumnosPorrBusqueda);


module.exports = api;