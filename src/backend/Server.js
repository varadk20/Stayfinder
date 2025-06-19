const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ListingModel = require('./Models/Listings');
const bcrypt = require('bcrypt');
require('dotenv').config();
const userModel = require('./Models/Users')

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




app.listen(3000, () => {
  console.log('Server is running on port 3000');
})