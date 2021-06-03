'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Curso = require('../models/curso');
var Alumno = require('../models/alumno');
var Curso_Alumno = require('../models/curso_alumno');

function saveCursoAlumno(req, res){
	var curso_alumno = new Curso_Alumno();

	var params = req.body;
	curso_alumno.ano = params.ano;
	curso_alumno.curso =  params.curso;
	curso_alumno.alumno = params.alumno;

	console.log("ACA DESDE CURSO ALUMNO");
	curso_alumno.save((err, curso_alumnoStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!curso_alumnoStored){
				res.status(404).send({message: ' No se ha podido guardar el curso'});
			}else{
				res.status(200).send({curso: curso_alumnoStored});
			}
		}
	});
}

function getCursosPorAlumno(req, res){
	var alumnoId = req.params.alumno;

	if(!alumnoId){
		var find = Curso_Alumno.find({}).populate('curso').populate('alumno').sort({ano:-1});
	}else{
		//Sacar todos los cursos por un alumno
		var find= Curso.find({alumno: alumnoId}).populate('curso').sort({ano:-1});
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

function getAlumnosPorCurso(req, res){
	var cursoId = req.params.curso;

	if(!cursoId){
		var find = Curso_Alumno.find({}).populate('curso').populate('alumno').sort({ano:-1});
	}else{
		//Sacar los alumnos de un curso determinado
		var find= Curso.find({curso: cursoId}).populate('alumno').sort({ano:-1});
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

module.exports={
	saveCursoAlumno,
	getCursosPorAlumno,
	getAlumnosPorCurso
}