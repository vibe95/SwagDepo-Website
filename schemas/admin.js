var mongoose = require('mongoose');

//Create and compile schema
var userSchema = mongoose.Schema({
	fullname: String,
	location: String,
    username: String,
    email: String,
    password: String,
    description: String,
    styles: [String],
    photos:[mongoose.Schema.Types.ObjectId],
    //prevcomments:[mongoose.Schema.Types.ObjectId]//May not be necessary depending.
});

module.exports = mongoose.model('admin', userSchema);
