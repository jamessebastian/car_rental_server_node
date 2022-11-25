const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const carSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: [true, "please add type"],
  },
  price: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
});
carSchema.plugin(AutoIncrement, { inc_field: "car_id" });
module.exports = mongoose.model("Car", carSchema);
