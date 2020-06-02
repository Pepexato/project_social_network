'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creamos el modelo de follows
var FollowSchema = Schema({

    user: {type: Schema.ObjectId, ref: 'User'},
    followed: {type: Schema.ObjectId, ref: 'User'}
    
});

/*Exportamos el modelo es primer parametro seria el nombre de la entidad y el segundo 
los campos que va a tener el objeto*/


module.exports = mongoose.model('Follow', FollowSchema);