const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let User = require('../models/User');
const authMiddleware = require('../middleWare/authMiddleware');



router.get('/', authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

//route Post api/auth
//desc login user
//access public
router.post(
  '/',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password  required').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      //user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: 'invalid credentials' });
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: 'Incorrect Password' });
      }

      const payload = {
        user: {
          _id: user._id,
          name: user.firstname,
          role:user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;