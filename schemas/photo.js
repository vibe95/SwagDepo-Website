var mongoose = require('mongoose');

//Create and compile schema
var photoSchema = mongoose.Schema({
    title: String,
    author: mongoose.Schema.Types.ObjectId,
    image_data: String,
    description: String,
    tags:[String],
    created: { type: Date, default: Date.now },
    comments:[{
    	user: mongoose.Schema.Types.ObjectId,
    	text: String,
    	time: Date
    }],
    Likes: Number,
    Dislikes: Number
});

module.exports = mongoose.model('photo', photoSchema);
