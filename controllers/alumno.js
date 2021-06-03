'use strict'
var fs= require('fs');
var path= require('path');

var bcrypt = require('bcrypt-nodejs');
var Alumno = require('../models/alumno');
var User = require('../models/user');
var jwt = require('../services/jwt');
var Curso_Alumno = require('../models/curso_alumno');
var Materia= require('../models/materia');
 var Modulo = require('../models/modulo');


function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de alumno del api rest con Node y Mongodb'
	})
}

function getAlumnos(req, res){
		if(req.params.page){
			var page = req.params.page;
		}else{
			var page = 1;
		}

		var itemsPerPage = 18;

		Alumno.find().populate('ultimoCurso').sort({surname:1}).paginate(page, itemsPerPage, function(err, alumnos, total){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumnos){
				res.status(404).send({message: 'No hay alumnos !!'});
			}else{
				var cantPaginas= Math.ceil(total/itemsPerPage);
				
				return res.status(200).send({
					cantPaginas: cantPaginas,
					total_items: total,
					alumnos: alumnos
				});
			}
		}
	});	
}


function getAlumnosPorrBusqueda(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 20;

	console.log("aca esta AlumnosPorrBusqueda");	
	var alumno = new Alumno();
	var params = req.body;
	alumno.name = params.name;
	alumno.surname = params.surname;
	console.log(params.ultimoCurso);

	if (params.ultimoCurso==""){
		Alumno.find({name: {$regex:alumno.name, $options:"i"}, surname:{$regex:alumno.surname, $options:"i"}}).populate('ultimoCurso').sort({surname:1}).paginate(page, itemsPerPage, function(err, alumnos, total){
			if(err){
				res.status(500).send({message: 'Error en la petición.'});
			}else{
				if(!alumnos){
					res.status(404).send({message: 'No hay alumnos !!'});
				}else{
					var cantPaginas= Math.ceil(total/itemsPerPage);
					return res.status(200).send({
						cantPaginas: cantPaginas,
						total_items: total,
						alumnos: alumnos
					});
				}
			}
		});

		}else{
			alumno.ultimoCurso = params.ultimoCurso;
			Alumno.find({name: {$regex:alumno.name, $options:"i"}, surname:{$regex:alumno.surname, $options:"i"}, ultimoCurso: alumno.ultimoCurso}).populate('ultimoCurso').sort({surname:1}).paginate(page, itemsPerPage, function(err, alumnos, total){
				if(err){
					res.status(500).send({message: 'Error en la petición.'});
				}else{
					if(!alumnos){
						res.status(404).send({message: 'No hay alumnos !!'});
					}else{
						var cantPaginas= Math.ceil(total/itemsPerPage);

						return res.status(200).send({
							cantPaginas: cantPaginas,
							total_items: total,
							alumnos: alumnos
						});
					}
				}
			});
		}
}


