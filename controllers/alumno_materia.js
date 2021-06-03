'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Alumno = require('../models/alumno');
var Materia = require('../models/materia');
var Alumno_Materia = require('../models/alumno_materia');

function saveAlumnoMateria(req, res){
	var alumno_materia = new Alumno_Materia();
	var params = req.body;
	alumno_materia.ano = params.ano;
	alumno_materia.descripcion = params.descripcion;
	alumno_materia.alumno =  params.alumno;
	alumno_materia.materia = params.materia;

	alumno_materia.save((err, alumno_materiaStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!alumno_materiaStored){
				res.status(404).send({message: ' No se ha podido guardar asignar la materia al alumno'});
			}else{
				res.status(200).send({alumno: alumno_materiaStored});
			}
		}
	});
}


function getAlumnoPorMateria(req, res){
	var materiaId = req.params.materia;

	if(!materiaId){
		var find = Alumno_Materia.find({}).populate('alumno').populate('materia').sort({ano:-1});
	}else{
		var find= Alumno.find({materia: materiaId}).populate('alumno').sort({ano:-1});
	}

	find.exec((err, alumnos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!alumnos){
				res.status(404).send({message: ' no hay alumnos ni materias asignados para mostrar'});
			}else{
				res.status(200).send({alumnos});
			}
		}
	});
}


function getMateriaPorAlumno(req, res){
	var alumnoId = req.params.alumno;

	if(!alumnoId){
			var find = Alumno_Materia.find({}).populate('alumno').populate('materia').sort({ano:-1});
	}else{
		var find= Alumno.find({alumno: alumnoId}).populate('alumno').sort({ano:-1});
	}

	find.exec((err, materias)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!materias){
				res.status(404).send({message: ' no hay materias ni alumnos asignados para mostrar'});
			}else{
				res.status(200).send({materias});
			}
		}
	});
}


module.exports={
	saveAlumnoMateria,
	getAlumnoPorMateria,
	getMateriaPorAlumno
}