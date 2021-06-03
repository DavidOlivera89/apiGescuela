'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Docente = require('../models/docente');
var Modulo = require('../models/modulo');
var Docente_Modulo = require('../models/docente_modulo');

function saveDocenteModulo(req, res){
	var docente_modulo = new Docente_Modulo();
	var params = req.body;
	docente_modulo.ano = params.ano;
	docente_modulo.descripcion = params.descripcion;
	docente_modulo.docente =  params.docente;
	docente_modulo.modulo = params.modulo;
	
	docente_modulo.save((err, docente_moduloStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!docente_moduloStored){
				res.status(404).send({message: ' No se ha podido guardar asignar la modulo al curso'});
			}else{
				res.status(200).send({curso: docente_moduloStored});
			}
		}
	});
}

function getDocentesPorModulo(req, res){
	var moduloId = req.params.modulo;

	if(moduloId){
		//Sacar los docentes de un modulo determinado
		var find= Docente_Modulo.find({modulo: moduloId}).populate('curso').sort({ano:-1});
	
	}else{
			//Sacar todos los docentes de la basee
		var find = Docente_Modulo.find({}).populate('curso').populate('modulo').sort({ano:-1});

	}


	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos ni alumnos asignados para mostrar'});
			}else{
				res.status(200).send({cursos});
			}
		}
	});
}


function getModuloPorDocente(req, res){
	var docenteId = req.params.docente;
	if(!docenteId){
		var find = Docente_Modulo.find({}).populate('docente').populate('modulo').sort({ano:-1});
	}else{
		var find= Docente_Modulo.find({docente: docenteId}).populate('docente').sort({ano:-1});
	}

	find.exec((err, modulos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!modulos){
				res.status(404).send({message: ' no hay modulos asignados para mostrar'});
			}else{
				res.status(200).send({modulos});
			}
		}
	});
}




module.exports={
	saveDocenteModulo,
	getDocentesPorModulo,
	getModuloPorDocente
}