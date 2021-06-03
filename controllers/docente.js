'use strict'
var fs= require('fs');
var path= require('path');

var bcrypt = require('bcrypt-nodejs');
var Docente = require('../models/docente');
var Alumno = require('../models/alumno');
var User = require('../models/user');
var jwt = require('../services/jwt');
var Materia = require('../models/materia');
var Modulo = require('../models/modulo');
var Curso = require('../models/curso');

function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de alumno del api rest con Node y Mongodb'

	})
}

function getDocentes(req, res){
		if(req.params.page){
			var page = req.params.page;
		}else{
			var page = 1;
		}

		var itemsPerPage = 12;

		Docente.find().sort({surname:1}).paginate(page, itemsPerPage, function(err, docentes, total){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!docentes){
				res.status(404).send({message: 'No hay docentes !!'});
			}else{
				return res.status(200).send({
					total_items: total,
					docentes: docentes
				});
			}
		}
	});
	
}

function getTodosLosProfesores(req, res){
	var find= Docente.find({profesor:'true'}).sort({surname:1});

	find.exec((err, profesores)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!profesores){
				res.status(404).send({message: 'No hay profesores !!'});
			}else{
				return res.status(200).send({
					profesores: profesores
				});
			}
		}
	});
	
}

function getTodosLosPreceptores(req, res){
	var find= Docente.find({preceptor:'true'}).sort({surname:1});

	find.exec((err, preceptores)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!preceptores){
				res.status(404).send({message: 'No hay preceptores !!'});
			}else{
				return res.status(200).send({
					preceptores: preceptores
				});
			}
		}
	});
	
}

function getTodosLosTutores(req, res){
	var find= Docente.find({tutor:'true'}).sort({surname:1});

	find.exec((err, tutores)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!tutores){
				res.status(404).send({message: 'No hay tutores !!'});
			}else{
				return res.status(200).send({
					tutores: tutores
				});
			}
		}
	});
	
}


function saveDocente(req, res){
	var docente = new Docente();
	var params = req.body;

	console.log(params);
	
	docente.name = params.name;
	docente.surname = params.surname;
	docente.email = params.email.toLowerCase();

	if (!params.image){
		docente.image ="imagenDocentePorDefecto.jpg";
	}else {
		docente.image = params.image;
	};

	if (!params.tutor && !params.profesor && !params.preceptor){
		res.status(200).send({message: 'Error al guardar el usuario, debe elegir al menos una función como docente: tutor, preceptor o profesor'});

	}

	docente.alumno = false;

	let mes = params.fecha_nacimiento.substring(5,7);
	let dia= params.fecha_nacimiento.substring(8,10);
	let anio= params.fecha_nacimiento.substring(0,4);
	docente.fecha_nacimiento= dia + '-'+mes+'-'+anio;
	
	docente.n_dni = params.n_dni;
	docente.telefono = params.telefono;
	docente.tutor= params.tutor;
	docente.profesor= params.profesor;
	docente.preceptor= params.preceptor;

	Docente.findOne({n_dni: docente.n_dni },(err, docenteBuscado) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!docenteBuscado){
				console.log("no existe el docente con ese dni");
//////////////////////////////////////////////////////////////////////////////
			Docente.findOne({email: docente.email },(err, docenteBuscado) => {
				if(err){
					res.status(500).send({message: 'Error en la petición.'});
				}else{
					if(!docenteBuscado){
						console.log("no existe el docente con ese email");
							//////////////////////////////////////////////////////////////////////
							if(params.password){
										//Encriptar contraseña y guardar datos
										bcrypt.hash(params.password, null, null, function(err, hash){
											docente.password = hash;
											if(docente.name != null && docente.surname != null && docente.email !=null){
												//guardar el usuario
												docente.save((err, docenteStored)=>{
													if(err){
														res.status(500).send({message: 'Error al guardar el docente'});
													}else{
														if(!docenteStored){
															res.status(404).send({message: 'No se ha registrado el docente'});

														}else{
															res.status(200).send({docente: docenteStored, message:'El docente se ha creado correctamente'});
														}

													}
												})
											}else{
												//
												res.status(200).send({message:'Introduce la contraseña'});

											}
										});
									}else{
										res.status(200).send({message:'Introduce la contraseña'});

									}
						//////////////////////////////////////////////////////////////////////////////////////
					}else{
						console.log(docenteBuscado);
						console.log("ya existe ese docente");
						res.status(200).send({message: 'Error al guardar el usuario, YA EXISTE REGISTRADO UN DOCENTE CON EL EMAIL INGRESADO'+' '+docenteBuscado.email});

					}
				}
			});
		///////////////////////////////////////////////////////////

		}else{
			console.log(docenteBuscado);
			console.log("ya existe ese docente");
			res.status(200).send({message: 'Error al guardar el usuario, YA EXISTE REGISTRADO UN DOCENTE CON EL DNI INGRESADO'+' '+docenteBuscado.n_dni});
		}
	}
	});
}


