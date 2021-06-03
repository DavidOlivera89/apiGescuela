'use strict'

var express = require('express');
var ModuloController = require('../controllers/modulo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.delete('/deleteModulo/:id?', md_auth.ensureAuth, ModuloController.deleteModulo);
api.post('/saveModulo', md_auth.ensureAuth,  ModuloController.saveModulo);
api.get('/getModulos/:materia?', md_auth.ensureAuth,  ModuloController.getModulos);
api.get('/getModulo/:id?', md_auth.ensureAuth, ModuloController.getModulo);
api.put('/updateModulo/:id', md_auth.ensureAuth, ModuloController.updateModulo);
api.get('/getModulo/:id?', md_auth.ensureAuth, ModuloController.getModulo);



module.exports = api;