'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req,res)
{
    return res.status(200).send({message:'Hola que tal desde los mensaje privadoes'});
}

function saveMessage(req,res)
{
    var params = req.body;
    
    if(!params.text || !params.receiver)
    {   
        return res.status(200).send({message:'Envia los datos necesarios'});
    }

    var message = new Message();

    message.emmiter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err,messageStored) =>
    {
        if(err)
        {
            return res.status(500).send({message:'Error en la peticion'});
        }

        if(!messageStored)
        {
            return res.status(500).send({message:'Error al enviar el mensaje'});
        }
        return res.status(200).send({messageStored});

    });
}

function getReceivedMessages(req,res)
{
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page)
    {
        page =  req.params.page;
    }

    var itemsPerPage = 4;
    Message.find({receiver:userId}).populate('emmiter','name surname image nick _id').sort('-created_at').paginate(page,itemsPerPage, (err,messages,total) =>{

        if(err)
        {
            return res.status(500).send({message:'Error en la peticion'});
        }
        
        if(!messages)
        {
            return res.status(404).send({message:'No hay mensajes'});
        }

        return res.status(200).send({
            total:total,
            pages:Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

function getEmmitMessages(req,res)
{
    var userId = req.user.sub;
    var page = 1;
   
    if(req.params.page)
    {
        page =  req.params.page;
    }

    var itemsPerPage = 3;
    Message.find({emmiter:userId}).populate('emmiter receiver','name surname image nick _id').sort('-created_at').paginate(page,itemsPerPage, (err,messages,total) =>{

        if(err)
        {
            return res.status(500).send({message:'Error en la peticion'});
        }
        
        if(!messages)
        {
            return res.status(404).send({message:'No hay mensajes'});
        }

        return res.status(200).send({
            messages,
            total,
            pages:Math.ceil(total/itemsPerPage)
           
        });
    });
}

function getUnviewedMessages (req,res)
 {
     var userId = req.user.sub;

     Message.countDocuments({receiver:userId,viewed:'false'},(err,messages) =>
     {
        if(err)
        {
            return res.status(500).send({message:'Error en la peticion'});
        }

        return res.status(200).send({unviewed:messages});

     });
 }

 function setViewedMessages(req,res)
 {
     var userId = req.user.sub;

     Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err,messagesUpdated)=>{

        if(err)
        {
            return res.status(500).send({message:'Error en la peticion'});
        }

        return res.status(200).send({messages:messagesUpdated});

     });
 }
module.exports = {

    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
};