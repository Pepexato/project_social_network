'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

//Seguir usuarios//
function saveFollow(req, res) {

    var params = req.body;

    var follow = new Follow();

    //Es el usuario autenticado en el middleware (nosotros) //
    follow.user = req.user.sub;
    //Es el usuario al cual queremos seguir que nos llegara por la peticion//
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err)
            return res.status(500).send({ message: 'Error al guardar el seguimiento' })

        if (!followStored)
            return res.status(404).send({ message: 'El seguimiento no se ha guardado' })

        return res.status(200).send({ follow: followStored });

    })

}

//Dejar de seguir usuarios//

function deleteFollow(req, res) {
    //el usuario logeado//
    var userId = req.user.sub;
    //el usuario que vamos a dejar de seguir//
    var follwId = req.params.id;

    Follow.find({ 'user': userId, 'followed': follwId }).deleteOne(err => {
        if (err)

            return res.status(500).send({ message: 'Error al dejar de seguir' });

        return res.status(200).send({ message: 'El follow a sido eliminado correctamente' });


    })
}

//Paginacion de usuarios que seguimos//

function getFollowingUsers(req, res) {

    var userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    //Pagina por defecto//
    var page = 1;

    if (req.params.page) {
        page = req.params.page;

    } else {
        page = req.params.id;
    }

    var itemsPerPage = 6;

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        if (follows < 1) return res.status(404).send({ message: 'No sigues a ningun usuario' });
        followUserIds(req.user.sub).then((value) => {

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_followme: value.followed,
            });
        });
    });

}

async function followUserIds(user_id) {
    var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).then((follows) => {


        return follows;
    }).catch((err) => {

        return handleError(err);
    });


    var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).then((follows) => {


        return follows;
    }).catch((err) => {

        return handleError(err);
    });

    //Porcesar followings id//
    var following_cleans = [];

    following.forEach((follow) => {
        following_cleans.push(follow.followed);
    });

    //Procesar followeds//
    var followed_cleans = [];

    followed.forEach((follow) => {
        followed_cleans.push(follow.user);
    });

    return {
        following: following_cleans,
        followed: followed_cleans
    }
}


function getFollowedUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;

    } else {
        page = req.params.id;
    }

    var itemsPerPage = 6;
    //Buscamos el followed que coincida con nuestro userId para saber quien no sigue
    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        if (follows < 1) return res.status(404).send({ message: 'No te sigue ningun usuario' });
        followUserIds(req.user.sub).then((value) => {

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_followme: value.followed,
            });
        });
    });
}



//Devolver listados de usuarios//

function getMyFollows(req, res) {
    var userId = req.user.sub;
    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId })
    }

    find.populate('user followed').exec((err, follows) => {

        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        if (follows < 1) return res.status(404).send({ message: 'No sigues a ningun usuario' });
        return res.status(200).send({ follows });

    });

}




module.exports = {

    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}