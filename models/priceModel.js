const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  price1: { type: Number, default: 0 },
  price2: { type: Number, default: 0 },
  createDate: { type: String },
});

module.exports = mongoose.model("Price", priceSchema);
