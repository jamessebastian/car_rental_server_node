const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = Schema({
  // id: {
  //   type: Number,
  //   require: true,
  // },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  age: {
    type: Number,
    require: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  phone: {
    type: Number,
    require: true,
  },
});
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model("User", userSchema);
