const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ListingModel = require('./src/backend/Models/Listings');
const bcrypt = require('bcrypt');
require('dotenv').config();
const userModel = require('./src/backend/Models/Users')

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

//get listings from mongodb
app.get('/getListings', (req, res) => {
    ListingModel.find()
    .then(details => res.json(details))
    .catch(err=>res.json(err))
})


//register new user
app.post('/getUser', async (req, res)=>{
  const { email, password } = req.body;


  try{
    //check for existing user
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new userModel({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  }

  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

})


// login existing user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//for details page
app.get('/getListingById/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await ListingModel.findById(id);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});



// add new listing
app.post('/addListing', async (req, res) => {
  const { name, location, price, image, description, address, email} = req.body;

  if (!name || !location || !price || !image || !description || !address || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newListing = new ListingModel({
      name,
      location,
      price,
      image, // base64 string
      description,
      address,
      email,
    });

    await newListing.save();
    res.status(201).json({ message: 'Listing added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Backend Route to Get Listings by User
app.get('/getUserListings/:email', async (req, res) => {
  try {
    const listings = await ListingModel.find({ email: req.params.email });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching listings' });
  }
});


// Delete listing by ID
app.delete('/deleteListing/:id', async (req, res) => {
  try {
    await ListingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting listing' });
  }
});


// Update listing by ID
app.put('/updateListing/:id', async (req, res) => {
  const { name, location, price, image, description, address } = req.body;

  try {
    await ListingModel.findByIdAndUpdate(req.params.id, {
      name,
      location,
      price,
      image,
      description,
      address,
    });
    res.status(200).json({ message: 'Listing updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// stripe payment gateway
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { amount, name } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name },
            unit_amount: amount, // in paisa
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_FRONTEND_URL}/status?payment=success`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/status?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe error" });
  }
});



//Render dynamically assigns a port and exposes it through process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
