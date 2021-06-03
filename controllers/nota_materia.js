'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Alumno = require('../models/alumno');
var Materia = require('../models/materia');
var Nota_Materia = require('../models/nota_materia');
var Modulo = require('../models/modulo');
var Nota_Modulo = require('../models/nota_modulo');


function saveNotaMateria(req, res){
	var nota_materia = new Nota_Materia();

	var params = req.body;
	nota_materia.identificador = params.identificador;
	nota_materia.tipo_nota = params.tipo_nota;
	nota_materia.valor = params.valor;
	//nota_materia.publica = params.publica;
	let mes = params.fecha.substring(5,7);
	let dia= params.fecha.substring(8,10);
	let anio= params.fecha.substring(0,4);
	nota_materia.fecha= dia + '-'+mes+'-'+anio;
	//nota_materia.fecha = params.fecha
	nota_materia.descripcion = params.descripcion;
	nota_materia.alumno =  params.alumno;
	nota_materia.materia = params.materia;
	nota_materia.curso=params.curso;

	console.log('estamos aca');
	console.log(params);
	nota_materia.save((err, nota_materiaStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!nota_materiaStored){
				res.status(404).send({message: ' No se ha podido guardar la nota del alumno en la materia'});
			}else{
				res.status(200).send({notaMateria: nota_materiaStored});
			}
		}
	});
}

function getNotaMateriaPorAlumnoYMateria(req, res){
	var nota_materia = new Nota_Materia();

	var params = req.body;
	
	nota_materia.alumno =  params.alumno;
	nota_materia.materia = params.materia;
	console.log('estamos aca');
	console.log(params);
	var find = Nota_Materia.find({materia: nota_materia.materia, alumno: nota_materia.alumno}).populate('alumno').populate('materia').sort({});


	find.exec((err, notasMaterias)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!notasMaterias){
				res.status(404).send({message: ' No se ha podido guardar la nota del alumno en la materia'});
			}else{
				res.status(200).send({notasMaterias: notasMaterias});
			}
		}
	});
}

function getNotasMateriaPorParametros(req, res){
	var materiaId = req.params.materia;
	var alumnoId = req.params.alumno;

	console.log(alumnoId);
	if(materiaId && alumnoId){
		//Sacar las notas de una materia y alumno determinado
		var find= Nota_Materia.find({materia: materiaId, alumno: alumnoId}).populate('alumno').populate('materia').sort({});
	}else{
		if(alumnoId){
			//Sacar las notas de un alumno determinado
			var find = Nota_Materia.find({alumno: alumnoId}).populate('alumno').populate('materia').sort({});
		}else{
			var find = Nota_Materia.find({}).populate('alumno').populate('materia').sort({});
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


function getNotasMateriaPorMateria(req, res){
	var materiaId= req.params.id;

	console.log("llego este Id" + materiaId);
	if(!materiaId){
	
		//var find= Nota_Materia.find({}).sort('fecha');
	
	}else{
		var find= Nota_Materia.find({materia:materiaId}).sort('updatedAt');
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

function getNotasMateriaYModuloPorAlumno(req, res){
	var alumnoId= req.params.id;

	var find= Nota_Materia.find({alumno:alumnoId}).sort('updatedAt');
	

	find.populate('alumno').populate('materia').sort({'updatedAt':1}).exec(function(err, notasMateria){
		if(err){
			res.status(500).send({message:'Error en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!notasMateria){
				console.log("NO HAY NOTAS");
				res.status(404).send({message: 'Noo hay notas'});
			}else{

				var find3= Nota_Materia.find({alumno:alumnoId, identificador:"CALIFICACION FINAL"}).sort('updatedAt');		
				find3.populate('alumno').populate('materia').sort({'updatedAt':1}).exec(function(err, notasMateriaFinal){
					if(err){
						res.status(500).send({message:'Error en la peticion'});
						console.log(" HAY ERROR");
					}else{
						if(!notasMateriaFinal){
							console.log("NO HAY NOTAS");
							res.status(404).send({message: 'Noo hay notas'});
						}else{

							var find2= Nota_Modulo.find({alumno:alumnoId}).sort('updatedAt');
							find2.populate('alumno').populate('modulo').sort({'updatedAt':1}).exec(function(err, notasModulo){
								if(err){
									res.status(500).send({message:'Error en la peticion'});
									console.log(" HAY ERROR");
								}else{
									if(!notasModulo){
										console.log("NO HAY NOTAS");
										res.status(404).send({message: 'Noo hay notas'});
									}else{

										var find4= Nota_Modulo.find({alumno:alumnoId, identificador:"CALIFICACION FINAL"}).sort('updatedAt');		
										find4.populate('alumno').populate('modulo').sort({'updatedAt':1}).exec(function(err, notasModuloFinal){
											if(err){
												res.status(500).send({message:'Error en la peticion'});
												console.log(" HAY ERROR");
											}else{
												if(!notasModuloFinal){
													console.log("NO HAY NOTAS");
													res.status(404).send({message: 'Noo hay notas'});
												}else{
													console.log(notasModuloFinal);
													res.status(200).send({notasModulo, notasMateria, notasMateriaFinal, notasModuloFinal });

												}
											}
										});
									}
								}
							});

						}
					}
				})


			}
		}
	});
}


function getNotasMateriaPorMateriaAlumno(req, res){
	//var materiaId = req.params.id;
	var params = req.body;
	
	//buscar aca la materia y luego las coincidencias

	console.log("el materia que llega es "+params.materia);
	console.log("eñ alumno gregoriano que llega es :"+params.alumno);

	if(params.materia!="" && params.alumno!="" ){
		var find= Nota_Materia.find({materia: params.materia, alumno: params.alumno}).
				populate({materia}).populate({alumno, populate:{curso}}).sort({ano:1, division:1});

	}else{
		if(params.materia!="") {
		var find= Nota_Materia.find({materia: params.materia}).
				populate({materia}).populate({alumno, populate:{curso}}).sort({ano:1, division:1});
	
		}else{
			var find= Nota_Materia.find({alumno: params.alumno}).
				populate({materia}).populate({alumno, populate:{curso}}).sort({ano:1, division:1});
	
		}

	}

	find.exec((err, notas)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!notas){
				res.status(404).send({message: ' no hay notas'});
			}else{
				res.status(200).send({notas});
			}
		}
	});
}

function getNotasMateriaPorMateriaCurso(req, res){
	//var materiaId = req.params.id;
	var params = req.body;
	
	//buscar aca la materia y luego las coincidencias

	console.log("el materia BATANque llega es "+params.materia);
	console.log("eñ curso que BATANllega es :"+params.curso);
	var materia_id=params.materia;
	var curso_id=params.curso;
	
	var find= Nota_Materia.find({materia: materia_id, curso: curso_id}).populate('materia').populate('alumno').populate('curso').sort({identificador:1});
	
	find.exec((err, notas)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!notas){
				res.status(404).send({message: ' no hay notas'});
			}else{

				var find2= Nota_Materia.find({materia: materia_id, curso: curso_id, identificador:'CALIFICACION FINAL'}).populate('materia').populate('alumno').sort({identificador:1});
				
				find2.exec((err, notasFinales)=>{
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!notasFinales){
							res.status(404).send({message: ' no hay notas'});
						}else{
							res.status(200).send({notas, notasFinales});
							//console.log(cursos.ano);
						}
					}
				});

			}
		}
	});
}

