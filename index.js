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

app.listen(PORT, () => [console.log("listening on port " + PORT)]);
