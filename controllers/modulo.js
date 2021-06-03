'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Modulo = require('../models/modulo');
var Materia = require('../models/materia');

function saveModulo(req, res){
	var modulo = new Modulo();
	var materiaEncontrada = new Materia();
	console.log("llego al controlador modulo");
	var params = req.body;
	
	modulo.nombre = params.nombre;
	modulo.horarios = params.horarios;
	modulo.planificacion = params.planificacion;
	modulo.bibliografia = params.bibliografia;
	modulo.materia = params.materia;

	if(params.profesor1){
		modulo.profesor1= params.profesor1;
	}
	if(params.profesor2!="" && params.profesor1!=params.profesor2){
		modulo.profesor2=params.profesor2;
	}	
	console.log("modulo nuevo tiene..."+ modulo);
	Materia.findById(params.materia).exec((err, materia)=>{
		if(err){
			//res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!materia){
				//res.status(404).send({message: 'La materia no existe.'});
			}else{
				//res.status(200).send({materia});
				console.log("este es el modulo nombre "+modulo.nombre);
				console.log(materia.nombre+materia.ano_cursado);
				modulo.ano_cursado=materia.ano_cursado;
				modulo.ano_gregoriano= materia.ano_gregoriano;

				modulo.save((err, moduloStored)=>{
					if(err){
						res.status(500).send({message:'Ocurrio un error en el servidor	'});
					}else{
						if(!moduloStored){
							res.status(404).send({message: ' No se ha podido guardar la modulo'});
						}else{
							res.status(200).send({modulo: moduloStored, message: 'Se ha creado el modulo con exito'});
						}
					}
				});
			}
		}
	});

	
}

	function deleteModulo(req, res){
	var moduloId = req.params.id;
	//console.log("borrando desde el api");
	
		Modulo.findByIdAndRemove(moduloId, (err, moduloRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!moduloRemoved){
				res.status(404).send({message: 'No se ha podido borrar el modulo'});
			}else{
				res.status(200).send({modulo: moduloRemoved, message:"El modulo ha sido borrado"});
			}
		}
		});

	}

function getModulos(req, res){

	var materiaId = req.params.materia;

	console.log("la materia que llega es "+ materiaId);
	if(!materiaId){
		// Sacar todos los modulo de la bd
		var find = Modulo.find({}).sort('nombre');
	}else{
		// Sacar los modulo de una materia determinada
		var find = Modulo.find({materia: materiaId}).sort('nombre');
	}

	find.populate({path: 'materia'}).populate('profesor1').populate('profesor2').exec((err, modulos) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!modulos){
				res.status(404).send({message: 'No hay modulos'});
			}else{
				console.log("los cursetes" + modulos);
				res.status(200).send({modulos});
			}
		}
	});
}

function getModulo(req, res){
	var moduloId = req.params.id;
	console.log("ingresa a getmoduloooo" + moduloId);

	Modulo.findById(moduloId).populate('materia').populate('profesor1').populate('profesor2').exec((err, modulo)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
			console.log("hay error");
		}else{
			if(!modulo){

				res.status(404).send({message: 'El modulo no existe.'});
			}else{
				Materia.findById(modulo.materia).exec((err, materia)=>{
					if(err){
						res.status(500).send({message: 'Error en la petición'});
					}else{
						if(!materia){

							res.status(404).send({message: 'La materia no existe.'});
						}else{
							
							res.status(200).send({modulo});
							console.log("este es el modulo batman" +modulo);
						}
					}

				});
			}
		}
	});
}


function updateModulo(req, res){
	var moduloId = req.params.id;
	var update = req.body;
	var modulo = new Modulo();
	
	modulo = update;
	
	if (update.profesor2==""){
		modulo.profesor2=null;
	}
	
			Modulo.findByIdAndUpdate(moduloId, modulo, (err, moduloUpdated) => {
				if(err){
					res.status(500).send({message: 'Error al actualizar la materia'});
				}else{
					if(!moduloUpdated){
						res.status(404).send({message: 'No se ha podido actualizar la materia'});
					}else{
						res.status(200).send({modulo: moduloUpdated, message: 'El modulo se ha actualizado correctamente'});
					}
				}
			});

		
	}


module.exports={
	saveModulo,
	getModulos,
	getModulo,
	updateModulo,
	deleteModulo
}