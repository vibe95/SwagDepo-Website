$(document).ready(function(){
	// // Initialize Tooltip
	$('[data-toggle="tooltip"]').tooltip();
	// Add smooth scrolling
	$(" footer a[href='#myPage']").on('click', function(event) {
		// Prevent default anchor click behavior
		event.preventDefault();
		// Store hash
		var hash = this.hash;
		// Using jQuery's animate() method to add smooth page scroll
		// The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 900, function(){
		// Add hash (#) to URL when done scrolling (default click behavior)
			window.location.hash = hash;
		});
	});
});

function login(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	$.post('/user/login', {email: email, password: password}, function(data){
		alert(data);
		if(data == "Login Successful."){window.location.href = "/";}
	});
}

function signup(){
	var email = document.getElementById("Remail").value;
	var username = document.getElementById("Rusername").value;
	var password = document.getElementById("Rpassword").value;
	var cpassword = document.getElementById("Rcpassword").value;
	$.post('/user/signup',{email: email, username: username, password: password,cpassword:cpassword},function(data){
		document.getElementById("error").innerHTML = data.error;
		if (data == "Account Created!!"){
		alert(data + " Edit your account!");
		window.location.href = "/user/profile";}
	});
}

//read the pic the picture
var uploadedPic;
function readFile(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			uploadedPic = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

//upload the picture
function uploadpic(input) {
	var name = document.getElementById("Utitle").value;
	//var profilepic = document.getElementById("Elocation").value;
	var description = document.getElementById("Udescription").value;
	//get tags
	var tagForm = document.forms.tagsUp;
	var selectedTags = [];
	var x = 0;
	for (x=0;x<tagForm.tag.length;x++){
		if (tagForm.tag[x].selected){
			//Saved as a list
			selectedTags.push(tagForm.tag[x].value);
		}
	}
	$.post('/user/uploadphoto',{title: name, description: description, imgdata: uploadedPic,tags:selectedTags},function(data){
		if(data.error){
			alert(data.error);
		}else{
			alert(data)
		}
	});
}
function searchUser(){
var username = document.getElementById("SUsername").value
$.post('/user/search',{username: username},function(data){
if(data.error){
alert(data.error);
}
else{window.location.href = data.success;}
//window.location.reload();
});
}

//Display the picture
//function showpic(){
//$.get('/user/getpics',{},function(data){});
//	$('#newPic').attr('src', uploadedPic);
//}
