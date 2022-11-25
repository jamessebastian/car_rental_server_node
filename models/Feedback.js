const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    require: true,
  },
  
  feedback: {
    type: String,
    require: [true, 'please add feedback'],
  },
  date: {
    type: String,
    require: [true, 'please add feedback'],
  },
});
module.exports = mongoose.model('Feedback', feedbackSchema);
