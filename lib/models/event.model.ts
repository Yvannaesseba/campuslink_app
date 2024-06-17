import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: { 
    type: String, 
    required: true,
    minlength: [3, 'Minimum 3 characters'], 
  },
  description: { 
    type: String, 
    required: true,
    minlength: [3, 'Minimum 3 characters'], 
  },
  date: {
    type: Date, // Adding a new date field
    required: true // Example of requiring a date field
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
 
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
