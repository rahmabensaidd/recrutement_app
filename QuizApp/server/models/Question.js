const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Define Question schema
const questionSchema = new Schema({
  // Define fields for the Question schema
  text: { type: String, required: true },
  // Other fields as needed
});
// Register Question model with Mongoose
mongoose.model('Question', questionSchema);
