'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_escuela';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion correspondiente '});

	}
	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp<= moment().unix()){
			return res.status(401).send({message: 'Su sesión ha expirado, si desea continuar por favor vuelva a inciar sesión'});
			
		}
	
	}catch(ex){
		console.log(ex);
		return res.status(401).send({message: 'Token no valido'});
		//alert.(message);

	}

	req.user = payload;
	next();
};

