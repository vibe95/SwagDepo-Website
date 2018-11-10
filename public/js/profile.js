window.onload = function uploadUser(){
	document.getElementById("name").innerHTML = "!{profile_user.fullname}";
	document.getElementById("location").innerHTML = "!{profile_user.location}";
	document.getElementById("description").innerHTML = "!{profile_user.description}";
	document.getElementsByName('Ename')[0].placeholder= "!{profile_user.fullname}";
	document.getElementsByName('Elocation')[0].placeholder= "!{profile_user.location};
	document.getElementById('Edescription').innerHTML= "!{profile_user.description}";
	var stylesList = [];
	var userStyles = "!{profile_user.styles}".split(",");
	for(i = 0; i<userStyles.length;i++){
		stylesList.push(" "+userStyles[i]);
	}
	document.getElementById("Mystyles").innerHTML = stylesList;

	var newlist = !{styles};
	
	//Need to loop twice for it to show in both sections
	for (i = 0; i<newlist.length; i++){
		var option = $('<option></option>').val(newlist[i]).text(newlist[i]);
		$(document.getElementById("selTagE")).append(option);
	}
	for (i = 0; i<newlist.length; i++){
		var option = $('<option></option>').val(newlist[i]).text(newlist[i]);
		$(document.getElementById("selTagUp")).append(option);
	}
}