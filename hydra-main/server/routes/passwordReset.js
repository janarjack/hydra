const User = require('../models/user-model')
const Token = require("../models/token");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

router.post("/forgot", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(400).send("user with given email doesn't exist");
        }

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `https://www.gericke-psam.com.sg/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        console.log("all good");
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log("Invalid User")
            return res.status(400).send("Invalid User");
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            console.log("Invalid or Expired Link")
            return res.status(400).send("Invalid or Expired Link");
        }
        await token.delete();

        console.log("Proceed to Password Reset page")
        res.send("Proceed to Password Reset page");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.put("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("Invalid User");

        user.password = req.body.password;
        await user.save();
        res.send("Password reset sucessful");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;