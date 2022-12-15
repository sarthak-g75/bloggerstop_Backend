const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Blogs = require("../models/Blogs");

// Route 1: Fetch all the Blogs of a particular user using : GET : "/api/blogs/fetchBlogs"
router.get("/fetchBlogs", fetchuser, async (req, res) => {
  try {
    const blogs = await Blogs.find({
      user: req.user,
    });
    // console.log(req.user);
    res.json(blogs);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 : Add a new Blog using : POST : "/api/blogs/addBlogs" --Login Required
router.post(
  "/addBlogs",
  fetchuser,
  [
    // validations
    body(
      "title",
      "please enter a title containing more than 5 characters"
    ).isLength({ min: 5 }),
    body(
      "description",
      "Please enter description containing more than 10 characters"
    ).isLength({ min: 10 }),
    body(
      "genre",
      "Please enter a genre containing more than 3 characters"
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      let success = false;
      const { title, description, genre, privacy } = req.body;
      // checking the errors for validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
      
      }
      const blog = new Blogs({
        title,
        description,
        genre,
        privacy,
        user: req.user,
        author:req.author,
      });

      //   saving the blog here
      const savedBlog = await blog.save();
      success = true
      res.json({success});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server Error");
    }
  }
);

// Route 3: Fetch all the Blogs using : GET : "/api/blogs/fetchAllBlogs"
router.get("/fetchAllBlogs", async (req, res) => {
  try {
    const blogs = await Blogs.find().select("");
  
    res.json(blogs);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Delete a particular Blog using : DELETE: "/api/blogs/deleteBlog/:id"

router.delete("/deleteBlog/:id", fetchuser, async (req, res) => {
  try {
    let success =false;
        let blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res.status(404).json({success,message:"Not Found"});
      return;
    }
    if (blog.user.toString() !== req.user) {
      res.status(401).json({success,message:"Not Allowed"});
      return;
    }
    blog = await Blogs.findByIdAndDelete(req.params.id);
    success = true
    res.json({success });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
// Route 5: Edit a particular Blog using : PUT: "/api/blogs/deleteBlog/:id"

router.put("/updateBlog/:id", fetchuser, async (req, res) => {
  const { title, description, genre, privacy } = req.body;
  let success = false;
  try {
    const newBlog = {};
    if (title) {
      newBlog.title = title;
    }
    if (description) {
      newBlog.description = description;
    }
    if (genre) {
      newBlog.genre = genre;
    }
    if (privacy) {
      newBlog.privacy = privacy;
    }
    // Finding the blog
    let blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res.status(404).send(success,"Not Found");
      return;
    }
    if (blog.user.toString() !== req.user) {
      res.status(401).send(success,"Not Allowed");
      return;
    }
    blog = await Blogs.findByIdAndUpdate(
      req.params.id,
      { $set: newBlog },
      { new: true }
    );
    success = true;
    res.json({success});
  } catch (error) {
    console.log(error.message);
    res.status(500).send(success,error.message);
  }
});

// Route 6: Get a  particular Blog using :GET: "/api/blogs/deleteBlog/:id"

router.get("/blog/:id", async (req, res) => {
  try {
    let blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res.status(404).send("Not Found");
      return;
    }
    // blog = await Blogs.findByIdAndDelete(req.params.id);
    res.json( blog );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
