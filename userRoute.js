const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
    res.json({
        message: "User API is working"
    });
});

router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;