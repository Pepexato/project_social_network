'use strict'

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors')


var app = express();


// cargar rutas

// middleweres (metodo que se ejecuta antes de que llegue al controlador)

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(cors());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// cargar rutas

var user_routes = require('./routes/user');
var follow_router = require('./routes/follow');
var publication_routes = require('./routes/publications');
var message_routes = require('./routes/message');


//rutas
app.use('/api',user_routes);
app.use('/api',follow_router);
app.use('/api',publication_routes);
app.use('/api',message_routes);


// exportar

module.exports = app;

