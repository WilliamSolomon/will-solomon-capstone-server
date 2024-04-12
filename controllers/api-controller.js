const { log } = require("console");
const fs = require("fs");

const getAllUserAlert = async (_req, res) => {
    try {
        const userId = req.params.id;
        const alertsData = fs.readFileSync("./data/alert-details.json");
        const parsedData = JSON.parse(alertsData);

        //Filter for specific user
        const userAlerts = parsedData.filter(alert => alert.user_id === userId);

        res.status(200).json(userAlerts);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) alerts: ${err}`)
    }
}


const addWarehouse = async (req, res) => {
    try {
        const { warehouse_name, address, country, city, contact_name, contact_position, contact_phone, contact_email } = req.body;
        const newWarehouse = await knex('warehouses')
            .insert({
                warehouse_name, address, country, city, contact_name, contact_position, contact_phone, contact_email
            })

        res.status(201).json(newWarehouse);
    } catch (error) {
        res.status(500).json({
            message: `Unable to add new warehouse: ${error}`,
        });
    }
};





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
    getAllUserAlert
};