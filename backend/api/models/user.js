'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creamos el modelo de usuario
var UserSchema = Schema({

    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

/*Exportamos el modelo es primer parametro seria el nombre de la entidad y el segundo 
los campos que va a tener el objeto*/


module.exports = mongoose.model('User', UserSchema);