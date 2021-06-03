'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Curso = require('../models/curso');
var Docente = require('../models/docente');
var Curso_Docente = require('../models/curso_docente');

function saveCursoDocente(req, res){
	var curso_docente = new Curso_Docente();

	var params = req.body;
	curso_docente.ano = params.ano;
	curso_docente.descripcion = params.descripcion;
	curso_docente.tutor =params.tutor;
	curso_docente.preceptor = params.preceptor;
	curso_docente.curso =  params.curso;
	curso_docente.docente = params.docente;

	
	curso_docente.save((err, curso_docenteStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!curso_docenteStored){
				res.status(404).send({message: ' No se ha podido asignar el curso al docente preceptor o tutor'});
			}else{
				res.status(200).send({curso_docente: curso_docenteStored});
			}
		}
	});
}

function getCursosPorDocente(req, res){
	var docenteId = req.params.docente;

	if(!alumnoId){
		var find = Curso_Docente.find({}).populate('curso').populate('docente').sort({ano:-1});
	}else{
		//Sacar los cursos del docente determinado
		var find= Curso.find({docente: docenteId}).populate('curso').sort({ano:-1});
	}


	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos ni docente asignados para mostrar'});
			}else{
				res.status(200).send({cursos});
			}
		}
	});
}

function getDocentePorCurso(req, res){
	var cursoId = req.params.curso;

	if(!cursoId){
		
		var find = Curso_Docente.find({}).populate('curso').populate('docente').sort({ano:-1});
	}else{
		//Sacar los docente de un curso 
		var find= Curso_Docente.find({curso: cursoId}).populate('docente').sort({ano:-1});
	}


	find.exec((err, docentes)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!docentes){
				res.status(404).send({message: ' no hay docentes asignados a cursos para mostrar'});
			}else{
				res.status(200).send({docentes});
			}
		}
	});
}

module.exports={
	saveCursoDocente,
	getCursosPorDocente,
	getDocentePorCurso
}