const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqschema = Schema({
  question: {
    type: String,
    require: true,
  },
  answer: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Faq', faqschema);
