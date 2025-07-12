const mongoose = require('mongoose');

const swapSchema = mongoose.Schema(
  {
    requestor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    skillOffered: {
      type: String,
      required: [true, 'Please specify the skill you are offering'],
    },
    skillWanted: {
      type: String,
      required: [true, 'Please specify the skill you want'],
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    feedback: {
      fromRequestor: {
        rating: Number,
        comment: String,
      },
      fromRecipient: {
        rating: Number,
        comment: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Swap', swapSchema); 