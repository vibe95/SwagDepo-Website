var express = require('express');
var router = express.Router();
var Promises = require('q');
var crypto = require('crypto');

var User = require('../schemas/user.js');
var Photo = require('../schemas/photo.js');
var StylesList = require('../schemas/styles.js');

var domain = "localhost:3000";

/*router.get('/signup', function(req, res){//Figure out how to get to the register box
	res.render('register');
});*/

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq');
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

router.post('/signup', function(req, res){
	var email = req.body.email.trim();
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	var cpassword = req.body.cpassword.trim();
	//var description = req.body.description.trim();

	if(!username || !email || !password || !cpassword){
		res.send({error:"Please fill in the email, username and password fields"});
        return;
	}else if(password != cpassword){
		res.send({error:"Error connecting to the database."});
        return;
	}

	User.count({username: username}, function(err, count){
		if(err){
			console.log(err);
			res.send({error:"A database error occurred, Please try again."});
        	return;
		}
		else if(count != 0){
			res.send({error:"That username is already in use."});
			return;
		}
	});
	console.log("Encrypting password");
	var encodePass = encrypt(cpassword);

	var user = new User({
		username: username,
		email: email,
		password: encodePass,
		description: "",
		styles: [],
		photos: [],
		fullname: "",
		location: ""
	});

	User.count({email:email})
	.then(function(count){
		if(count != 0){
			res.send({error:"That email is already in use."});
        	throw new Error("Done");
		}
		return user.save();
	})
	.then(function(user){
		console.log("user: "+user);
		req.session.user = user;
		res.send("Account Created!!");
	}).fail(function (err) {
        if (err.message == "Done")
            return;
        console.log(err);
		res.send({error:"A database error occurred, Please try again."});
            //res.send("Error: A database error occured. Please try again.");
    });
});

/*router.get('/login', function(req, res){ //Need to figre out how to get to login box
	res.render('index');
});*/

router.post('/login', function(req, res){
	var email = req.body.email.trim();
	var password = req.body.password.trim();

	User.findOne({email: email}, function(err, user){
		if(err){
			console.log(err);
			res.send("A database error occurred, Please try again.");
        	return;
		}else if(!user){
			console.log("No user found.");
			res.send("That email is not found in our database. Please try again.");
			return;
		}else{
			var decodepass = decrypt(user.password);
			if(decodepass != password){
				res.send("That password is incorrect. Please try again.");
				return;
			}
			console.log("User found...loggin in.");
			req.session.user = user;
			//res.redirect('/');
			res.send("Login Successful.");
			return;
		}
	});
});

router.get('/_users', function (req, res) {
    User.find({}).exec()
        .then(function (users) {
        console.log(users);
        res.send(users);
    })
        .fail(function (err) {
        console.log(err);
        res.send(JSON.stringify({
            status: "Error getting users"
            }));
    });

});
router.get('/_pics', function (req, res) {
    Photo.find({}).exec()
        .then(function (users) {
        //console.log(users);
        res.send(users);
    })
        .fail(function (err) {
        console.log(err);
        res.send(JSON.stringify({
            status: "Error getting users"
            }));
    });

});

router.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.user = null;
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

//Find user profile
router.post('/search', function(req, res){

	var username = req.body.username.trim();
	if(username == ""){
		res.send({error:"Enter something in search."});
	}

	User.findOne({username: username}, function(err, user){
		if(err){
			res.send({error:"Error connecting to database. Try again."});
		}else if(!user){
			res.send({error:"User not found."});
		}else{
			res.send({success:"/user/profile/" + user._id});
		}
	});
});

router.get('/profile', function (req, res) {
    if (req.session.user) {
        //Hack: Pass md5hash of user's email to obtain gravatar image
        res.redirect('/user/profile/' + req.session.user._id);
    } else {
    	console.log("You are not logged in.");
        res.redirect('/');
    }
});

router.get('/profile/:id', function (req, res) {

    uid = req.params.id;
    if (!uid) res.redirect('/');
    //Find user with credentials
    User.findOne({
        _id: uid
    }).exec()
        .then(function (user) {
            //Fail if ID not found, or accessing private user without permission
        if (!user){
                res.redirect('/');
        } else {
        	Photo.find({author: user._id}, function(err, photos){
				if(err){
					res.status(404).send("Failure connecting to database.");
				}
					res.render('profile', {
						styles: JSON.stringify(StylesList),
						profile_user: user,
						photo_list: photos,
						//Only allow editing if user edits his own profile
						edit: req.session.user && req.session.user._id == user._id
					});
            });
        }
    })
        .fail(function (err) {
        if (err.message == "Done")
            return;
        console.log(err);
        res.redirect('/', {error: "Failure connecting to the database"});
            //res.send("Error: A database error occured. Please try again.");
    });
});

router.post('/profile/updateinfo', function(req, res){
	if(!req.session.user){
		res.redirect('/');//Need to figure out how to get to login page.
	}
	var fullname = req.body.fullname.trim();
	var description = req.body.description.trim();
	var location = req.body.location.trim();
	var styles = req.body.styles;//Figure out how we are going to parse the styles

	User.findOne({_id : req.session.user._id}).exec()
	.then(function(user){
		if(!user){
			res.send({error: "Logged in user not found."})
		}else{
			user.fullname = fullname;
			user.description = description;
			user.location = location;
			user.styles = styles;
			user.save(function(err){
				if(err){
					res.status(404).send({error:"Failure to connect to database."});
				}
				else{
					res.send({success: "Account updated."});
				}
			});
		}
	})
	.fail(function(err){
		 console.log(err);
         res.send({error: "Error: " + err});
	});


});

//DO we want anonymous photos? Does someone need to be logged in to upload a photo?
router.post('/uploadphoto', function(req, res){
	if(!req.session.user){
		res.direct('/');//same thing as before
	}

	var title = req.body.title.trim();
	var description = req.body.description.trim();
	var data = req.body.imgdata; //Figure this out.
	var tags = req.body.tags;//WILL FIGURE OUT HOW TO PARSE...
	//Have to check if tags belong in system

	var photo = new Photo({
		title: title,
		author: req.session.user._id,//Should i look through the database for the user?
		image_data: data,
		description: description,
		tags: tags,
		comments: [],
		Likes: 0,
		DisLikes: 0
	});

	User.findOne({_id: req.session.user._id}, function(err, user){
		if(err){
			console.log(err);
			res.send({error: "Failure connecting to the database"});
			return;
		}else{
			user.photos.push(photo._id);
			user.save(function(err){
				if(err){
					console.log(err);
					res.send({error: "Failure connecting to the database"});
					return;
				}
			});
		}
	});
	//This should return the photo object and an error object if it occurred.
	res.send("Photo uploaded");
	return photo.save();
});

module.exports = router;
