'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creamos el modelo de publications
var PublicationSchema = Schema({

    text: String,
    file: String,
    created_at: String,
    user: {type: Schema.ObjectId, ref: 'User'}

  
});

/*Exportamos el modelo es primer parametro seria el nombre de la entidad y el segundo 
los campos que va a tener el objeto*/


module.exports = mongoose.model('Publication', PublicationSchema);