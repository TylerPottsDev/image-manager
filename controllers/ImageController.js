const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const ImageModel = require("../models/ImageModel");
const ObjectId = require("mongoose").Types.ObjectId;

let directory = path.join(__dirname, "../public/images");

module.exports = {
	uploadImage: (req, res) => {
		let form = new formidable.IncomingForm();

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}

		form.uploadDir = directory;

		form.parse(req, (err, fields, files) => {
			if (err) throw err;

			let ImageObject = new ImageModel({
				title: fields.title,
				filename: files.image.name
			});

			fs.rename(files.image.path, path.join(directory, files.image.name), (err) => {
				if (err) throw err;
				
				ImageObject.save((err, image) => {
					if (err) throw err;

					res.setHeader("Content-Type", "application/json");
					res.status(200).send(image);
				});
			});
		});
	},
	retrieveImages: (req, res) => {
		ImageModel.find((err, images) => {
			if (err) throw err;

			res.setHeader("Content-Type", "application/json");
			res.status(200).send(images);
		});
	},
	removeImage: (req, res) => {
		fs.unlinkSync(path.join(directory, req.body.filename));
		ImageModel.remove({_id: ObjectId(req.body._id)}, (err, result) => {
			if (err) throw err;

			res.status(200).send(result);
		});
	}
}