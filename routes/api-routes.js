const router = require("express").Router();
const apiController = require("../controllers/api-controller");


router
    .route("/users")
    .get(apiController.getAllUsers)

router 
    .route("/users/:id")
    .get(apiController.getUser)

// router
//     .route("/users/:id/orders")
//     .get(apiController.getUserOrders)

router
    .route("/products")
    .get(apiController.getAllProducts)


router
    .route("/products/:id")
    .get(apiController.getProductItem)

module.exports = router;

