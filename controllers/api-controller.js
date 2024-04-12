const { log } = require("console");
const fs = require("fs");

const getAllUsers = async (_req, res) => {
    try {
        const usersData = fs.readFileSync("./data/user-details.json");
        const parsedData = JSON.parse(usersData);
        res.status(200).json(parsedData);
    } catch (err) {
        res.status(400).send(`Error retrieving Users: ${err}`)
    }
}

const getUser = async (req, res) => {

    const userId = req.params.id
    const usersJSONString = fs.readFileSync("./data/user-details.json");
    const userDetails = JSON.parse(usersJSONString);
    const user = userDetails.find((user) => user.id === parseInt(userId));


    if (!user) {
        return res.status(404).json({
            message: `User with ID ${req.params.id} not found`
        })
    }


    res.status(200).json(user);
}

// const getUserOrders = async (req, res) => {
//     try {
//         // const inventories = await knex("inventories")
//         //     .where({ warehouse_id: req.params.id })
//         if (orders.length === 0) {
//             return res.status(404).json({
//                 message: `No orders found for warehouse with ID ${req.params.id}`
//             });
//         }
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({
//             message: `Unable to retrieve inventories for warehouse with ID ${req.params.userId}`,
//         });
//     }
// };


const getAllProducts = async (_req, res) => {
    try {
        const productsData = fs.readFileSync("./data/product-details.json");
        const parsedData = JSON.parse(productsData);
        res.status(200).json(parsedData);
    } catch (err) {
        res.status(400).send(`Error retrieving products: ${err}`);
    }
}


const getProductItem = async (req, res) => {
    try {
        const productId = req.params.id
        const productsJSONString = fs.readFileSync("./data/product-details.json");
        const productDetails = JSON.parse(productsJSONString);
        console.log(req.params.id);
        console.log('Product Item', productDetails[0].id);
        const productItem = productDetails.find((product) => product.id === productId);

        if (productItem.length === 0) {
            return res.status(404).json({
                message: `User with ID ${req.params.id} not found`
            })
        }


        if (!productItem) {
            return res.status(404).json({
                message: `Inventory item with ID ${id} not found`
            });
        }
        res.status(200).json(productItem);
    } catch (error) {
        res.status(500).json({
            message: `Unable to retrieve product item with ID ${req.params.id}: ${error}`
        });
    }
};


module.exports = {
    getAllUsers,
    getUser,
    // getUserOrders,
    getAllProducts,
    getProductItem
};