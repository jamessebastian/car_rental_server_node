const express = require('express');
let About = require('../models/Aboutus');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require("../middleWare/authMiddleware");
const Aboutus = require('../models/Aboutus');


// aboutus
router.get('/', async (req, res) => {
  try {
    const aboutus = await About.find();
    res.send(aboutus);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//update About 
router.put(
    '/',
    
    [
        check("title", "Title is required").not().isEmpty(),
        check("description", "Please enter description").not().isEmpty(),

  
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        let updateAbout = await Aboutus.findOne({ title: req.body.title }).exec();
        updateAbout.description = req.body.description;
        await updateAbout.save();
        res.send(updateAbout);
    } catch (err) {
      return res.status(500).send('Server error');
    }
  });

  //create About 
router.post(
  '/',
  
  [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Please enter description").not().isEmpty(),


  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    const newAbout = await About.create({
      title: req.body.title,
      description: req.body.description, 
    });
    res.send(newAbout);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});
module.exports = router;