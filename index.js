const express = require('express');
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5050;

const apiRoutes = require('./routes/api-routes');

// Enable CORS
const cors = require("cors")
app.use(cors());

// Enable middleware post of JSON in request body
app.use(express.json());

// Serve static files from the /assets/images folder
app.use("/images", express.static("images"));


// All API routes
app.use('/api', apiRoutes);


app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
});