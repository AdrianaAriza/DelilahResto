const express = require("express");
const server = express();
const bp = require("body-parser");
const jwt = require("jsonwebtoken");
const signature = "S3cr37K3y";
const { DB_HOST, DB_NAME, DB_USER, DB_PWD, DB_PORT } = require("../constans");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
const cors = require("cors");
const params = require("./utils");

server.use(cors());

server.use(bp.json());
server.listen("3000", () => {
	console.log("Server Started on Port 3000 - Delilah Resto");
});

server.use("", require("./orders"));
server.use("", require("./user"));
server.use("", require("./products"));


module.exports.genToken = function (info) {
	return jwt.sign(info, signature);
};

server.use((err, req, res, next) => {
	if (!err) return next();
	console.log("An error has occurred", err);
	res.status(500).json(err.message);
	throw err;
});

module.exports.sequelize = sequelize;
module.exports.QueryTypes = QueryTypes
module.exports.jwt = jwt
module.exports.signature = signature
module.exports.express = express
