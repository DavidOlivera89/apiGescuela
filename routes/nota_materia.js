'use strict'

var express = require('express');
var Nota_MateriaController = require('../controllers/nota_materia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');


api.post('/saveNotaMateria', md_auth.ensureAuth, Nota_MateriaController.saveNotaMateria);
api.get('/getNotasMateriaPorParametros/:alumno?&:materia?', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaPorParametros);
api.get('/getNotasMateriaPorParametros/:alumno?', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaPorParametros);
api.get('/getNotasMateriaPorMateria/:id?', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaPorMateria);
api.post('/getNotasMateriaPorMateriaCurso', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaPorMateriaCurso);
api.get('/getNotaMateria/:id?', md_auth.ensureAuth, Nota_MateriaController.getNotaMateria);
api.put('/updateNotaMateria/:id', md_auth.ensureAuth, Nota_MateriaController.updateNotaMateria);
api.post('/getNotasMateriaPorMateriaAlumno/', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaPorMateriaAlumno);
api.post('/getNotaMateriaPorAlumnoYMateria', md_auth.ensureAuth, Nota_MateriaController.getNotaMateriaPorAlumnoYMateria);
api.get('/getNotasMateriaYModuloPorAlumno/:id', md_auth.ensureAuth, Nota_MateriaController.getNotasMateriaYModuloPorAlumno);
api.delete('/deleteNotaMateria/:id?', md_auth.ensureAuth, Nota_MateriaController.deleteNotaMateria);


module.exports = api;