'use strict'
var fs= require('fs');
var path= require('path');

var bcrypt = require('bcrypt-nodejs');
var Curso = require('../models/curso');
var Docente = require('../models/docente');
var ObservacionCurso = require('../models/observacionCurso');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de observacion de Cursos del api rest con Node y Mongodb'

	})
}

function saveObservacionCurso(req, res){
	var observacionCurso= new ObservacionCurso();

	var params= req.body;
	let mes = params.fecha.substring(5,7);
	let dia= params.fecha.substring(8,10);
	let anio= params.fecha.substring(0,4);
	observacionCurso.fecha= dia + '-'+mes+'-'+anio;
	//observacionCurso.fecha = params.fecha;
	observacionCurso.hora = params.hora;
	observacionCurso.descripcion = params.descripcion;
	observacionCurso.docente_observador = params.docente_observador;
	observacionCurso.curso_observado = params.curso_observado;

	observacionCurso.save((err, observacionStored)=>{
		if(err){
			res.status(500).send({message:'Error al guardar la observacion'});
		}else{
			if(!observacionStored){
				res.status(404).send({message:'La observacion no ha sido guardado'});
			}else{
				res.status(200).send({observacionCurso: observacionStored});
			}
		}
	});
}

function getAllObservacionesCurso(req, res){
	
		var find = ObservacionCurso.find({});
		console.log(find);
	
	find.exec((err, observacionesCurso)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!observacionesCurso){
				res.status(404).send({message: ' No hay observaciones de Cursos'});
			}else{
				res.status(200).send({observacionesCurso});
			}
		}
	});
	
}

/////////////////////////////////

function getObservacionesPorCurso(req, res){
	var cursoId= req.params.id;

	console.log("llego este Id" + cursoId);
	if(!cursoId){
	
		var find= ObservacionCurso.find({}).sort('fecha');
	
	}else{
		var find= ObservacionCurso.find({curso_observado:cursoId}).sort('fecha');
	}

	find.populate({path:'curso_observado'}).populate('docente_observador').sort({'updatedAt':1}).exec(function(err, observaciones){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
		}else{
			if(!observaciones){
				res.status(404).send({message: 'Noo hay observaciones'});
			}else{
				res.status(200).send({observaciones});
			}
		}
	});
}


function getObservacionCurso(req, res){
	var observacionId= req.params.id;

	var find= ObservacionCurso.findOne({_id:observacionId});
	

	find.populate('curso_observado').populate('docente_observador').populate('curso').exec(function(err, observacion){
		if(err){
			res.status(500).send({message:'Error en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!observacion){
				console.log("NO HAY OBSERVACIONES");
				res.status(404).send({message: 'Noo hay observaciones'});
			}else{
				res.status(200).send({observacion});
			}
		}
	});
}


function deleteObservacionCurso(req, res){
	var observacionId = req.params.id;
	//console.log("borrando desde el api");
		console.log("llega al delete")
		ObservacionCurso.findByIdAndRemove(observacionId, (err, observacionRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!observacionRemoved){
				res.status(404).send({message: 'No se ha podido borrar la nota'});
			}else{
				res.status(200).send({observacion: observacionRemoved, message:"La observación ha sido borrado"});
			}
		}
		});

	}

function updateObservacionCurso(req, res){
	var observacionCursoId = req.params.id;
	var update = req.body;


	var observacion = new ObservacionCurso();
	
	observacion = update;
	//var params= req.body;
	let mes = update.fecha.substring(5,7);
	let dia= update.fecha.substring(8,10);
	let anio= update.fecha.substring(0,4);
	observacion.fecha= dia + '-'+mes+'-'+anio;

	
			ObservacionCurso.findByIdAndUpdate(observacionCursoId, observacion, (err, ObservacionUpdated) => {
				if(err){
					res.status(500).send({message: 'Error al actualizar la materia'});
				}else{
					if(!ObservacionUpdated){
						res.status(404).send({message: 'No se ha podido actualizar la observacion'});
					}else{
						res.status(200).send({observacionCurso: ObservacionUpdated, message: 'La observacion se ha actualizado correctamente'});
					}
				}
			});

		
	}




module.exports = {
	saveObservacionCurso,
	getAllObservacionesCurso,
	getObservacionesPorCurso,
	getObservacionCurso,
	deleteObservacionCurso,
	updateObservacionCurso

};