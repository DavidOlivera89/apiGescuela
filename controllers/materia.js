'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var MateriaController = require('../controllers/materia');
var Materia = require('../models/materia');
var ModuloController = require('../controllers/modulo');
var Modulo = require('../models/modulo');
var Curso_Materia = require('../models/curso_materia');
var Curso = require('../models/curso');
var Curso_MateriaController = require('../controllers/curso_materia');
var CursoController = require('../controllers/curso');


function saveMateria(req, res){
	var materia = new Materia();
	var curso = new Curso();

	var params = req.body;
	materia.nombre = params.nombre;
	materia.ano_cursado =  params.ano_cursado;
	materia.ano_gregoriano = params.ano_gregoriano;
	materia.horarios = params.horarios;
	materia.planificacion = params.planificacion;
	materia.bibliografia = params.bibliografia;
	
	if(params.profesor1){
		materia.profesor1= params.profesor1;
	}
	if(params.profesor2!="" && params.profesor1!=params.profesor2){
		materia.profesor2=params.profesor2;
	}	

	materia.save((err, materiaStored)=>{
		if(err){
			res.status(500).send({message:'Ocurrio un error en el servidor	'});
		}else{
			if(!materiaStored){
				res.status(404).send({message: ' No se ha podido guardar la materia'});
			}else{
				res.status(200).send({materia: materiaStored});
				
			}
		}
	});
}




function getMateria(req, res){
	var materiaId = req.params.id;

	Materia.findById(materiaId).populate('profesor1').populate('profesor2').exec((err, materia)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!materia){
				res.status(404).send({message: 'La materia no existe.'});
			}else{
				res.status(200).send({materia});
			}
		}
	});
}

function updateMateria(req, res){
	var materiaId = req.params.id;
	var update = req.body;
	var materia = new Materia();
	
	materia = update;
	
	if (update.profesor2==""){
		materia.profesor2=null;
	}

	console.log(materia);
	
	Materia.findByIdAndUpdate(materiaId, materia, (err, materiaUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar la materia'});
		}else{
			if(!materiaUpdated){
				res.status(404).send({message: 'No se ha podido actualizar la materia'});
			}else{
				res.status(200).send({materia: materiaUpdated, message: 'La materia se ha actualizado correctamente'});
			}
		}
	});


}

function getMateriasModulos(req, res){

	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 9;


	Materia.find().sort({ano_cursado:1}).populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, materias, totalMaterias){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!materias){
				res.status(404).send({message: ' no hay materias'});
			}else{
				Modulo.find().sort({ano_cursado:1}).populate('materia').populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, modulos, totalModulos){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!modulos){
							res.status(404).send({message: ' no hay modulos'});
						}else{ 

							if(totalMaterias>=totalModulos){
								var mayorTotal= totalMaterias;
							}else{
								var mayorTotal=totalModulos;
							}
							var cantPaginas= Math.ceil(mayorTotal/itemsPerPage);
							res.status(200).send({materias, modulos, totalMaterias:totalMaterias, totalModulos: totalModulos, cantPaginas});
							
						}
					}
				});			
			}
		}
	});
}
	

function getMateriasYModulosPorrBusqueda(req, res){
	var materia = new Materia();
	var params = req.body;

	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 16;

	Materia.find({nombre: {$regex:params.nombre, $options:"i"}, ano_cursado: {$regex:params.ano_cursado, $options:"i"}}).sort({ano_cursado:1}).populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, materias, totalMaterias){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});

		}else{
			Modulo.find({nombre: {$regex:params.nombre, $options:"i"}, ano_cursado: {$regex:params.ano_cursado, $options:"i"}}).sort({ano_cursado:1}).populate('materia').populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, modulos, totalModulos){
				if(err){
					res.status(500).send({message: 'Error en la peticion'});
				}else{

					if(totalMaterias>=totalModulos){
						var mayorTotal= totalMaterias;
					}else{
						var mayorTotal=totalModulos;
					}
					var cantPaginas= Math.ceil(mayorTotal/itemsPerPage);
					res.status(200).send({materias, modulos, totalMaterias:totalMaterias, totalModulos: totalModulos, cantPaginas});							
				}
			});	
		}
	});
}
	

