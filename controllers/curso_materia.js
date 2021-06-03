'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Curso = require('../models/curso');
var Materia = require('../models/materia');
var Curso_Materia = require('../models/curso_materia');


function saveCursoMateria(req, res){
	var curso_materia = new Curso_Materia();

	var params = req.body;
	curso_materia.ano = params.ano;
	curso_materia.curso =  params.curso;
	curso_materia.materia = params.materia;

	
	curso_materia.save((err, curso_materiaStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!curso_materiaStored){
				res.status(404).send({message: ' No se ha podido guardar asignar la materia al curso'});
			}else{
				res.status(200).send({curso: curso_materiaStored});
			}
		}
	});
}

function getCursosPorMateria(req, res){
	var materiaId = req.params.materia;

	if(!materiaId){
		var find = Curso_Materia.find({}).populate('curso').populate('materia').sort({ano:-1});
	}else{
		//Sacar los cursos de una materia 
		var find= Curso.find({materia: materiaId}).populate('curso').sort({ano:-1});
	}


	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: 'no hay cursos ni alumnos asignados para mostrar'});
			}else{
				res.status(200).send({cursos});
			}
		}
	});
}



module.exports={
	saveCursoMateria,
	getCursosPorMateria
	
}