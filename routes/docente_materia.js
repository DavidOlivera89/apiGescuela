'use strict'

var express = require('express');
var Docente_MateriaController = require('../controllers/docente_materia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');



module.exports = api;