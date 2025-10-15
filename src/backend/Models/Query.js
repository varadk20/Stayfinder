const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
