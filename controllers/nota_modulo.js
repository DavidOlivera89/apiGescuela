'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Alumno = require('../models/alumno');
var Modulo = require('../models/modulo');
var Nota_Modulo = require('../models/nota_modulo');

function saveNotaModulo(req, res){
	var nota_modulo = new Nota_Modulo();

	var params = req.body;
	nota_modulo.identificador = params.identificador;
	nota_modulo.tipo_nota = params.tipo_nota;
	nota_modulo.valor = params.valor;
	//nota_modulo.publica = params.publica;
	let mes = params.fecha.substring(5,7);
	let dia= params.fecha.substring(8,10);
	let anio= params.fecha.substring(0,4);
	nota_modulo.fecha= dia + '-'+mes+'-'+anio;
	//nota_modulo.fecha = params.fecha
	nota_modulo.descripcion = params.descripcion;
	nota_modulo.alumno =  params.alumno;
	nota_modulo.modulo = params.modulo;
	nota_modulo.curso=params.curso;

	
	nota_modulo.save((err, nota_moduloStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!nota_moduloStored){
				res.status(404).send({message: ' No se ha podido guardar la nota del alumno en el modulo'});
			}else{
				res.status(200).send({notaModulo: nota_moduloStored});
			}
		}
	});
}

function getNotasModuloPorParametros(req, res){
	var moduloId = req.params.modulo;
	var alumnoId = req.params.alumno;

	console.log(alumnoId);
	if(moduloId && alumnoId){
		//Sacar las notas de una modulo y alumno determinado
		var find= Nota_Modulo.find({modulo: moduloId, alumno: alumnoId}).populate('alumno').populate('modulo').sort({});
	}else{
		if(alumnoId){
			//Sacar las notas de un alumno determinado
			var find = Nota_Modulo.find({alumno: alumnoId}).populate('alumno').populate('modulo').sort({});
		}else{
			var find = Nota_Modulo.find({}).populate('alumno').populate('modulo').sort({});
		}
		
	}

	console.log(find);
	find.exec((err, notas)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!notas){
				res.status(404).send({message: ' no hay notas asignados al alumno o materia para mostrar'});
			}else{
				res.status(200).send({notas});
			}
		}
	});
}

function getNotasModuloPorModuloCurso(req, res){
	//var materiaId = req.params.id;
	var params = req.body;
	
	//buscar aca la materia y luego las coincidencias

	var modulo_id=params.modulo;
	var curso_id=params.curso;
	
	var find= Nota_Modulo.find({modulo: modulo_id, curso: curso_id}).populate('modulo').populate('alumno').populate('materia').sort({identificador:1});
	
	find.exec((err, notas)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!notas){
				res.status(404).send({message: ' no hay notas'});
			}else{

				var find2= Nota_Modulo.find({modulo: modulo_id, curso: curso_id, identificador: 'CALIFICACION FINAL'}).populate('modulo').populate('alumno').populate('materia').sort({identificador:1});
	
					find2.exec((err, notasFinales)=>{
						if(err){
							res.status(500).send({message: 'Error en la peticion'});
						}else{
							if(!notas){
								res.status(404).send({message: ' no hay notas'});
							}else{
								res.status(200).send({notas, notasFinales});
								//console.log(cursos.ano);
							}
						}
					});
				
				//console.log(cursos.ano);
			}
		}
	});
}


function getNotasModuloPorModulo(req, res){
	var moduloId= req.params.id;

	// console.log("llega al servidor - getNotasModuloPoModulo");
	// console.log("llego este Id" + moduloId);
	if(!moduloId){
	
		//var find= Nota_Materia.find({}).sort('fecha');
	
	}else{
		var find= Nota_Modulo.find({modulo:moduloId}).sort('updatedAt');
	}

	find.populate('alumno').sort({'updatedAt':1}).exec(function(err, notas){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!notas){
				console.log("NO HAY NOTAS");
				res.status(404).send({message: 'Noo hay notas'});
			}else{
				res.status(200).send({notas});
			}
		}
	});
}

function getNotaModuloPorAlumnoYModulo(req, res){
	var nota_modulo = new Nota_Modulo();

	var params = req.body;
	
	nota_modulo.alumno =  params.alumno;
	nota_modulo.modulo = params.modulo;

	console.log(params);
	var find = Nota_Modulo.find({modulo: nota_modulo.modulo, alumno: nota_modulo.alumno}).populate('alumno').populate('modulo').sort({});


	find.exec((err, notasModulos)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!notasModulos){
				res.status(404).send({message: ' No se ha podido guardar la nota del alumno en la materia'});
			}else{
				res.status(200).send({notasModulos: notasModulos});
			}
		}
	});
}

function getNotaModulo(req, res){
	var notaModuloId= req.params.id;

	var find= Nota_Modulo.findOne({_id:notaModuloId});
	

	find.populate('alumno').populate('modulo').populate('curso').exec(function(err, nota){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!nota){
				console.log("NO HAY NOTAS");
				res.status(404).send({message: 'No hay notas'});
			}else{
				res.status(200).send({nota});
			}
		}
	});
}

function updateNotaModulo(req, res){
	var notaModuloId = req.params.id;
	var update = req.body;

	var notaModulo = new Nota_Modulo();
	console.log("este es el update");
	console.log(update);
	notaModulo = update;
	let mes = update.fecha.substring(5,7);
	let dia= update.fecha.substring(8,10);
	let anio= update.fecha.substring(0,4);
	notaModulo.fecha= dia + '-'+mes+'-'+anio;
	notaModulo.curso = notaModulo.alumno.ultimoCurso;
	
			Nota_Modulo.findByIdAndUpdate(notaModuloId, notaModulo, (err, notaModuloUpdated) => {
				if(err){
					res.status(500).send({message: 'Error al actualizar la materia'});
				}else{
					if(!notaModuloUpdated){
						res.status(404).send({message: 'No se ha podido actualizar la nota '});
					}else{
						res.status(200).send({notaModulo: notaModuloUpdated, message: 'La nota se ha actualizado correctamente'});
					}
				}
			});

		
	}

function deleteNotaModulo(req, res){
	var notaId = req.params.id;
	
	Nota_Modulo.findByIdAndRemove(notaId, (err, notaRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!notaRemoved){
				res.status(404).send({message: 'No se ha podido borrar la nota'});
			}else{
				res.status(200).send({nota: notaRemoved, message:"La nota ha sido borrado"});
			}
		}
	});

}





module.exports={
	saveNotaModulo,
	getNotasModuloPorParametros,
	getNotasModuloPorModuloCurso,
	getNotasModuloPorModulo,
	getNotaModuloPorAlumnoYModulo,
	getNotaModulo,
	updateNotaModulo,
	deleteNotaModulo
}