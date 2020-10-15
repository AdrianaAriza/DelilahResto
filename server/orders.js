const express = require("express");
router = express.Router();
const utils = require("./utils");
const server = require("./server");
const valid_order_status = ["new", "confirmed", "preparing", "sending", "delivered", "canceled"];


router.post("/orders", utils.validateToken, async (req, res, next) => {
    const user_id = req.token_info.user_id;
    const { data, payment_method } = req.body;
    try {
        const get_order_details = await Promise.all(
            data.map((product) => utils.getByParam("products", "product_id", product.product_id))
        );

        if (get_order_details.some((product) => product.is_disabled)) {
            res.status(403).json("One or more products are not available");
        } else if (get_order_details.every((product) => !!product === true)) {
            const orderData = async () => {
                let total = 0;
                let description = "";
                get_order_details.forEach((product, index) => {
                    total += product.price * data[index].amount;
                    description += `${data[index].amount}x ${product.name}, `;
                });
                description = description.substring(0, description.length - 2);
                return [total, description];
            };

            const [total, description] = await orderData();
            const order = await server.sequelize.query(
                "INSERT INTO orders (status, date, description, payment_method, total, user_id) \
                 VALUES (:status, :date, :description, :payment_method, :total, :user_id)",
                {
                    replacements: {
                        status: "new",
                        date: new Date(),
                        description,
                        payment_method: payment_method,
                        total,
                        user_id,
                    },
                }
            );

            data.forEach(async (product) => {
                const order_products = await server.sequelize.query(
                    "INSERT INTO orders_products (order_id, product_id, product_amount) \
                    VALUES (:order_id, :product_id, :product_amount)",
                    {
                        replacements:
                        {
                            order_id: order[0],
                            product_id: product.product_id,
                            product_amount: product.amount
                        }
                    }
                );
            });
            res.status(200).json("Your order has been created");
        } else {
            res.status(400).json("Error validating data");
        }
    } catch (error) {
        next(new Error(error));
    }
});

router.get("/orders", utils.validateToken, async (req, res, next) => {
    try {
        let orders = [];
        if (req.token_info.is_admin) {
            orders = await server.sequelize.query(
                "SELECT * FROM orders INNER JOIN users ON orders.user_id = users.user_id ORDER BY date DESC;",
                {
                    type: server.QueryTypes.SELECT,
                }
            );
        } else {
            const user = req.token_info.user_id;
            orders = await server.sequelize.query(
                "SELECT * FROM orders INNER JOIN users ON orders.user_id = users.user_id \WHERE users.user_id = :user;",
                {
                    replacements: { user_id: user_id },
                    type: server.QueryTypes.SELECT,
                }
            );
        }
        const detailed_orders = await Promise.all(
            orders.map(async (order) => {
                const order_products = await server.sequelize.query(
                    "SELECT * FROM orders_products INNER JOIN products WHERE order_id = :order_id AND orders_products.product_id = products.product_id",
                    {
                        replacements: { order_id: order.order_id },
                        type: server.QueryTypes.SELECT,
                    }
                );
                order.products = order_products;
                return order;
            })
        );

        if (!!detailed_orders.length) {
            const filtered_orders = utils.filter_sensitive_data(orders, ["password", "is_admin", "is_disabled"]);
            res.status(200).json(filtered_orders);
        } else {
            res.status(404).json("Search didn't bring any results");
        }
    } catch (error) {
        next(new Error(error));
    }
});

router.get("/orders/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
    const order_id = req.params.id;
    try {
        const order = await server.sequelize.query(
            "SELECT * FROM orders INNER JOIN users ON orders.user_id = users.user_id \
            WHERE orders.order_id = :order_id;",
            {
                replacements: { order_id: order_id },
                type: server.QueryTypes.SELECT,
            }
        );
        if (!!order.length) {
            order[0].products = await server.sequelize.query(
                "SELECT * FROM orders_products INNER JOIN products WHERE order_id = :order_id \
                AND orders_products.product_id = products.product_id",
                {
                    replacements: { order_id: order[0].order_id },
                    type: server.QueryTypes.SELECT,
                }
            );
            delete order[0].password;
            delete order[0].is_admin;
            delete order[0].is_disabled;
            res.status(200).json(order);
        } else {
            res.status(404).json("NO order found");
        }
    } catch (error) {
        next(new Error(error));
    }
});

router.put("/orders/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
    const order_id = req.params.id;
    const { order_status } = req.body;
    try {
        const order = await server.sequelize.query("SELECT * FROM orders WHERE order_id = :order_id;", {
            replacements: { order_id: order_id },
            type: server.QueryTypes.SELECT,
        });

        if (!!order.length) {
            if (valid_order_status.includes(order_status)) {
                const update = await server.sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                    replacements: {
                        order_id: order_id,
                        status: order_status,
                    },
                });
                res.status(200).json(`Status updated`);
            } else {
                res.status(403).json("The state given for the product is not valid");
            }
        } else {
            res.status(404).json("Search didn't bring any results");
        }
    } catch (error) {
        next(new Error(error));
    }
});

router.delete("/orders/:id", utils.validateToken, utils.isAdmin, async (req, res, next) => {
    const order_id = parseInt(req.params.id);
    try {
        const order_found = await utils.getByParam("orders", "order_id", order_id);
        if (order_found) {
            let update = await server.sequelize.query("DELETE FROM orders_products WHERE order_id = :order_id", {
                replacements: {
                    order_id: order_id,
                },
            });
            update = await server.sequelize.query("DELETE FROM orders WHERE order_id = :order_id", {
                replacements: {
                    order_id: order_id,
                },
            });
            res.status(200).json(`Order deleted`);
        } else {
            res.status(404).json("No order found");
        }
    } catch (error) {
        next(new Error(error));
    }
});

module.exports = router;