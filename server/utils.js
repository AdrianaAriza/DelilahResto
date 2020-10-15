const server = require("./server");


async function getByParam(table_name, attribute = "TRUE", inputParam = "TRUE", getAll = false) {
	const searchResults = await server.sequelize.query(`SELECT * FROM ${table_name} WHERE ${attribute} = :replacementParam`, {
		replacements: { replacementParam: inputParam },
		type: server.QueryTypes.SELECT,
	});
	if (searchResults) {
		if (!getAll) {
			return searchResults[0]
		}
		return searchResults
	}
	return false;
};

module.exports.getByParam = async function (table_name, attribute = "TRUE", inputParam = "TRUE", getAll = false) {
	const searchResults = await server.sequelize.query(`SELECT * FROM ${table_name} WHERE ${attribute} = :replacementParam`, {
		replacements: { replacementParam: inputParam },
		type: server.QueryTypes.SELECT,
	});
	console.log(searchResults)
	if (searchResults) {
		if (!getAll) {
			return searchResults[0]
		}
		return searchResults
	}
	return false;
};

module.exports.validateToken = async function (req, res, next) {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const verification = server.jwt.verify(token, server.signature);
		const found_user = await getByParam("users", "user_id", verification.user_id);
		const isDisabled = !!found_user.is_disabled;
		if (isDisabled) {
			res.status(401).json("Unauthorized - User account is disabled");
		} else {
			req.token_info = verification;
			next();
		}
	} catch (e) {
		res.status(401).json("Unauthorized - Invalid Token");
	}
};

module.exports.genToken = function (info) {
	return server.jwt.sign(info, server.signature);
};

module.exports.filter_sensitive_data = function (userArray, filters) {
	return userArray.map((user) => {
		filters.forEach((filter) => delete user[filter]);
		return user;
	});
}
module.exports.cleanData = function (inputObject) {
	Object.keys(inputObject).forEach((key) => !inputObject[key] && delete inputObject[key]);
	return inputObject;
}

module.exports.isAdmin = function (req, res, next) {
	if (req.token_info.is_admin) {
		next()
	}
	else {
		res.status(401).json("Unauthorized - Not an admin");
	}
}