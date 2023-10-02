import mongoose from 'mongoose';

// Define a schema for the selected items
const buySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: [],
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Define the main buy schema

// Create a model for the Buy schema
export default mongoose.model('Buy', buySchema);