const express = require('express');

const authMiddleware = require('../middleWare/authMiddleware');


let Feedback = require('../models/Feedback');

const uuid = require('uuid');

const router = express.Router();

const { check, validationResult } = require('express-validator');


// get feedback  of user
router.get('/', authMiddleware,async (req, res) => {
  try {
    // const feedbackDB = await Feedback.find();
    const feedbackDB = await Feedback.find({ user: req.user._id });

    res.send(feedbackDB);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// // get all feedback
// router.get('/all', authMiddleware,async (req, res) => {
//   try {
//     // const feedbackDB = await Feedback.find();
//     const feedbackDB = await Feedback.find();

//     res.send(feedbackDB);
//   } catch (err) {
//     return res.status(500).send('Server error');
//   }
// });
// get all feedback
router.get('/all',async (req, res) => {
  try {
    // const feedbackDB = await Feedback.find();
    const feedbackDB = await Feedback.find();

    res.send(feedbackDB);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});


//Post..send feedback
router.post(
  '/',
  authMiddleware,
  [
    check('name', 'name is required').not().isEmpty(),
   
    check('feedback', 'feedback is required').not().isEmpty(),

  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    const newFeedback = await Feedback.create({
      user:req.user._id,
      name: req.body.name,
      email: req.body.email,
      feedback: req.body.feedback,

    });
    res.send(newFeedback);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//delete
// router.delete('/', async (req, res) => {
//   try {
//     const feedback = await Feedback.findOneAndRemove({ _id: req.body.id });
//     if (!feedback) {
//       return res.status(404).send('feedback not found');
//     }

//     res.send('feedback deleted');
//   } catch (err) {
//     return res.status(500).send('Server error');
//   }
// });


router.delete("/:id", async (req, res) => {
  try {
    const user = await Feedback.findOneAndDelete({ _id: req.params.id }); 
    res.send(user);
  } catch (err) {
    return res.status(404).send("Not found");
  }
});

module.exports = router;
