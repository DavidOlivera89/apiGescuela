'use strict'
var fs= require('fs');
var path= require('path');

var bcrypt = require('bcrypt-nodejs');
var Alumno = require('../models/alumno');
var Docente = require('../models/docente');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de alumno del api rest con Node y Mongodb'

	})
}

function getAlumnos(req, res){
	
		var find = Alumno.find({});
		console.log(find);
	
	find.exec((err, alumnos)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!alumnos){
				res.status(404).send({message: ' no hay alumnos'});
			}else{
				res.status(200).send({alumnos});
			}
		}
	});
}

function getDocentes(req, res){
		console.log("hola prueba1");
		var find = Docente.find({});
		
		console.log(find);
	
	find.exec((err, docentes)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!docentes){
				res.status(404).send({message: ' no hay docentes'});
			}else{
				res.status(200).send({docentes});
			}
		}
	});
	
}


function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	Docente.findOne({email: email.toLowerCase()}, (err, usuario) =>{
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!usuario){
				//res.status(404).send({message:'El usuario no existe'})
				Alumno.findOne({email: email.toLowerCase()}, (error, usuario) =>{
					if(error){
						res.status(500).send({message:'Error en la peticion'});
					}else{
						if(!usuario){
							res.status(404).send({message:'El usuario que has ingresado no existe en la base de datos'});
						}else{

						bcrypt.compare(password, usuario.password, function(err, check){
							if(check){
								
								//devolver los datos del usuario logueado
								if(params.gethash){

									//devolver un token de jwt
									res.status(200).send({
										token: jwt.createToken(usuario)
									})
								}else{
									res.status(200).send({usuario});
								}
							}else{
							res.status(404).send({message: 'El usuario no ha podido loguearse'});
							}
						});
						}
					}
				});
				
			}else{
				//Comprobar la contraseña
				bcrypt.compare(password, usuario.password, function(err, check){
					if(check){
						//devolver los datos del usuario logueado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(usuario)
							})
						}else{
							res.status(200).send({usuario});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}


module.exports = {
	pruebas,
	loginUser,
	getAlumnos,
	getDocentes

};