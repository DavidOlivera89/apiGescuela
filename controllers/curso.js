'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Curso = require('../models/curso');
var Materia = require('../models/materia');
var Modulo = require ('../models/modulo');
var Alumno = require ('../models/alumno');
var Curso_Alumno = require('../models/curso_alumno');



function saveCurso(req, res){
	var curso = new Curso();

	var params = req.body;
	curso.ano = params.ano;
	curso.division =  params.division;
	curso.ano_gregoriano = params.ano_gregoriano;
	
	if(params.preceptor1){
		curso.preceptor1= params.preceptor1;
	}
	if(params.preceptor2!="" && params.preceptor1!=params.preceptor2){
		curso.preceptor2= params.preceptor2;
	}
	if(params.tutor!=""){
		curso.tutor=params.tutor;

	}

	Curso.findOne({ano: curso.ano, division: curso.division, ano_gregoriano: curso.ano_gregoriano,  },(err, cursoBuscado) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!cursoBuscado){
				console.log("no existe el alumno con ese email");		
			//////////////////////////////
			curso.save((err, cursoStored)=>{
				if(err){
					res.status(500).send({message:'Ocurrio un error en el servidor	'});
				}else{
					if(!cursoStored){
						res.status(404).send({message: ' No se ha podido guardar el curso'});
					}else{
						res.status(200).send({curso: cursoStored});
					}
				}
			});
			///////////////////////////////
		}else{
			console.log(cursoBuscado);
			console.log("ya existe ese alumno");
			var ano= curso.ano;
			var division= curso.division;
			var ano_gregoriano= curso.ano_gregoriano;
			res.status(200).send({ano, division, ano_gregoriano});
		}
	}
});
}


function getCursosAno(ano){
	var anoBuscar = ano;

	if(!anoBuscar){
		console.log("no hay cursos")
	}else{
		var find= Curso.find({ano: anoBuscar});
	}

	find.exec((err, cursos)=>{
		if(err){
			console.log( 'Error en la peticion');
		}else{
			if(!cursos){
				console.log('no hay cursos');
			}else{
				return cursos;
			}
		}
	});
}

function getCursosAlumno(req, res){
	var alumnoId = req.params.alumno;

	if(!alumnoId){
		var find = Curso.find({}).sort({ano:-1});
	}else{
		var find= Curso.find({alumno: alumnoId}).sort({ano:-1});
	}

	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos'});
			}else{
				res.status(200).send({cursos});
			}
		}
	});
}



function getCurso(req, res){
	var cursoId = req.params.id;

	var find = Curso.findById(cursoId).populate('preceptor1').populate('preceptor2').populate('tutor');
	find.exec((err, curso)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!curso){
				res.status(404).send({message: 'El curso no existe'});
			}else{
				
				res.status(200).send({curso});

				}
		}
	});
}


function updateCurso(req, res){
	var cursoId = req.params.id;
	var update = req.body;
	var cursoActual= update;

	if (update.preceptor2==""){
		cursoActual.preceptor2=null;
	}

	console.log(cursoActual);
	Curso.findByIdAndUpdate(cursoId, cursoActual, (err, cursoUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!cursoUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({curso: cursoUpdated});
			}
		}
	});
}


function deleteCurso(req, res){
	var cursoId = req.params.id;
	var find5= Curso_Alumno.findOne({curso: cursoId});
		find5.exec(function(err, cursolin){
			if(err){
			}else{
				if(!cursolin){
					////////////// No quedan alumnos en el curso, se puede borrar
						Curso.findByIdAndRemove(cursoId, (err, cursoRemoved) => {
							if(err){
								res.status(500).send({message: 'Error en el servidor'});
							}else{
								if(!cursoRemoved){
									res.status(404).send({message: 'No se ha podido borrar el curso'});
								}else{
									res.status(200).send({curso: cursoRemoved, message:"El curso ha sido borrado"});
								}
							}
						});

				}else{
					res.status(200).send({message:"No se puede eliminar el curso, ya que posee alumnos."});
							
				}

			}
	});

}


function getCursos(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 12;

	Curso.find().sort({ano_gregoriano:-1, ano: 1, division:1}).paginate(page, itemsPerPage, function(err, cursos, total){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!cursos){
				res.status(404).send({message: 'No hay cursos !!'});
			}else{
				var cantPaginas= Math.ceil(total/itemsPerPage);
				
				return res.status(200).send({
					total_items: total,
					cursos: cursos,
					cantPaginas: cantPaginas
				});
			}
		}
	});
}

function getCursosPorPreceptor(req, res){
	var id = req.params.id;	
	var find= Curso.find({preceptor1: id}).sort({ano_gregoriano:-1, ano: 1, division:1});

	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!cursos){
				res.status(404).send({message: 'No hay cursos !!'});
			}else{
				return res.status(200).send({cursos});
				console.log(cursos);
			}
		}
	});
}


function getTodosLosCursos(req, res){	
	var find= Curso.find({}).sort({ano_gregoriano:-1, ano: 1, division:1});
	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!cursos){
				res.status(404).send({message: 'No hay cursos !!'});
			}else{
				return res.status(200).send({
					cursos: cursos
				});
			}
		}
	});
}


