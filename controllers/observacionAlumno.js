'use strict'
var fs= require('fs');
var path= require('path');

var bcrypt = require('bcrypt-nodejs');
var Alumno = require('../models/alumno');
var Docente = require('../models/docente');
var ObservacionAlumno = require('../models/observacionAlumno');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de observacion de Alumnos del api rest con Node y Mongodb'

	})
}

function saveObservacionAlumno(req, res){
	var observacionAlumno= new ObservacionAlumno();

	var params= req.body;
	let mes = params.fecha.substring(5,7);
	let dia= params.fecha.substring(8,10);
	let anio= params.fecha.substring(0,4);
	observacionAlumno.fecha= dia + '-'+mes+'-'+anio;
	//observacionAlumno.fecha = params.fecha;
	observacionAlumno.hora = params.hora;
	observacionAlumno.descripcion = params.descripcion;
	observacionAlumno.docente_observador = params.docente_observador;
	observacionAlumno.alumno_observado = params.alumno_observado;
	
	observacionAlumno.save((err, observacionStored)=>{
		if(err){
			res.status(500).send({message:'Error al guardar la observacion'});
		}else{
			if(!observacionStored){
				res.status(404).send({message:'La observacion no ha sido guardado'});
			}else{
				res.status(200).send({observacionAlumno: observacionStored});
			}
		}
	});
}

function getAllObservacionesAlumno(req, res){
	
		var find = ObservacionAlumno.find({});
		console.log(find);
	
	find.exec((err, observacionesAlumno)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!observacionesAlumno){
				res.status(404).send({message: ' No hay observaciones de Alumnos'});
			}else{
				res.status(200).send({observacionesAlumno});
			}
		}
	});
	
}

/////////////////////////////////

function getObservacionesPorAlumno(req, res){
	var alumnoId= req.params.alumno;

	if(!alumnoId){
	
			//var find= ObservacionCurso.find({}).sort('fecha');
	
	}else{
		var find= ObservacionAlumno.find({alumno_observado: alumnoId}).sort('fecha');
	}

	find.populate({path:'alumno_observado'}).populate({path:'docente_observador'}).exec(function(err, observaciones){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
		}else{
			if(!observaciones){
				res.status(404).send({message: 'Noo hay observaciones'});
			}else{
				console.log(observaciones);
				res.status(200).send({observaciones});
			}
		}
	});
}


function getObservacionAlumno(req, res){
	var observacionId= req.params.id;

	var find= ObservacionAlumno.findOne({_id:observacionId});
	

	find.populate('alumno_observado').populate('docente_observador').populate('curso').exec(function(err, observacion){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!observacion){
				console.log("NO HAY NOTAS");
				res.status(404).send({message: 'Noo hay notas'});
			}else{
				res.status(200).send({observacion});
			}
		}
	});
}


function deleteObservacionAlumno(req, res){
	var observacionId = req.params.id;
	//console.log("borrando desde el api");
	
		ObservacionAlumno.findByIdAndRemove(observacionId, (err, observacionRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!observacionRemoved){
				res.status(404).send({message: 'No se ha podido borrar la nota'});
			}else{
				res.status(200).send({observacion: observacionRemoved, message:"La nota ha sido borrado"});
			}
		}
		});

	}

function updateObservacionAlumno(req, res){
	var observacionAlumnoId = req.params.id;
	var update = req.body;


	var observacion = new ObservacionAlumno();
	
	observacion = update;
	//var params= req.body;
	let mes = update.fecha.substring(5,7);
	let dia= update.fecha.substring(8,10);
	let anio= update.fecha.substring(0,4);
	observacion.fecha= dia + '-'+mes+'-'+anio;

	
			ObservacionAlumno.findByIdAndUpdate(observacionAlumnoId, observacion, (err, ObservacionUpdated) => {
				if(err){
					res.status(500).send({message: 'Error al actualizar la materia'});
				}else{
					if(!ObservacionUpdated){
						res.status(404).send({message: 'No se ha podido actualizar la observacion'});
					}else{
						res.status(200).send({observacionAlumno: ObservacionUpdated, message: 'La observacion se ha actualizado correctamente'});
					}
				}
			});

		
	}



module.exports = {
	saveObservacionAlumno,
	getAllObservacionesAlumno,
	getObservacionesPorAlumno,
	getObservacionAlumno,
	deleteObservacionAlumno,
	updateObservacionAlumno

};