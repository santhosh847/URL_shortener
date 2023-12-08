const express = require("express");
const app = express();
const Url = require("./models/urls");
require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello from home page 😀");
});

app.get("/urls", async (req, res) => {
	res.json(await Url.find({}));
});

app.get("/:preferred", (req, res) => {
	const { preferred } = req.params;
	res.redirect(`/url/${preferred}`);
});

app.get("/url/:preferred", async (req, res, next) => {
	const { preferred } = req.params;
	const url = await Url.findOne({ preferred });
	if (url) {
		res.redirect("http://" + url.originalUrl);
	} else {
		res.status(404);
		next("url not found");
	}
});

app.post("/url", async (req, res) => {
	const { preferred, originalUrl } = req.body;
	const newUrl = new Url({ preferred, originalUrl });
	if (!req.body.isAlreadyPresent) {
		return res.status(409).send("preferred url already taken! try new");
	}
	await newUrl.save();
	console.log("saved url");
	res.json(newUrl);
});

app.use((err, req, res, next) => {
	if (err == 404) {
		console.log("caught 404");
	}
	res.send(err);
});

app.listen(PORT, () => [console.log("listening on port " + PORT)]);
