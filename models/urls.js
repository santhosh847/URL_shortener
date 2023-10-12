const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/urlshortener");
const Schema = mongoose.Schema;
const UrlSchema = new Schema({
	preferred: String,
	originalUrl: String,
});

const Url = mongoose.model("Url", UrlSchema);

UrlSchema.pre("save", (req, res, next) => {
	const { preferred, originalUrl } = req.body;
	Url.findOne({ preferred });
	if (!Url) req.body.isPresent = false;
	else req.body.isPresent = true;
	next();
});
module.exports = Url;
