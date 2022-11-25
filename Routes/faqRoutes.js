const express = require('express');
let Faq = require('../models/Faq');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// get all faq
router.get('/', async (req, res) => {
  try {
    const faq = await Faq.find();
    res.send(faq);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//create Faq Admin
router.post(
    '/',
    
    [
      check('question', 'question is required').not().isEmpty(),
      check('answer', 'answer is required').isLength({
        min: 4,
      }),
  
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      const newFaq = await Faq.create({
        question: req.body.question,
        answer: req.body.answer,  
      });
      res.send(newFaq);
    } catch (err) {
      return res.status(500).send('Server error');
    }
  });
  
  //delete
  router.delete('/', async (req, res) => {
    try {
      const faq = await faq.findOneAndRemove({ _id: req.body.id });
      if (!faq) {
        return res.status(404).send('faq not found');
      }
  
      res.send('faq deleted');
    } catch (err) {
      return res.status(500).send('Server error');
    }
  });
  module.exports = router;