function getAlumnosPorCurso(req, res){
	var find= Curso.find({}).sort({ano_gregoriano:-1, ano: 1, division:1});

	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!cursos){
				res.status(404).send({message: 'No hay cursos !!'});
			}else{
				return res.status(200).send({
					cursos: cursos
				});
			}
		}
	});
}


function getAlumnos_Curso(req, res){
	var curso_id = req.params.id;
	var find= Curso_Alumno.find({curso:curso_id}).populate('alumno', {},{}, {sort: {surname: 1, name: 1}});

	find.exec((err, alumnos)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumnos){
				res.status(404).send({message: 'No hay alumnos !!'});
			}else{
				alumnos.sort(function (a, b) {
					  if (a.surname > b.surname) {
					    return 1;
					  }
					  if (a.surname < b.surname) {
					    return -1;
					  }
					  
					  return 0;
					});

				return res.status(200).send({
					alumnos: alumnos
				});
			}
		}
	});
}


function getCursoMMPorAlumno(req, res){
	var cursoId = req.params.id;
	var cursoB = new Curso();
	var materiasB; 
	var modulosB;

	var find= Curso.findById(cursoId).sort({ano:1, division:1});

	find.exec((err, curso)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!curso){
				res.status(404).send({message: ' no hay cursos'});
			}else{
				var find2= Materia.find({ano: curso.ano, ano_gregoriano: curso.ano_gregoriano});

				find2.exec((err, materias)=>{
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!materias){
							res.status(404).send({message: ' no hay materias'});
						}else{
							
							materiasB=materias;
							var find3= Modulo.find({ano: curso.ano, ano_gregoriano: curso.ano_gregoriano});

							find3.exec((err, modulos)=>{
								if(err){
									res.status(500).send({message: 'Error en la peticion'});
								}else{
									if(!modulos){
										res.status(404).send({message: ' no hay cursos'});
									}else{
										modulosB=modulos;
										var find4= Alumno.find({ultimoCurso: curso._id}).sort({surname:1 , name: 1});


										find4.exec((err, alumnos)=>{
											if(err){
												res.status(500).send({message: 'Error en la peticion'});
											}else{
												if(!alumnos){
													res.status(404).send({message: ' no hay cursos'});
												}else{
													res.status(200).send({curso: curso, materias: materiasB, mnodulos: modulosB, alumnos: alumnos});
												}
											}
										});
									}
								}
							});
						}
					}
				});

			}
		}
	});
}


function getCursosPorMateria(req, res){
	var materiaId = req.params.id;
	var params = req.body;

	var find= Curso.find({ano: params.ano_cursado, ano_gregoriano: params.ano_gregoriano}).sort({ano:1, division:1});

	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos'});
			}else{
				res.status(200).send({cursos});
				console.log(cursos);
			}
		}
	});
}


function getCursosPorModulo(req, res){
	var moduloId = req.params.id;
	var params = req.body;
	var materiaBuscada;
	var find1= Materia.findById(params.materia);
	
	find1.exec((err, materia)=>{
		if(err){
			//res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!materia){
			//	res.status(404).send({message: ' no hay cursos'});
		}else{
			var	materiaBuscada = materia;
			console.log("esta es la materia buscada" + materiaBuscada.ano_cursado);
			var find= Curso.find({ano: materiaBuscada.ano_cursado, ano_gregoriano: materiaBuscada.ano_gregoriano}).sort({ano:1, division:1});

			find.exec((err, cursos)=>{
				if(err){
					res.status(500).send({message: 'Error en la peticion'});
				}else{
					if(!cursos){
						res.status(404).send({message: ' no hay cursos'});
					}else{
						res.status(200).send({cursos});
						console.log(cursos);
					}
				}
			});
		}
	}
});	
}


function getCursosPorBusqueda(req, res){
	var materiaId = req.params.id;
	var params = req.body;

	console.log("el año que llega es "+params.ano_cursado);
	console.log("eñ año gregoriano que llega es :"+params.ano_gregoriano);

	var find= Curso.find({ano: {$regex:params.ano, $options:"i"}, division: {$regex:params.division, $options:"i"}, ano_gregoriano: {$regex:params.ano_gregoriano, $options:"i"}}).sort({ano:1, division:1});

	find.exec((err, cursos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos'});
			}else{
				res.status(200).send({cursos});
				console.log(cursos);
			}
		}
	});
}


function getCursosPorrBusqueda(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 16;
	var materiaId = req.params.id;
	var params = req.body;

	Curso.find({ano: {$regex:params.ano, $options:"i"}, division: {$regex:params.division, $options:"i"}, ano_gregoriano: {$regex:params.ano_gregoriano, $options:"i"}}).sort({ano:1, division:1}).paginate(page, itemsPerPage, function(err, cursos, total){

		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!cursos){
				res.status(404).send({message: ' no hay cursos'});
			}else{
				var cantPaginas= Math.ceil(total/itemsPerPage);
				return res.status(200).send({
					cantPaginas: cantPaginas,
					total_items: total,
					cursos: cursos
				});
			}
		}
	});
}


	

module.exports={
	saveCurso,
	getCursosAlumno,
	getCurso,
	getCursos,
	updateCurso,
	deleteCurso,
	getCursosAno,
	getTodosLosCursos,
	getCursosPorMateria,
	getCursosPorModulo,
	getCursosPorPreceptor,
	getCursoMMPorAlumno,
	getAlumnos_Curso,
	getCursosPorBusqueda,
	getCursosPorrBusqueda
}