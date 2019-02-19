const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
	title: String,
	filename: {type: String, unique: true}
});

const ImageModel = new mongoose.model("image", ImageSchema);

module.exports = ImageModel;