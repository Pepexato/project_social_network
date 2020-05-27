'use strict'

var express = require('express');
var FolllowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow',md_auth.ensureAuth,FolllowController.saveFollow);
api.delete('/follow/:id',md_auth.ensureAuth,FolllowController.deleteFollow);
api.get('/following/:id?/:page?',md_auth.ensureAuth,FolllowController.getFollowingUsers);
api.get('/followed/:id?/:page?',md_auth.ensureAuth,FolllowController.getFollowedUsers);
api.get('/get-my-follows/:followed?',md_auth.ensureAuth,FolllowController.getMyFollows);

module.exports = api;