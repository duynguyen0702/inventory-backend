const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: String,
  quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
