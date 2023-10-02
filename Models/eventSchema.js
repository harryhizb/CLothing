import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    // Name of the clothing item
    name: String,

    // Price of the clothing item (should be a number)
    price: Number,

    // Description of the clothing item
    description: String,

    // Status of the clothing item, should be one of ['available', 'not available']
    status: {
      type: String,
      enum: ['available', 'not available'], // Fixed the enum values
      default: 'available',
    },

    // List of users who are interested in this clothing item
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // User who added this clothing item
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model('Events', EventSchema);
