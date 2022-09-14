const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const secret = "HARSHIT"

router.post("/register", async (req, res) => {
  try {
    const findEmail = await userModel.findOne({ email: req.body.email });
    if (findEmail) {
      return res.status(500).json({
        status: "failed",
        message: "user already registered"
      });
    }

    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: err.message
        });
      }
      const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      if (user) {
        res.status(200).json({
          status: "sucess",
          message: "user registered sucessfully"
        })
      }
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }
});

router.post("/login", async (req, res) => {
  try {
    const findEmail = await userModel.findOne({ email: req.body.email });
    if (findEmail) {
      bcrypt.compare(req.body.password, findEmail.password, function (err, result) {
        if (err) {
          return res.status(500).json({
            status: "failed",
            message: err.message
          })
        } else {
          if (result) {
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
              data: findEmail._id
            }, secret);

            res.status(200).json({
              status: "sucess",
              message: "loged in sucessfull",
              token
            })
          } else {
            res.status(500).json({
              status: "failed",
              message: "incorrect password"
            })
          }
        }
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "user is not registered"
      });
    }

  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message
    })
  }
});

module.exports = router;