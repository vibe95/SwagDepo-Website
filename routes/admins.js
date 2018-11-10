var express = require('express');
var router = express.Router();
var Promises = require('q');
var crypto = require('crypto');

var Admin = require('../schemas/admin.js');

var User = require('../schemas/user.js');
var Photo = require('../schemas/photo.js');
var StylesList = require('../schemas/styles.js');

router.get('/', function(req, res){
	if(!req.session.user){
		res.redirect('/');
	}	
	Admin.findOne({_id: req.session.user._id}, function(err, admin){
		if(err){
			res.send("Failure connecting to database.");
		}else if(user){
			res.render('admin');
		}else{
			res.redirect('/');
		}
	});	
});

router.post('/cleardatabase/Users', function(req, res){
	User.remove({}, function(err){});
});

router.post('/cleardatabase/Photos', function(req, res){
	Photos.remove({}, function(err){});
});

router.post('/deleteUser/:id', function(req, res){
	User.remove({_id: req.params.id}, function(err){});
});

router.post('deletePhoto/:id', function(req, res){
	Photo.remove({_id: req.params.id}, function(err){});
});

module.exports = router;