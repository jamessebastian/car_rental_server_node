const router = require("express").Router();
let User = require("../models/User");
const Token = require('../models/token');
const crypto = require("crypto");
const sendEmail = require("../util/SendEmail");
const Joi = require("joi");
const express = require("express");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");


// send password link
router.post("/", async (req, res) => {


    try{

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
    
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
            await sendEmail(user.email, "Password reset", link);
    
            res.send("password reset link sent to your email account");

    }
    
    
    catch(error){
        console.log(error.message);

    }
    

    

});

// verify password reset link
router.get("/:id/:token", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

//  set new password
router.post("/:id/:token", async (req, res) => {
	try {

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!user.verified) user.verified = true;

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


module.exports = router;