const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const ShortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clickCount: { type: Number, default: 0 },
  clicks: [ClickSchema]
});

module.exports = mongoose.model("ShortUrl", ShortUrlSchema);
