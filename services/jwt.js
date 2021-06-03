'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_escuela';

exports.createToken = function(alumno){
	var payload = {
		sub: alumno.id,
		name: alumno.name,
		surname: alumno.surname,
		email: alumno.email,
		image: alumno.image,
		telefono: alumno.telefono,
		tipo_dni: alumno.tipo_dni,
		n_dni: alumno.n_dni,
		fecha_nacimiento: alumno.fecha_nacimiento,
		iat: moment().unix(),
		exp: moment().add(59, 'minutes').unix(),
	
	
	};

	return jwt.encode(payload, secret);
};