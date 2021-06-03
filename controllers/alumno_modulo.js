'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Alumno = require('../models/alumno');
var Modulo = require('../models/modulo');
var Alumno_Modulo = require('../models/alumno_modulo');

function saveAlumnoModulo(req, res){
	var alumno_modulo = new Alumno_Modulo();
	var params = req.body;
	alumno_modulo.ano = params.ano;
	alumno_modulo.descripcion = params.descripcion;
	alumno_modulo.alumno =  params.alumno;
	alumno_modulo.modulo = params.modulo;

	alumno_modulo.save((err, alumno_moduloStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!alumno_moduloStored){
				res.status(404).send({message: ' No se ha podido guardar asignar la modulo al alumno'});
			}else{
				res.status(200).send({alumno: alumno_moduloStored});
			}
		}
	});
}


function getAlumnoPorModulo(req, res){
	var moduloId = req.params.modulo;
	if(moduloId){
		var find= Alumno.find({modulo: moduloId}).populate('alumno').sort({ano:-1});		
		}else{
		var find = Alumno_Modulo.find({}).populate('alumno').populate('modulo').sort({ano:-1});
	}

	find.exec((err, alumnos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!alumnos){
				res.status(404).send({message: ' no hay alumnos ni modulos asignados para mostrar'});
			}else{
				res.status(200).send({alumnos});
			}
		}
	});
}


function getModuloPorAlumno(req, res){
	var alumnoId = req.params.alumno;

	if(!alumnoId){
		var find = Alumno_Modulo.find({}).populate('alumno').populate('modulo').sort({ano:-1});
	}else{
		var find= Alumno.find({alumno: alumnoId}).populate('alumno').sort({ano:-1});
	}

	find.exec((err, modulos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!modulos){
				res.status(404).send({message: ' no hay modulos ni alumnos asignados para mostrar'});
			}else{
				res.status(200).send({modulos});
			}
		}
	});
}


module.exports={
	saveAlumnoModulo,
	getAlumnoPorModulo,
	getModuloPorAlumno
}