function saveAlumno(req, res){
	var alumno = new Alumno();
	var params = req.body;
	var curso_alumno = new Curso_Alumno();

	alumno.name = params.name;
	alumno.surname = params.surname;
	alumno.email = params.email.toLowerCase();
	
	if (!params.image){
		alumno.image ="imagenAlumnoPorDefecto.jpg";
	}else {
		alumno.image = params.image;
	};

	let mes = params.fecha_nacimiento.substring(5,7);
	let dia= params.fecha_nacimiento.substring(8,10);
	let anio= params.fecha_nacimiento.substring(0,4);
	alumno.fecha_nacimiento= dia + '-'+mes+'-'+anio;

	alumno.alumno = true;
	alumno.n_dni = params.n_dni;
	alumno.ultimoCurso= params.ultimoCurso;
	alumno.telefono = params.telefono;

	console.log(alumno.email);
	Alumno.findOne({n_dni: alumno.n_dni },(err, alumnoBuscado) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumnoBuscado){
				console.log("no existe el alumno con ese dni");
////////////////////////////////////////////////////////////////////

			Alumno.findOne({email: alumno.email },(err, alumnoBuscado) => {
				if(err){
					res.status(500).send({message: 'Error en la petición.'});
				}else{
					if(!alumnoBuscado){
						console.log("no existe el alumno con ese email");				
				//////////////////////////////////////////////////
						console.log("llego el curso" + params.ultimoCurso);
						if(params.password){
								//Encriptar contraseña y guardar datos
								bcrypt.hash(params.password, null, null, function(err, hash){
									alumno.password = hash;
									if(alumno.name != null && alumno.surname != null && alumno.email !=null){
										//guardar el usuario
										alumno.save((err, alumnoStored)=>{
											if(err){
												res.status(500).send({message: 'Error al guardar el usuario'});
											}else{
												if(!alumnoStored){
													res.status(404).send({message: 'No se ha registrado el usuario'});
												}else{
													res.status(200).send({alumno: alumnoStored, message: "El nuevo alumno se ha registrado con exito"});
													
													curso_alumno.alumno=alumnoStored._id;
													curso_alumno.curso=alumnoStored.ultimoCurso;
													
													curso_alumno.save((err, curso_alumnoStored)=>{
														if(err){
															//res.status(500).send({message: 'Error al guardar el curso_alumno'});
														}else{
															if(!curso_alumnoStored){
															//res.status(404).send({message: 'Se ha registrado el curso_alumno'});
															}else{										
															}
														}
													});
												}
											}
										})
									}else{
										
									}
								});
						}else{
								
						}
//////////////////////////////////////////////////////////////////////

					}else{
						console.log(alumnoBuscado);
						console.log("ya existe ese alumno");
						res.status(200).send({message: 'Error al guardar el usuario, YA EXISTE REGISTRADO UN ALUMNO CON EL EMAIL INGRESADO'+' '+alumnoBuscado.email});

					}
				}
			});
///////////////////////////////////////////////////////////////////////
		}else{
			console.log(alumnoBuscado);
			console.log("ya existe ese alumno");
			res.status(200).send({message: 'Error al guardar el usuario, YA EXISTE REGISTRADO UN ALUMNO CON EL DNI INGRESADO'+' '+alumnoBuscado.n_dni});
		}
	}
	});
}


