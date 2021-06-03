'use strict'

var express = require('express');
var DocenteController = require('../controllers/docente');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/docentes'});


api.get('/getDocentes/:page?', md_auth.ensureAuth, DocenteController.getDocentes);
api.get('/getTodosLosProfesores/', md_auth.ensureAuth, DocenteController.getTodosLosProfesores);
api.get('/getTodosLosTutores/', md_auth.ensureAuth, DocenteController.getTodosLosTutores);
api.get('/getTodosLosPreceptores/', md_auth.ensureAuth, DocenteController.getTodosLosPreceptores);
api.post('/registrarDocente', md_auth.ensureAuth, DocenteController.saveDocente);
api.post('/saveDocente', md_auth.ensureAuth, DocenteController.saveDocente);
api.delete('/deleteDocente/:id?', md_auth.ensureAuth, DocenteController.deleteDocente);
api.put('/updateDocente/:id', DocenteController.updateDocente);
api.put('/updateClaveDocente/:id', DocenteController.updateClaveDocente);
api.post('/upload-image-docente/:id', [md_auth.ensureAuth, md_upload] ,DocenteController.uploadImage);
api.get('/get-image-docente/:imageFile', DocenteController.getImageDocente);
api.get('/get-image-escuela', DocenteController.getImageEscuela);
api.get('/getDocente/:id?', md_auth.ensureAuth, DocenteController.getDocente);
api.post('/getMateriasModulosCursosDeDocente/', md_auth.ensureAuth, DocenteController.getMateriasModulosCursosDeDocente);
api.post('/getDocentesPorBusqueda/', md_auth.ensureAuth, DocenteController.getDocentesPorBusqueda);
api.post('/getDocentesPorrBusqueda/:page?', md_auth.ensureAuth, DocenteController.getDocentesPorrBusqueda);


module.exports = api;