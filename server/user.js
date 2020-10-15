const express = require("express");
const utils = require("./utils");
const server = require("./server");

router = express.Router();

router.post("/users", async (req, res, next) => {
	const { username, password, email, delivery_address, full_name, phone } = req.body;
	try {
		const new_username = await utils.getByParam("users", "username", username);
		const new_email = await utils.getByParam("users", "email", email);
		if (new_username) {
			res.status(409).json("Username already exists, please use another");
			return;
		}
		if (new_email) {
			res.status(409).json("Email already exists, please use another");
			return;
		}
		if (username && password && email && delivery_address && full_name && phone) {
			const insert = await server.sequelize.query(
				"INSERT INTO users (username, password, full_name, email, phone, delivery_address) \
				VALUES (:username, :password, :full_name, :email, :phone, :delivery_address)",
				{ replacements: { username, password, full_name, email, phone, delivery_address } }
			);
			res.status(200).json("Your account has been created");
		} else {
			res.status(400).json("Error validating data");
		}
	} catch (error) {
		console.log(error);
		next(new Error(error));
	}
});
router.get("/users", utils.validateToken, async (req, res, next) => {
	const user_id = req.token_info.user_id;
	try {
		let filtered_users = [];
		if (req.token_info.is_admin) {
			const found_users = await utils.getByParam("users", true, true, true);
			filtered_users = found_users.map((user) => {
				delete user.password;
				return user;
			});
		} else {
			const found_user = await utils.getByParam("users", "user_id", user_id, true);
			filtered_users = found_user.map((user) => {
				delete user.password;
				return user;
			});
		}
		if (filtered_users.length) {
			res.status(200).json(filtered_users);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.get("/users/login", async (req, res, next) => {
	const { usuario, email, password } = req.body;
	try {
		if ((usuario && password) || (email && password)) {
			if (usuario) {
				user = await utils.getByParam("users", "username", usuario);
			}
			else {
				user = await utils.getByParam("users", "email", email);
			}
			if (user.is_disabled) {
				res.status(401).json("Invalid request, user account disabled");
			} else if (user.password === password) {
				const token = utils.genToken({
					username: user.username,
					user_id: user.user_id,
					is_admin: user.is_admin,
				});
				res.status(200).json(token);
			} else {
				res.status(400).json("Invalid username/password supplied");
			}
		}
		else {
			res.status(400).json("mail/username and password are required");
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.put("/users", utils.validateToken, async (req, res, next) => {
	const token = req.token_info;
	const user_username = token.username;
	const user_password = token.password;
	console.log(user_password)
	try {
		const { id, username, password, full_name, email, phone, delivery_address } = req.body;
		let found_user = await utils.getByParam("users", "email", email);
		if (!found_user) {
			found_user = await utils.getByParam("users", "username", username);
		}
		if (found_user) {

			if (password === found_user.password || token.is_admin) {
				const existing_username = await utils.getByParam("users", "username", username);
				const existing_email = await utils.getByParam("users", "email", email);
				if (found_user.username != username) {
					if (existing_username) {
						res.status(409).json("Username already exists, use another");
						return;
					}
				}
				if (found_user.email !== email) {
					console.log(found_user.email, token.email)
					if (existing_email) {
						res.status(409).json("Email already exists, use another");
						return;
					}
				}
				const filtered_props = utils.cleanData({ id, username, full_name, email, phone, delivery_address });
				const updated_user = { ...found_user, ...filtered_props };
				const update = await server.sequelize.query(
					"UPDATE users SET username = :username, full_name = :full_name, email = :email,\
					phone = :phone, delivery_address = :delivery_address WHERE user_id = :user_id",
					{
						replacements: {
							username: updated_user.username,
							full_name: updated_user.full_name,
							email: updated_user.email,
							phone: updated_user.phone,
							delivery_address: updated_user.delivery_address,
							user_id: updated_user.id,
						},
					}
				);
				res.status(200).json("User was modified correctly");
			}
			else {
				res.status(404).json("Unauthorized - Invalid Token or password");
			}
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.delete("/users/id/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const token = req.token_info;
	const user_id = req.params.id;
	try {
		await server.sequelize.query("DELETE FROM users WHERE user_id = :user_id", {
			replacements: {
				user_id,
			},
		});
		res.status(200).json("User deleted");
	} catch (error) {
		next(new Error(error));
	}
});
router.get("/users/:username", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const username = req.params.username;
	try {
		let found_user = await utils.getByParam("users", "username", username, true);
		if (found_user.length) {
			filtered_user = utils.filter_sensitive_data(found_user, ["password"]);
			res.status(200).json(filtered_user);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		next(new Error(error));
	}
});
router.put("/users/:username", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const username = req.params.username;
	try {
		const found_user = await utils.getByParam("users", "username", username);
		const user_id = found_user.user_id;
		if (found_user) {
			const { username, password, full_name, email, phone, delivery_address, is_disabled } = req.body;
			const existing_username = await utils.getByParam("users", "username", username, true);
			const existing_email = await utils.getByParam("users", "email", email, true);
			const repeated_username =
				existing_username && existing_username.map((user) => utils.infoExists(user_id, user.user_id));
			const repeated_email =
				existing_email && existing_email.map((user) => utils.infoExists(user_id, user.user_id));
			if (repeated_username && repeated_username.some((value) => value === true)) {
				res.status(409).json("Username already exists, please pick another");
				return;
			}
			if (repeated_email && repeated_email.some((value) => value === true)) {
				res.status(409).json("Email already exists, please pick another");
				return;
			}
			const filtered_props = utils.cleanData({
				username,
				password,
				full_name,
				email,
				phone,
				delivery_address,
				is_disabled,
			});
			const updatedUser = { ...found_user, ...filtered_props };
			const update = await server.sequelize.query(
				`UPDATE users SET username = :username, password = :password, full_name = :full_name,\
				 email = :email, phone = :phone, delivery_address = :delivery_address,\
				  is_disabled = :is_disabled WHERE user_id = :user_id`,
				{
					replacements: {
						username: updatedUser.username,
						password: updatedUser.password,
						full_name: updatedUser.full_name,
						email: updatedUser.email,
						phone: updatedUser.phone,
						delivery_address: updatedUser.delivery_address,
						user_id: user_id,
						is_disabled: updatedUser.is_disabled,
					},
				}
			);
			res.status(200).json(`User ${username} was modified correctly`);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		next(new Error(error));
	}
});
router.delete("/users/:username", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const username = req.params.username;
	try {
		const found_user = await utils.getByParam("users", "username", username);
		if (!found_user) {
			res.status(404).json("User not found");
			return;
		}
		await server.sequelize.query("DELETE FROM users WHERE username = :username", {
			replacements: {
				username: username,
			},
		});
		res.status(200).json(`User ${username} was deleted`);
	} catch (error) {
		next(new Error(error));
	}
});

module.exports = router;