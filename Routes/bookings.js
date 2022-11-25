const express = require("express");
 
let booking = require("../models/Booking");
const router = express.Router();
const authMiddleware = require('../middleWare/authMiddleware');

const { check, validationResult } = require("express-validator");
 
router.get("/", authMiddleware,async (req, res) => {
 //For listing all the bookings with status pending....
 try {
   const bookings = await booking.find({ user: req.user._id }); //status 1 refers to booking pending / awaiting admin approval.
   res.send(bookings);
 } catch (err) {
   return res.status(500).send("Server error");
 }
});


 
// router.get("/:id", async (req, res) => {
//    try {
//      const bookings = await booking.find({ userId: req.params.userId }); //status 1 refers to booking pending / awaiting admin approval.
//      res.send(bookings);
//    } catch (err) {
//      return res.status(500).send("Server error");
//    }
//  });
 
//For updating the car status (Approving/Rejecting) from admin side.
router.put(
 "/",
 [check("statusUpdate", "no status update found").not().isEmpty()],
 async (req, res) => {
  
   try {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
     const bookings = await booking.findOne({ CarId: req.body.carId });
     bookings.status = req.body.statusUpdate;
     await bookings.save();
     res.send(bookings);
   } catch (err) {
     return res.status(500).send("Server error");
   }
 }
);
 
 
 
//Post request to book car

router.post(
 '/',authMiddleware,
  [
  //  check('carId', 'id is required').not().isEmpty(),
  //  check('userId', 'id required').isLength({
  //    min: 4,
  //  }),
   check('dateFrom', 'date is required').not().isEmpty(),
   check('dateTo', 'date is required').not().isEmpty(),
 
 ],
 async (req, res) => {
   try {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
   const bookCar = await booking.create({
     user:req.user._id,
     carId: req.body.carId,
     carName: req.body.carName,
     carType: req.body.carType,
     totalPrice: req.body.totalPrice,
     dateFrom: req.body.dateFrom,
     dateTo: req.body.dateTo,
     status: req.body.status
   });
   res.send(bookCar);
 } catch (err) {
   return res.status(500).send('Server error');
 }
});

//check booked slots
router.get('/:carId', async (req, res) => {
  try {
    const booking2 = await booking.find({ carId: req.params.carId });
    if (!booking2) {
      return res.status(404).send('car not found');
    }
    res.send(booking2);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});
 
module.exports = router;