function getMateriasYModulosPorBusqueda(req, res){
	var materia = new Materia();
	var params = req.body;
	materia.nombre = params.nombre;
	
	materia.ano_cursado = params.ano_cursado;

	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 20;

	if(materia.ano_cursado==""){
		Materia.find({nombre: {$regex:materia.nombre, $options:"i"}}).sort({ano_cursado:1}).populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, materias, total){
			if(err){
				res.status(500).send({message: 'Error en la peticion'});

			}else{
				Modulo.find({nombre: {$regex:materia.nombre, $options:"i"}}).sort({ano_cursado:1}).populate('materia').populate('profesor1').populate('profesor2').paginate(page, itemsPerPage, function(err, modulos, total){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!modulos){
							res.status(404).send({message: ' no hay modulos'});
						}else{ 
							res.status(200).send({materias, modulos, total_items:total});
							
						}
					}
				});	

			}
		});
	}else{
		Materia.find({nombre: {$regex:materia.nombre, $options:"i"}, ano_cursado:materia.ano_cursado}).sort({ano_cursado:1}).paginate(page, itemsPerPage, function(err, materias, total){
			if(err){
				res.status(500).send({message: 'Error en la peticion'});

			}else{
				Modulo.find({nombre: {$regex:materia.nombre, $options:"i"}, ano_cursado:materia.ano_cursado}).sort({ano_cursado:1}).populate('materia').paginate(page, itemsPerPage, function(err, modulos, total){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!modulos){
							res.status(404).send({message: ' no hay modulos'});
						}else{ 
							res.status(200).send({materias, modulos, total_items:total});

						}
					}
				});	
			}
		});
	}
}


function getMateriasYModulosPorCurso(req, res){
	var curso = new Curso();

	var params = req.body;
	curso.ano = params.ano;
	curso.ano_gregoriano = params.ano_gregoriano;

	var find= Materia.find({ano_cursado: curso.ano, ano_gregoriano: curso.ano_gregoriano}).populate('profesor1').populate('profesor2').sort('nombre');

	find.exec(function(err, materias){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!materias){
				res.status(404).send({message: 'El alumno no existe'});
			}else{
				var find2 = Modulo.find({ano_cursado: curso.ano, ano_gregoriano: curso.ano_gregoriano}).populate('profesor1').populate('profesor2').sort('nombre');

				find2.exec(function(err, modulos){	if(err){
					res.status(500).send({message: 'Error en la peticion'});
				}else{
					if(!modulos){
						res.status(404).send({message: ' no hay modulos'});
					}else{ 

						res.status(200).send({materias, modulos});
					}
				}
			});	
			}
		}
	});			
}


function deleteMateria(req, res){
	var materiaId = req.params.id;
	var find= Modulo.findOne({materia: materiaId});
	find.exec(function(err, modulo){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(modulo){
				res.status(200).send({message: 'No es posible eliminar la materia ya que posee un modulo'});
			}else{

				Materia.findByIdAndRemove(materiaId, (err, materiaRemoved) => {
					if(err){
						res.status(500).send({message: 'Error en el servidor'});
					}else{
						if(!materiaRemoved){
							res.status(404).send({message: 'No se ha podido borrar la materia'});
						}else{
							res.status(200).send({materia: materiaRemoved, message:"La materia ha sido borrado"});
						}
					}
				});

			}
		}
	});
}


function getTodasMateriasYModulos(req, res){
	var find= Materia.find().sort({ano_cursado:1}).populate('profesor1').populate('profesor2').sort('ano_cursado');
	find.exec(function(err, materias){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!materias){
				res.status(404).send({message: ' no hay materias'});
			}else{
				var find2= Modulo.find().sort({ano_cursado:1}).populate('materia').populate('profesor1').populate('profesor2').sort('ano_cursado');
				find2.exec(function(err, modulos){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!modulos){
							res.status(404).send({message: ' no hay modulos'});
						}else{ 
							res.status(200).send({materias, modulos});
						}
					}
				});					
			}
		}
	});
}


module.exports={
	saveMateria,
	getMateriasModulos,
	getMateria,
	updateMateria,
	getMateriasYModulosPorCurso,
	getMateriasYModulosPorBusqueda,
	getTodasMateriasYModulos,
	deleteMateria,
	getMateriasYModulosPorrBusqueda
}