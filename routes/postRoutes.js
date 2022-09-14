const express = require("express");
const router = express.Router();
const postModel = require("../models/postModel");


router.get("/", async (req, res) => {
  const posts = await postModel.find()
  res.status(200).json({
    posts
  })
});

router.post("/", async (req, res) => {
  try {
    const post = await postModel.create({
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      user: req.user
    })
    res.status(200).json({
      post
    })
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message
    })
  }
});

router.put("/:postId", async (req, res) => {
  const reqPoste = await postModel.findOne({ _id: req.params.postId });
  if (reqPoste) {
    if ((reqPoste.user).toString() == (req.user).toString()) {
      await postModel.updateOne({ _id: req.params.postId }, req.body)
      return res.status(200).json({
        status: "Success"
      })
    } else {
      res.status(400).json({
        status: "failed",
        message: "You don't have authorization to update this post"
      })
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "no post found"
    })
  }
});


router.delete("/:postId", async (req, res) => {
  const reqPoste = await postModel.findOne({ _id: req.params.postId });
  if (reqPoste) {
    if ((reqPoste.user).toString() == (req.user).toString()) {
      await postModel.deleteOne({ _id: req.params.postId })
      return res.status(200).json({
        status: "Successfully deleted"
      })
    } else {
      res.status(400).json({
        status: "failed",
        message: "You don't have authorization to delete this post"
      })
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "no post found"
    })
  }
});

module.exports = router;