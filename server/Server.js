//get the json file, set the port and other basic items for server to work
var http = require('http');
var mainUrl = "127.0.0.1"
var port = 3000;
var fs = require('fs');
var url = require('url');
var path = require("path");
var express = require('express');
//var users = require('../routes/users.js');
//var jsonUsers = require('../Database/photos.json');
//var jsonPics = require('../Database/users.json');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/CSC309-A4');
var db = mongoose.connection;
var User = require('../schemas/user.js');
var Photos = require('../schemas/photo.js');



//This is a template showing how to convet pic and add it to photo database
function addPic(pic){
  console.log(pic)

  //convert the pic to binary, WILL need to change image path to uploaded pic OR do this conversion on client side
  imgPath = '../Front End/img/pic1.jpg';
  imgdata = fs.readFileSync(imgPath);
  imgcontentType = 'image/jpg';

  //create a new instnce for that pic
  var newPic =  Photos({
      title: "blah",
      image_data: {data: imgdata, contentType: imgcontentType },
      description: "this is a pic"});

  //save that pic
  newPic.save(function(err) {
        if (err) throw err;
        console.log('new pic added created! title:' +newPic.title);
      });

  return "picutres_recived";
}


//the server code
//create the server and also handle requests
var app = express();

//THIS JUST PRINTS DATA for both database when server is started
// get all the users
User.find({}, function(err, users) {
  if (err) throw err;
  // object of all the users
  console.log("\nUser Database\n"+users+"\n");
});
Photos.find({}, function(err, pics) {
  if (err) throw err;
  // object of all the users
  console.log("\nPhotos Database\n"+pics+"\n");
});



//Front end= serve the user the frontend files
app.use(express.static('../Front End'));
//app.use('/users', users);

//case when the more button is cliked it; Right now it just runs add pic
app.get('/morePics',function(req,res){
  var pic = req.query.id;
  console.log("Getting more Pics for: "+pic);
  data = addPic(pic);
  res.end(data);
});


app.get('/singup',function(req,res){
  //Creating a new user
  var newUser = User({
    firstName: 'Vibi',
    lastName:  req.query.lastname,
    username: req.query.username,
    password: 'password',
  });
  newUser.save(function(err) {
    if (err) throw err;
    console.log('User created! Username:' +newUser.username);
  });
  res.end("Account Created!" +firstName);

});



//start the server and notify it start with the address in the console
app.listen(port, function () {
  console.log('Server running at http://'+mainUrl +':'+port+"/");
});



//EXTRA code Just incase

//if you need to clear the Database
//User.remove({}, function(err) {});

//Creating a new user
// var newUser = User({
//   firstName: 'Vibi',
//   lastName: 'asdfa',
//   username: 'Vibe95',
//   password: 'password',
// });
// newUser.save(function(err) {
//   if (err) throw err;
//   console.log('User created! Username:' +newUser.username);
// });
