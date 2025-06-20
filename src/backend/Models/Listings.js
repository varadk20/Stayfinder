const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  image: String, 
  description: String,
  address: String,
  email: String,
});

const ListingModel = mongoose.model("details", listingSchema);
module.exports = ListingModel;
