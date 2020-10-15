const express = require("express");
router = express.Router();
const utils = require("./utils");
const server = require("./server");

router.get("/products", utils.validateToken, async (req, res, next) => {
	const products = await utils.getByParam("products", "is_disabled", false, true);
	res.status(200).json(products);
});

router.post("/products", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const { name, price } = req.body;
	try {
		const product = await utils.getByParam("products", "name", name);
		if (product) {
			res.status(400).json("Product already exists, you can update it");
		}
		if (name && price) {
			const insert = await server.sequelize.query(
				"INSERT INTO products (name, price ) VALUES (:name, :price)",
				{ replacements: { name, price } }
			);
			res.status(200).json('New product added');
		} else {
			res.status(400).json("Error validating input data");
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.put("/products/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const product_id = req.params.id;
	try {
		const product_found = await utils.getByParam("products", "product_id", product_id);
		if (product_found) {
			const { name, price, is_disabled } = req.body;
			const filtered_props = utils.cleanData({ name, price, is_disabled });
			const updatedProduct = { ...product_found, ...filtered_props };
			const update = await server.sequelize.query(
				"UPDATE products SET name = :name, price = :price, is_disabled = :is_disabled \
				WHERE product_id = :product_id",
				{
					replacements: {
						product_id: product_id,
						name: updatedProduct.name,
						price: updatedProduct.price,
						is_disabled: updatedProduct.is_disabled,
					},
				}
			);
			res.status(200).json(`Product ${name} with id ${product_id} has been modified`);
		} else {
			res.status(404).json("No product found");
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.delete("/products/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
	const product_id = req.params.id;
	try {
		const product_found = await utils.getByParam("products", "product_id", product_id);
		if (product_found) {
			const update = await server.sequelize.query("DELETE FROM products WHERE product_id = :product_id", {
				replacements: {
					product_id: product_id,
				},
			});
			res.status(200).json(`Product with id ${product_id} was deleted`);
		} else {
			res.status(404).json(`No product matches with id=${product_id}`);
		}
	} catch (error) {
		next(new Error(error));
	}
});

router.get("/products/:id", utils.validateToken, async (req, res) => {
	const product = await utils.getByParam("products", "product_id", req.params.id);
	if (product) {
		res.status(200).json(product)
	}
	else {
		res.status(404).json("No product found");
	}
});

module.exports = router;