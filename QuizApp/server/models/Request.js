// requestModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requestSchema = new mongoose.Schema({
  senderId: {
    type:  Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected','canceled'],
    default: 'pending'
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
