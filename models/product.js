const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  photos: {
    type: Array,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  stock: {
    type: Number,
  },
  ratings: {
    type: Number,
  },
  numberOfReviews: {
    type: Number,
  },
  reviews: {
    name: {
      type: String,
    },
    user: {
      type: String,
    },
    rating: Number,
    comment: String,
  },
});
