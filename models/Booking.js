const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bookingSchema = Schema({    //add a user model relation for user id...
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  carId: {
    type: String,
    require: true,
  },
  carName: {
    type: String,
    require: true,
  },
  carType: {
    type: String,
    require: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  dateFrom: {
    type: String,
    require: true,
  },
  dateTo: {
    type: String,
    require: true,
  },
  status:{
    type: String,
    require: true,
  }
});
bookingSchema.plugin(AutoIncrement, {inc_field: 'b_id'});
module.exports = mongoose.model("Booking", bookingSchema);
