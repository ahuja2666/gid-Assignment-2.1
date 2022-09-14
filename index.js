const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoutes")
const userModel = require("./models/userModel");
const jwt = require("jsonwebtoken");
const secret = "HARSHIT"
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/assignment");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/posts", async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    jwt.verify(token, secret, async function (err, decode) {
      if (err) {
        return res.status(400).json({
          status: "Failed",
          message: "User not Authenticated"
        });
      }

      const user = await userModel.findOne({ _id: decode.data });
      if (user) {
        req.user = user._id
        next();
      } else {
        return res.status(400).json({
          status: "Failed",
          message: "User not found"
        });
      }
    });

  } else {
    return res.status(400).json({
      status: "Failed",
      message: "User not Authenticated"
    });
  }
});
app.use("/", userRouter);
app.use("/posts", postRouter);

app.listen(3000, () => console.log("server is up at port 3000"));