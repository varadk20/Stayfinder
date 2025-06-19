const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    image:String,
    name: String,
    location: String,
    price: Number
})

const ListingModel = mongoose.model('details', listingSchema);
module.exports = ListingModel;