function getNotaMateria(req, res){
	var notaMateriaId= req.params.id;

	var find= Nota_Materia.findOne({_id:notaMateriaId});
	

	find.populate('alumno').populate('materia').populate('curso').exec(function(err, nota){
		if(err){
			res.status(500).send({message:'Errir en la peticion'});
			console.log(" HAY ERROR");
		}else{
			if(!nota){
				console.log("NO HAY NOTAS");
				res.status(404).send({message: 'Noo hay notas'});
			}else{
				res.status(200).send({nota});
			}
		}
	});
}

function updateNotaMateria(req, res){
	var notaMateriaId = req.params.id;
	var update = req.body;

	var notaMateria = new Nota_Materia();
	
	notaMateria = update;
	console.log(update);
	let mes = update.fecha.substring(5,7);
	let dia= update.fecha.substring(8,10);
	let anio= update.fecha.substring(0,4);
	notaMateria.fecha= dia + '-'+mes+'-'+anio;
	
	console.log(notaMateria);
	
			Nota_Materia.findByIdAndUpdate(notaMateriaId, notaMateria, (err, notaMateriaUpdated) => {
				if(err){
					res.status(500).send({message: 'Error al actualizar la materia'});
				}else{
					if(!notaMateriaUpdated){
						res.status(404).send({message: 'No se ha podido actualizar la nota '});
					}else{
						res.status(200).send({notaMateria: notaMateriaUpdated, message: 'La nota se ha actualizado correctamente'});
					}
				}
			});

		
	}

	function deleteNotaMateria(req, res){
	var notaId = req.params.id;
	//console.log("borrando desde la api");
	
		Nota_Materia.findByIdAndRemove(notaId, (err, notaRemoved) => {
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
	deleteNotaMateria,
	saveNotaMateria,
	getNotaMateria,
	getNotasMateriaPorParametros,
	getNotasMateriaPorMateria,
	getNotasMateriaPorMateriaAlumno,
	getNotasMateriaPorMateriaCurso,
	getNotaMateriaPorAlumnoYMateria,
	getNotasMateriaYModuloPorAlumno,
	updateNotaMateria
}