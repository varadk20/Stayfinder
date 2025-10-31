const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['host', 'guest'], required: true }, // NEW
    phone: { type: String, required: true, match: /^[0-9]{10}$/  }
});


const userModel = mongoose.model('users', userSchema, 'Users');
module.exports = userModel;
