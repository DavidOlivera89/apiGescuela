'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

//var Docente = require('../models/docente');
//var Materia = require('../models/materia');
var Docente_Materia = require('../models/docente_materia');

function saveDocenteMateria(req, res){
	var docente_materia = new Docente_Materia();

	var params = req.body;
	docente_materia.ano = params.ano;
	docente_materia.descripcion = params.descripcion;
	docente_materia.docente =  params.docente;
	docente_materia.materia = params.materia;

	
	docente_materia.save((err, docente_materiaStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!docente_materiaStored){
				res.status(404).send({message: ' No se ha podido guardar asignar la materia al curso'});
			}else{
				res.status(200).send({curso: docente_materiaStored});
			}
		}
	});
}

function getDocentesPorMateria(req, res){
	var materiaId = req.params.materia;

	if(materiaId){
		//Sacar los docentes de una materia determinado
		var find= Docente_Materia.find({materia: materiaId}).populate('curso').sort({ano:-1});
	
	
	}else{
		//Sacar todos los docentes de la basee
		var find = Docente_Materia.find({}).populate('curso').populate('materia').sort({ano:-1});
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

function getMateriaPorDocente(req, res){
	var docenteId = req.params.docente;

	if(!docenteId){
		var find = Docente_Materia.find({}).populate('docente').populate('materia').sort({ano:-1});
	}else{
		// 
		var find= Docente_Materia.find({docente: docenteId}).populate('docente').sort({ano:-1});
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
	saveDocenteMateria,
	getDocentesPorMateria,
	getMateriaPorDocente
}