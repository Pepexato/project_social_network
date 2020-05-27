'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        //Conexion con el servidor
        
        console.log("La conexion a la base de datos petstagramDB correcta");
        
        // Crear servidor

        app.listen(port, () => {
            console.log("Servidor corriendo en http://localhost:3800");
        });
    })
    .catch(err => console.log(err));
