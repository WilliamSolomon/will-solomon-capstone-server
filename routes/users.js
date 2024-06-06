const router = require("express").Router();;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/authorize');

// ## POST /api/users/register
// - Creates a new user.
// - Expected body: { first_name, last_name, phone, address, email, password }
router.post("/register", async (req, res) => {
    const { first_name, last_name, phone, address, email, password } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send("Please enter the required fields.");
    }

	// Create a hashed Password using brcrypt.hashSync(password) 
	const hashedPassword = bcrypt.hashSync(password)

    // Create the new user
    const newUser = {
        first_name,
        last_name,
        phone,
        address,
        email,
        password: hashedPassword, //update password to use hashed password
    };

    // Insert it into our database
    try {
        await knex('users').insert(newUser);
        res.status(201).send("Registered successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Failed registration");
    }
});

// ## POST /api/users/login
// -   Generates and responds a JWT for the user to use for future authorization.
// -   Expected body: { email, password }
// -   Response format: { token: "JWT_TOKEN_HERE" }
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    // Find the user using the email 
	const user = await knex('users').where({email: email}).first();
	// If theres no user return a status of 400 and send text "Invalid email"
	if (!user) {
		return res.status(400).send("Invalid Email")
	}

    // Validate the password using bcrypt.compareSync(password, user.password)
	const isPasswordCorrect = bcrypt.compareSync(password, user.password)
	// If the password is not correct then send send status of 400 with a message "Invalid Password"
	if(!isPasswordCorrect) {
		return res.status(400).send("Invalid Password")
	}
    // Generate a token with JWT
	const token = jwt.sign(
		{id: user.id, email: user.email},
		process.env.JWT_KEY,
		{ expiresIn: '24h' }
	)
	// Issue the user their token 
    res.json({ token: token })
});


router.get("/current", authorize, async (req, res) => {
   
	try{
        //req.user should have {id,email}
        //could put this line below in middleware too so you have 
        //actual user data in all your endpoints
		const user = await knex('users').where({id: req.user.id}).first();
        res.json(user);
    } catch (error) {
        return res.status(500).send(`Unknown server error: ${error}`);
    }
});


//Demonstrate using auth on a single route
// Use authorize middleware to protect this route
router.get("/", authorize, async (req, res)=> {
    try {
		const users = await knex
		.select("*")
		.from("users")
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Unable to retrieve users data" });
	}
})



module.exports = router;