function loginDocente(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	Docente.findOne({email: email.toLowerCase()}, (err, docente) =>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!docente){
				res.status(404).send({message:'El docente no existe'})
			}else{
				//Comprobar la contraseña
				bcrypt.compare(password, docente.password, function(err, check){
					if(check){
						//devolver los datos del usuario logueado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(docente)
							})
						}else{
							res.status(200).send({docente});
						}
					}else{
						res.status(404).send({message: 'El alumno no ha podido loguearse'});
					}
				});
			}
		}
	});
}


function updateDocente(req, res){
	var userId = req.params.id;
	var update = req.body;

	var docente = new Alumno();
	
	console.log(update);

	if (update.tutor==false && update.profesor==false && update.preceptor==false){
	res.status(200).send({message: 'Error al guardar el usuario, debe elegir al menos una función como docente: tutor, preceptor o profesor'});
	}else{
	docente = update;

	let mes = update.fecha_nacimiento.substring(5,7);
	let dia= update.fecha_nacimiento.substring(8,10);
	let anio= update.fecha_nacimiento.substring(0,4);
	docente.fecha_nacimiento= dia + '-'+mes+'-'+anio;
	
	var find = Docente.findById(docente._id);
	find.exec(function(err, docenter) {
		if(err){
		}else{		
			console.log("clave actual es:"+ docenter.password);
			console.log("la clave que vino" + docente.password);

			if(update.password==docenter.password){
				console.log("no entra al hash");
				Docente.findByIdAndUpdate(userId, docente, (err, userUpdated) => {
					if(err){
						res.status(500).send({message: 'Error al actualizar el usuario'});
					}else{
						if(!userUpdated){
							res.status(404).send({message: 'No se ha podido actualizar el usuario'});
						}else{
							res.status(200).send({docente: userUpdated, message: 'El docente se ha actualizado correctamente'});
						}
					}
				});

			}else{

				console.log("la clave del update "+update.password);
				bcrypt.hash(update.password, null, null, function(err, hash){
					docente.password = hash;
					Docente.findByIdAndUpdate(userId, docente, (err, userUpdated) => {
						if(err){
							res.status(500).send({message: 'Error al actualizar el usuario'});
						}else{
							if(!userUpdated){
								res.status(404).send({message: 'No se ha podido actualizar el usuario'});
							}else{
								res.status(200).send({docente: userUpdated, message: 'El docente se ha actualizado correctamente'});
							}
						}
					});

				});
			};

		}
	});

	}
}


function updateClaveDocente(req, res){
	var userId = req.params.id;
	var clave = req.body;

	
	if ((!clave.nueva) || (clave.reingresanueva == "")){
		res.status(200).send({message: 'La clave nueva es incorrecta'});

	}else{

	bcrypt.compare(clave.actual, clave.identityClave, function(err, check){
			if(!check){
				res.status(200).send({message: 'La clave actual que ha ingresado no es correcta'});
				
			}else{
				if(clave.nueva == clave.reingresanueva){
					bcrypt.hash(clave.reingresanueva, null, null, function(err, hash){
						
						Docente.findById(clave.id, (err, docente) => {
							if(err){
								res.status(500).send({message: 'No se ha podido actualizar el usuario por un problema en el servidor.'});
							}else{
								if(!docente){
									res.status(404).send({message: 'El docente no existe, no se puede actualizar el usuario'});
								}else{									
									docente.password = hash;									
									console.log(docente);
									Docente.findByIdAndUpdate(docente._id, docente, (err, userUpdated) => {
										if(err){
											res.status(500).send({message: 'No se ha podido actualizar el usuario por un problema en el servidor.'});
										}else{
											if(!userUpdated){
												res.status(404).send({message: 'No se ha podido actualizar el usuario'});
											}else{
												res.status(200).send({usuario: userUpdated});
											}
										}
									});
								}
							}
						});							
					});
				}
				else{
					res.status(200).send({message: 'La clave nueva y su reingreso no coinciden'});
				}	}
			});
		}
	console.log(clave);
}


