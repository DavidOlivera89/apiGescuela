'use strict'

var express = require('express');
var MateriaController = require('../controllers/materia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.delete('/deleteMateria/:id?', md_auth.ensureAuth, MateriaController.deleteMateria);

api.post('/saveMateria', md_auth.ensureAuth, MateriaController.saveMateria);
api.put('/updateMateria/:id', md_auth.ensureAuth, MateriaController.updateMateria);
api.get('/getMateriasModulos/:page?', md_auth.ensureAuth, MateriaController.getMateriasModulos);
api.get('/getTodasMateriasYModulos/', md_auth.ensureAuth, MateriaController.getTodasMateriasYModulos);
api.get('/getMateria/:id?', md_auth.ensureAuth, MateriaController.getMateria);
api.post('/getMateriasYModulosPorCurso', md_auth.ensureAuth, MateriaController.getMateriasYModulosPorCurso);
api.post('/getMateriasYModulosPorBusqueda', md_auth.ensureAuth, MateriaController.getMateriasYModulosPorBusqueda);
api.post('/getMateriasYModulosPorrBusqueda/:page?', md_auth.ensureAuth, MateriaController.getMateriasYModulosPorrBusqueda);

module.exports = api;