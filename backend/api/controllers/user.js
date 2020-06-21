'use strict'

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);



function home(req, res) {

    console.log(req.body)
    res.status(200).send({
        message: 'Hola soy home desde node.js'
    })
}


function pruebas(req, res) {

    console.log(req.body)
    res.status(200).send({
        message: 'Hola soy pruebas'
    })
}

//Registro

function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.email && params.nick && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.nick = params.nick;
        user.role = 'ROLE_USER';
        user.image = null;

        //Controlar los usuarios duplicados

        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }

            ]
        }).exec((err, users) => {
            if (err)
                return res.status(500).send({ message: 'Error al guardar el usuario' })

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario que intentas registrar ya existe' })

            } else {

                //Cifra la contraseña i envia los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err)
                            return res.status(500).send({ message: 'Error al guardar el usuario' })

                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                    });
                });

            }
        })

    }
    else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios'
        });
    }
}

//Login

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //devolver datos de usuario//
                    if (params.gettoken) {
                        //devolver token y generar el token

                        return res.status(200).send({
                            token: jwt.createToken(user)

                        })
                    }
                    else {
                        //devolver datos de usuario//

                    }
                    user.password = undefined; /*Hacemos esto para no devolver la contraseña*/

                    return res.status(200).send({ user });
                } else {
                    return res.status(404).send({ message: 'No se ha podido identificar al usuario' });
                }
            })
        }
        else {
            return res.status(404).send({ message: 'No se ha podido identificar al usuario!!' });

        }
    });

}

//Conseguir datos de usuariio


function getUser(req, res) {

    var userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err)
            res.status(500).send({
                message: 'Error en la peticion'
            });

        if (!user)
            res.status(404).send({
                message: 'No existe el usuario'
            });

        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });

        })
    })
}
async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).then((following) => {

        return following;
    })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).then((followed) => {

        return followed;
    })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed
    }
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


//Devolver un listdo de usuarios paginados//

function getUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;

    }

    var itemPerPage = 6;

    User.find({'_id':{$ne:identity_user_id}}).sort('_id').paginate(page, itemPerPage, (err, users, total) => {
        
       
        if (err) {
            return res.status(500).send({ message: 'Error en la peticion' });
        }

        if (!users) {
            if (err) return res.status(404).send({ message: 'No hay usuarios en la plataforma disponibles' });

        }
        
        followUserIds(identity_user_id).then((value) => {

            return res.status(200).send({
                users,
                users_following: value.following,
                users_followme: value.followed,
                total,
                pages: Math.ceil(total / itemPerPage)

            })

        })

    })
}

function getCounters(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    })


}

async function getCountFollow(user_id) {
    var following = await Follow.count({ "user": user_id }).then((followings) => {
        return followings;
    }).catch((err) => {
        if (err) {
            return handleError(err);
        }
    });

    var followed = await Follow.count({ "followed": user_id }).then((followed) => {
        return followed;
    }).catch((err) => {
        if (err) {
            return handleError(err);
        }
    });

    var publications = await Publication.count({ "user": user_id }).then((count) => {
        return count;
    }).catch((err) => {
        if (err) {
            return handleError(err);
        }
    });

    return {

        following: following,
        followed: followed,
        publications: publications
    }
}
// Editar datos de usuarios

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    // Tenemos que quitar el parametro de la contraseña ya que es un dato muy delicado //

    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para actualizar' });
    }

    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }

        ]
    }).exec((err, users) => {
        if (users && users.length > 1) {
            
            return res.status(200).send({ message: 'Los datos ya estan en uso' });

        }
        else {


            User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({ message: 'Error en la peticion' });
                }
                if (!userUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                }

                return res.status(200).send({
                    user: userUpdated
                });
            });
        }
    });
}

//Subir avatar

function uploadImage(req, res) {

    var userId = req.params.id;

    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (userId != req.user.sub) {

            console.log('Usuario no valido');
            return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar');

        }

        if (file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar avatar del usuario
            console.log('Archivo valido');
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({ message: 'Error en la peticion' });
                }
                if (!userUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                }

                return res.status(200).send({
                    user: userUpdated
                });
            });
        }
        else {
            console.log('Archivo no valido');

            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    }
    else {
        return res.status(200).send({ message: 'No se ha podido subir la imagen' });
    }
}

//Funcion para borrar imagenes subidas al servidor no validas//

function removeFilesOfUploads(res, file_path, menssage) {
    fs.unlink(file_path, (err) => {

        return res.status(200).send({ message: menssage })
    });
}


//Devolver imagen del usuario//

function getImageFile(req, res) {
    var image_file = req.params.imageFile;

    var path_file = 'uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {

        if (exists) {
            res.sendFile(path.resolve(path_file));

        }
        else {
            res.status(200).send({ message: 'No existe la foto' });
        }

    });

}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile

}