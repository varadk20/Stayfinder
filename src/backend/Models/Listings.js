const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userEmail: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  image: String,
  description: String,
  address: String,
  email: String,
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }
});

const ListingModel = mongoose.model("details", listingSchema);
module.exports = ListingModel;
//ezekiel