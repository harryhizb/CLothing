// Import the mongoose library
const mongoose = require('mongoose');

// Define the schema
const notificationSchema = new mongoose.Schema({
  notificationName: {
    type: String,
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
export default mongoose.model('notification', notificationSchema);
