'use strict';



// Dependencies
//
var fs 		= require('fs');
var mime    = require('mime');
var path 	= require('path');
//var gui     = require('nw.gui');
var express = require('express');
var PhotosDB = require('../schemas/photo.js');
var UserDB = require('../schemas/user.js');
var router = express.Router();
var photoData = null;
//to be changed
//var user= UserDB.find({id: user._id}, function(err, users){});

//PhotosDB.remove({}, function(err) {});

router.get('/', function(req, res){
res.render('Stream');
});

router.get('/stream', function(req, res){
	// if(!req.session.user){
	// 	redirect("/");
	// }
	console.log("Fetching Pictures for: "+ req.session.user.username);

	UserDB.findOne({_id: req.session.user._id}, function(err, user){
		if(err){
			res.send("Error finding user");
		}else if(!user){
			res.send("No such user");
		}else{
			//console.log("Styles:",req.session.user.styles);
			PhotosDB.find({ tags: { $in: user.styles } }, function(err, photos){
				if(err){
					res.send("Error finding photos");
				} else{
						//console.log("Found Photos",photos);
					//res.send("found photos for users");
						res.render('Stream', {photo_list: JSON.stringify(photos)});
				}

			});
		}
	});
});


module.exports = router;
