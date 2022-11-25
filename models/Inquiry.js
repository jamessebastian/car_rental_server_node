const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const InquiriesSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
    minLength: 25,
  },
});

InquiriesSchema.plugin(AutoIncrement, {inc_field: 'c_id'});
module.exports = mongoose.model("Inquiries", InquiriesSchema);