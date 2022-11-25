const express = require("express");
// const authMiddleware = require('../middlewares/authMiddleware');
let Car = require("../models/Car");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const adminMiddleware = require("../middleWare/adminMiddleware");

//route Post api/cars
//desc Insert car
//access public
router.post(
  "/",
  // adminMiddleware,
  [
    check("name", "name is required").not().isEmpty(),
    check("type", "type need to be 6 char or more").isLength({
      min: 4,
    }),
    check("price", "price is required").not().isEmpty(),
    // check('image', 'image is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
	  const file = req.files.myFile;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const path2 = "public/uploads/" + file.name;

      file.mv(path2, function (err) {
        if (err) return res.status(500).send(err);

        //res.send("File uploaded!");
      });
      const newCar = await Car.create({
        name: req.body.name,
        brand: req.body.brand,
        type: req.body.type,
        price: req.body.price,
        image: file.name,
      });
      res.send(newCar);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

// route Get api/cars
// desc Get all Cars
// access public
router.get("/", async (req, res) => {
  try {
    console.log("asd");
    const carDB = await Car.find();
    res.send(carDB);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Get api/cars/:id
//desc Get car by id
//access public
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("car not found");
    }
    res.send(car);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route delete api/cars
//desc delete caar by id
//access public
router.delete("/", async (req, res) => {
  try {
    const car = await Car.findOneAndRemove({ _id: req.body._id });
    if (!car) {
      return res.status(404).send("car not found");
    }

    res.send("car deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route put api/cars
//desc update car
//access public
router.put("/", async (req, res) => {
  try {
    const car = await Car.findById(req.body.id);
    if (!car) {
      return res.status(404).send("car not found");
    }
    car.name = req.body.name;
    car.type = req.body.type;
    car.price = req.body.price;
    car.image = req.body.image;
    await car.save();
    res.send(car);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
