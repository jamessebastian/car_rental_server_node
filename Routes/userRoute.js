const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const authMiddleware = require('../middleWare/authMiddleware');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let User = require('../models/User');

router.get("/", async (req, res) => {
  try {
    const Users = await User.find();
    res.send(Users);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const Users = await User.find({ id: req.params.id });
    res.send(Users);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});


router.put(
  "/",
  [
    check("name", "Name is missing").not().isEmpty(),
    check("email", "email is missing").not().isEmpty(),
    check("phone", "Phone is missing").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const userBuffer = await Users.findOne({id: req.body.id}).exec();
      userBuffer.name = req.body.name;
      userBuffer.phone = req.body.phone;
      userBuffer.email = req.body.email;
      await userBuffer.save();
      res.send(userBuffer);
    } catch (err) {
      return res.status(404).send("Not found");
    }
    
  }
);

router.post(
  '/',
  [
    check('firstname', 'firstname is required').not().isEmpty(),
    check('lastname', 'lastname is required').not().isEmpty(),
    check('email', 'Please enter valid email').not().isEmpty().isEmail(),
    check('password', 'password need to be 5 char or more').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      let newPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: newPassword,
      });

      const payload = {
        user: {
          id: newUser.id,
          firstname: newUser.firstname,

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