function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files){
		var file_path = req.files.image.path;
		//windows
		var file_split = file_path.split('\\');

		//Linux o Mac rutas:
		//var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext=='jpg' || file_ext == 'gif'){
			Docente.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});
		}else{
			res.status(200).send({user: userUpdated});
		}
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageDocente(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/docentes/'+imageFile;
	fs.exists(path_file, function(exists){
		if (exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

function getImageEscuela(req, res){
	//var imageFile = req.params.imageFile;
	var path_file = './uploads/docentes/'+"imagenEscuela.png";
	fs.exists(path_file, function(exists){
		if (exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


function deleteDocente(req, res){
	var docenteId = req.params.id;
	console.log(docenteId);
	var sepuedeborrar=false;
	//console.log("borrando docente desde el api");
	var find= Materia.findOne({$or:[{profesor1:docenteId}, {profesor2:docenteId}]});
	find.exec((err, materia)=>{
		if(err){
			console.log("error en materia");
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(materia){
				return res.status(200).send({
					message: "No se puede borrar el docente ya que posee materias a cargo"
				});
			}else{
				
				var find2= Modulo.findOne({$or:[{profesor1:docenteId}, {profesor2:docenteId}]});
				find2.exec((err, modulo)=>{
					if(err){
						console.log("error en modulo");

						res.status(500).send({message: 'Error en la petición.'});
					}else{
						if(modulo){
							return res.status(200).send({
								message: "No se puede borrar el docente ya que posee modulos a cargo"
							});
						}else{
							
							var find3= Curso.findOne({$or:[{preceptor1:docenteId}, {preceptor2:docenteId}]});
							find3.exec((err, cursos)=>{
								if(err){
									console.log("error en curso");

									res.status(500).send({message: 'Error en la petición.'});
								}else{
									if(cursos){
										return res.status(200).send({
											message: "No se puede borrar el docente ya que es preceptor de un curso"
										});
									}else{

										var find4= Curso.findOne({tutor:docenteId});
										find4.exec((err, cursos)=>{
											if(err){
												console.log("error en tutor");

												res.status(500).send({message: 'Error en la petición.'});
											}else{
												if(cursos){
													return res.status(200).send({
														message: "No se puede borrar el docente ya que es preceptor de un curso"
													});
												}else{

													Docente.findByIdAndRemove(docenteId, (err, docenteRemoved) => {
														if(err){
															res.status(500).send({message: 'Error en el servidor'});
															console.log("aqui esta docente delete")
														}else{
															if(!docenteRemoved){
																res.status(404).send({message: 'No se ha podido borrar el docente'});
															}else{
																res.status(200).send({docente: docenteRemoved, message:"El docente ha sido borrado"});
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
		}
	});

}


function getDocente(req, res){
	var docenteId = req.params.id;

		Docente.findById(docenteId, (err, docente) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!docente){
				res.status(404).send({message: 'El docente no existe'});
			}else{
				res.status(200).send({docente});
			}
		}
	});
}
	


function getMateriasModulosCursosDeDocente(req, res){
	var docente = new Docente();

	var params = req.body;
	console.log("ingreso a docente controler");
	docente._id= params._id
	docente.name = params.name;
	docente.surname = params.surname;
	docente.email = params.email;
	docente.image = docente.image;
	docente.alumno = false;
	docente.fecha_nacimiento= params.fecha_nacimiento;
	docente.n_dni = params.n_dni;
	docente.telefono = params.telefono;
	docente.tutor= params.tutor;
	docente.profesor= params.preceptor;
	docente.preceptor= params.profesor;

	var materiasEncontradas;
	var materiasEncontradas1;
	var materiasEncontradas2;
	
	var modulosEncontrados;
	var cursosEncontradosPreceptor;
	var cursosEncontradosTutor;

	Materia.find({$or:[{profesor1:docente._id}, {profesor2:docente._id}]}).sort().exec((err, materias)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!materias){
				materiasEncontradas=null;
			}else{

				materiasEncontradas1= materias;
				console.log("materia 1"+ materiasEncontradas1);

				Materia.find({profesor1:docente._id}).sort().exec((err, materias2)=>{
					if(err){
						res.status(500).send({message: 'Error en la petición.'});
					}else{
						if(!materias2){
							materiasEncontradas=null;
						}else{

							//materiasEncontradas2= materias2;
							console.log("materia 2" +materiasEncontradas2);


							Modulo.find({$or:[{profesor1:docente._id}, {profesor2:docente._id}]}).populate('materia').sort().exec((err, modulo)=>{
								if(err){
									res.status(500).send({message: 'Error en la petición.'});
								}else{
									if(!modulo){
										modulosEncontrados=null;
									}else{
										modulosEncontrados= modulo;


										Curso.find({$or:[{preceptor1:docente._id}, {preceptor2:docente._id}]}).sort().exec((err, cursos)=>{
											if(err){
												res.status(500).send({message: 'Error en la petición.'});
											}else{
												if(!cursos){
													cursosEncontradosPreceptor=null;
												}else{
													cursosEncontradosPreceptor= cursos;

													Curso.find({tutor:docente._id}).sort().exec((err, cursos)=>{
														if(err){
															res.status(500).send({message: 'Error en la petición.'});
														}else{
															if(!cursos){
																cursosEncontradosTutor=null;
															}else{
																cursosEncontradosTutor= cursos;
																materiasEncontradas=materiasEncontradas1.concat(materiasEncontradas2);

																res.status(200).send({materiasEncontradas, modulosEncontrados, cursosEncontradosPreceptor, cursosEncontradosTutor});

															}
														}
													});
												}
											}
										});
									}
								}}
								);
						}
					}
				});
			}
		}
	});
}


function getDocentesPorBusqueda(req, res){
	var params = req.body;

	if(params.curso=="" && params.materia=="" && params.modulo==""){
		var find=Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, profesor:true}).sort({surname:1});
		find.exec(function(err, profesores){
			if(err){
				res.status(500).send({message: 'Error en la peticion'});

			}else{
				var find2= Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, preceptor:true}).sort({surname:1});
				find2.exec(function(err, preceptores){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
						if(!preceptores){
						//	res.status(404).send({message: ' no hay modulos'});
					}else{ 
							//res.status(200).send({profesores, preceptores});
							var find3= Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, tutor:true}).sort({surname:1});
							find3.exec(function(err, tutores){
								if(err){
									res.status(500).send({message: 'Error en la peticion'});
								}else{
									if(!tutores){
											//	res.status(404).send({message: ' no hay modulos'});
										}else{ 
											res.status(200).send({profesores, preceptores, tutores});
											
											}
										}
									});	
						}
					}
				});	
	}
});
	}else{
		if(params.curso!=""){
			var find4= Curso.findById(params.curso).populate('preceptor1').populate('preceptor2').populate('tutor');
			find4.exec(function(err, curso){
				if(err){
					res.status(500).send({message: 'Error en la peticion'});
				}else{
					if(!curso){
						//	res.status(404).send({message: ' no hay modulos'});
					}else{ 
						var preceptores= new Array();						
					}
				}
			});	
		}
	}
}


function getDocentesPorrBusqueda(req, res){
	console.log("entra al porr docentes");

	var docente = new Docente();
	var params = req.body;

	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 16;

		Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, profesor:true}).sort({surname:1}).paginate(page, itemsPerPage, function(err, profesores, totalProfesores){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
	
			}else{
				Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, preceptor:true}).sort({surname:1}).paginate(page, itemsPerPage, function(err, preceptores, totalPreceptores){
					if(err){
						res.status(500).send({message: 'Error en la peticion'});
					}else{
		
						Docente.find({name: {$regex:params.name, $options:"i"}, surname: {$regex:params.surname, $options:"i"}, tutor:true}).sort({surname:1}).paginate(page, itemsPerPage, function(err, tutores, totalTutores){
							if(err){
								res.status(500).send({message: 'Error en la peticion'});
							}else{

							var mayorTotal;
							if(totalProfesores>=totalPreceptores){
								if(totalProfesores>= totalTutores){
									mayorTotal= totalProfesores;
								}else{
									mayorTotal=totalTutores;
								}
								
							}else{
								if(totalPreceptores>=totalTutores){
									mayorTotal= totalPreceptores;
								}else{
									mayorTotal=totalTutores;
								}
								
							}
							var cantPaginas= Math.ceil(mayorTotal/itemsPerPage);

							res.status(200).send({profesores, preceptores, tutores, totalProfesores, totalPreceptores, totalTutores, cantPaginas});
						
							}
							});				
					}
					});	
		}
	});
}



module.exports = {
	pruebas,
	loginDocente,
	getDocentes,
	saveDocente,
	updateDocente,
	updateClaveDocente,
	uploadImage,
	getImageDocente,
	getDocente,
	deleteDocente,
	getTodosLosProfesores,
	getTodosLosPreceptores,
	getTodosLosTutores,
	getMateriasModulosCursosDeDocente,
	getDocentesPorBusqueda,
	getImageEscuela,
	getDocentesPorrBusqueda
};