function loginUser(req, res){
	console.log('loginUser de controlador Alumno');
	var params = req.body;
	var email = params.email;
	var password = params.password;

	Alumno.findOne({email: email.toLowerCase()}, (err, alumno) =>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!alumno){
				res.status(404).send({message:'El usuario no existe'})
			}else{
				//Comprobar la contraseña
				console.log(alumno.name);
				bcrypt.compare(password, alumno.password, function(err, check){
					if(check){
						//devolver los datos del usuario logueado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(alumno)
							})
						}else{
							res.status(200).send({alumno});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}


function updateAlumno(req, res){
	var userId = req.params.id;
	var update = req.body;

	var curso_alumnete = new Curso_Alumno();
	var comprobarAlumno;
	var alumno = new Alumno();
	alumno = update;
	
	let mes = update.fecha_nacimiento.substring(5,7);
	let dia= update.fecha_nacimiento.substring(8,10);
	let anio= update.fecha_nacimiento.substring(0,4);
	alumno.fecha_nacimiento= dia + '-'+mes+'-'+anio;
	
	console.log(alumno);
	console.log(alumno.password);
	var cambiaDeCurso=false;
	var find = Alumno.findById(alumno._id);

	find.exec(function(err, alumner) {
		if(err){
		}else{
			//comparar los nuevos datos del alumno vs el alumner que ya estaba en la base;			
			console.log("clave actual es:"+ alumner.password);
			console.log("la clave que vino" + alumno.password);
		
		if(update.ultimoCurso!=alumner.ultimoCurso){
			cambiaDeCurso=true;
		}

			if(update.password==alumner.password){
				console.log("no entra al hash");
				Alumno.findByIdAndUpdate(userId, alumno, (err, userUpdated) => {
					if(err){
						res.status(500).send({message: 'Error al actualizar el usuario'});
					}else{
						if(!userUpdated){
							res.status(404).send({message: 'No se ha podido actualizar el usuario'});
						}else{
							//////////////////aca actualizamos tabla curso_alummno
							console.log(userUpdated);
							console.log("Id del alumno");
							console.log(alumno._id);
							var find5= Curso_Alumno.findOne({alumno: alumno._id});
							find5.exec(function(err, cursolin){
								if(err){
								}else{
									
									console.log("ESTE ES EL CURSO ALUMNO" + cursolin.alumno);
									console.log(cursolin);
									
										Curso_Alumno.findByIdAndRemove(cursolin._id, (err, curso_alumnoRemoved) => {
											if(err){
												console.log("HAY UN ERROR");
												//res.status(500).send({message: 'Error en el servidor'});
											}else{
												if(!curso_alumnoRemoved){
													console.log("NO SE ENCUENTRA EL Curso_Alumno");
												}
												console.log("BORRA EL CURSO");
												console.log(curso_alumnoRemoved);
												curso_alumnete.alumno= alumno._id;
												curso_alumnete.curso= alumno.ultimoCurso._id;
												console.log("mete el CURSO" + curso_alumnete);
												
												curso_alumnete.save((err, curso_alumneteStored)=>{
														if(err){
														}else{
														console.log("SE ACTUALIZA EL CURSO DEL ALUMNO" + update.surname + " SU CURSO ACTUAL ES " + update.ultimoCurso);
												
														}
													});

												}
											});
								}
								});
									//////////////////////////////////////////////////////////
							
							res.status(200).send({alumno: userUpdated, message: 'El alumno se ha actualizado correctamente'});
						}
					}
				});
			}else{

				console.log("como son distintas entra al hasher");
				bcrypt.hash(update.password, null, null, function(err, hash){
					alumno.password = hash;

					Alumno.findByIdAndUpdate(userId, alumno, (err, userUpdated) => {
						if(err){
							res.status(500).send({message: 'Error al actualizar el usuario'});
						}else{
							if(!userUpdated){
								res.status(404).send({message: 'No se ha podido actualizar el usuario'});
							}else{
									//////////////////aca actualizamos tabla curso_alummno
							var find5= Curso_Alumno.findOne({alumno: alumno._id});
							find5.exec(function(err, cursolin){
								if(err){
								}else{
										Curso_Alumno.findByIdAndRemove(cursolin._id, (err, curso_alumnoRemoved) => {
											if(err){
												//res.status(500).send({message: 'Error en el servidor'});
											}else{
												if(!curso_alumnoRemoved){
													console.log("NO SE ENCUENTRA EL Curso_Alumno");
												}
												console.log("BORRA EL CURSO");
												console.log(curso_alumnoRemoved);
												curso_alumnete.alumno= alumno._id;
												curso_alumnete.curso= alumno.ultimoCurso._id;
												console.log("mete el CURSO" + curso_alumnete);
												
												curso_alumnete.save((err, curso_alumneteStored)=>{
														if(err){
														}else{
														console.log("SE ACTUALIZA EL CURSO DEL ALUMNO" + update.surname + " SU CURSO ACTUAL ES " + update.ultimoCurso);
												
														}
													});
												}
											});
								}
								});
									//////////////////////////////////////////////////////////
							res.status(200).send({alumno: userUpdated, message: 'El alumno se ha actualizado correctamente'});
							}
						}
					});
				});
			};
		}
	});
	
}


function updateClaveAlumno(req, res){
	console.log("desde la api"+req.params);
	var userId = req.params.id;
	var clave = req.body;

	if ((!clave.nueva) || (clave.reingresanueva == "")){
	res.status(200).send({message: 'La clave nueva es incorrecta'});

	}else{


	bcrypt.compare(clave.actual, clave.identityClave, function(err, check){
		if(check){

			if(clave.nueva == clave.reingresanueva){
				bcrypt.hash(clave.reingresanueva, null, null, function(err, hash){

					Alumno.findById(clave.id, (err, alumno) => {
						if(err){
							res.status(500).send({message: 'No se ha podido actualizar el usuario por un problema en el servidor.'});
						}else{
							if(!alumno){
								res.status(404).send({message: 'El alumno no existe, no se puede actualizar el usuario'});
							}else{

								alumno.password = hash;

								Alumno.findByIdAndUpdate(alumno._id, alumno, (err, userUpdated) => {
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
			}
		}else{
			res.status(200).send({message: 'La clave actual que ha ingresado no es correcta'});
		}
	});
	}
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
			Alumno.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
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



function getImageAlumno(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/alumnos/'+imageFile;
	fs.exists(path_file, function(exists){
		if (exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


function deleteAlumno(req, res){
	var alumnoId = req.params.id;
	Alumno.findByIdAndRemove(alumnoId, (err, alumnoRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!alumnoRemoved){
				res.status(404).send({message: 'No se ha podido borrar el alumno'});
			}else{

				var find5= Curso_Alumno.findOne({alumno: alumnoId});
				find5.exec(function(err, cursolin){
					if(err){
					}else{

						Curso_Alumno.findByIdAndRemove(cursolin._id, (err, curso_alumnoRemoved) => {
							if(err){
								console.log("HAY UN ERROR");
							}else{
								if(!curso_alumnoRemoved){
									console.log("NO SE ENCUENTRA EL Curso_Alumno");
								}
								console.log("BORRA EL CURSO");
								console.log(curso_alumnoRemoved);

							}
						});
					}
				});
				res.status(200).send({alumno: alumnoRemoved, message:"El alumno ha sido borrado"});
			}
		}
	});
}


function getAlumno(req, res){
	var alumnoId = req.params.id;

	var find = Alumno.findById(alumnoId).populate('ultimoCurso');

	find.exec(function(err, alumno) {
		
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumno){
				res.status(404).send({message: 'El alumno no existe'});
			}else{
				
				var ano= alumno.ultimoCurso.ano;
				console.log(alumno.ultimoCurso.ano_gregoriano);
				var ano_gregoriano= alumno.ultimoCurso.ano_gregoriano;

				var find2 = Materia.find({ano_cursado: alumno.ultimoCurso.ano, ano_gregoriano: alumno.ultimoCurso.ano_gregoriano});
				find2.exec(function(err, materias) {
					if(err){
						res.status(500).send({message: 'Error en la petición.'});
					}else{
						if(!materias){
							res.status(404).send({message: 'El alumno no existe'});
						}else{
							res.status(200).send({materias: materias, alumno: alumno});						
						}
					}
				});
			}
		}
	});
}


function getAlumnosPorCurso(req, res){
	var cursoId = req.params.id;
	var find= Curso_Alumno.find({curso: cursoId}).populate('curso').populate('alumno').sort('surname');

	find.exec(function(err, alumnos){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumnos){
				res.status(404).send({message: 'El alumno no existe'});
			}else{
				console.log("los alumnos son:")
				console.log(alumnos);
				res.status(200).send({alumnos});
			}
		}
	});
}


function getAlumnosPorBusqueda(req, res){
	var alumno = new Alumno();
	var params = req.body;
	alumno.name = params.name;
	alumno.surname = params.surname;
	console.log(params.ultimoCurso);

	if (params.ultimoCurso==""){
		var find= Alumno.find({name: {$regex:alumno.name, $options:"i"}, surname:{$regex:alumno.surname, $options:"i"}}).populate('ultimoCurso').sort('surname');

	}else{
	alumno.ultimoCurso = params.ultimoCurso;
		var find= Alumno.find({name: {$regex:alumno.name, $options:"i"}, surname:{$regex:alumno.surname, $options:"i"}, ultimoCurso: alumno.ultimoCurso}).populate('ultimoCurso').sort('surname');

		}

	find.exec(function(err, alumnos){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!alumnos){
				res.status(404).send({message: 'El alumno no existe'});
			}else{
				res.status(200).send({alumnos});
			}
		}
	});
}

module.exports = {
	pruebas,
	loginUser,
	getAlumnos,
	saveAlumno,
	updateAlumno,
	updateClaveAlumno,
	uploadImage,
	getImageAlumno,
	deleteAlumno,
	getAlumno,
	getAlumnosPorCurso,
	getAlumnosPorBusqueda,
	getAlumnosPorrBusqueda

};