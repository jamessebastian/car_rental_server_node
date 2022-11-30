const express = require("express");
let Inquiries = require("../models/Inquiry");
const sendEmail = require("../util/SendEmail");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const router = express.Router();
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleWare/authMiddleware");

//For getting all the queries on admin side...
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = await Inquiries.find();
    res.send(query);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});
//To fetch a query by id, for admin side....
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const query = await Inquiries.findOne({ query_id: req.params.id });
    res.send(query);
  } catch (err) {
    return res.status(500).send("Server error");
  }
  //Integrate nodemailer later on...
});

router.post(
  "/",
  authMiddleware,
  [
    check("name", "Name is missing").not().isEmpty(),
    check("email", "email is missing").not().isEmpty(),
    check("subject", "subject is missing").not().isEmpty(),
    check("message", "message cannot be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const newQuery = await Inquiries.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    await sendEmail(
      req.body.email,
      "Query Created",
      "One of our representatives will get in touch within 48 Hours A ticket has been opened regarding "
    );
    res.send(newQuery);
  }
);

module.exports = router;
