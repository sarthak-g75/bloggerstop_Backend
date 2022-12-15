const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "sarthakIsTheB3$t";



//Route:1 : Create a User using : Post "api/auth/createUser" No login req
router.post(
  "/createUser",
  [
    // Validations for storage of username,email and password
    body(
      "name",
      "Please Enter a Name containing more than 3 characters"
    ).isLength({ min: 3 }),
    body("email", "Please Enter a valid email").isEmail(),
    body("password", "Password should atleast contain 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Checking the errors for validation
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // Check wheather the user with the email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return (res
          .status(400)
          .json({success, error: "sorry a user with this email already exists" }));
      }
      let new_user = await User.findOne({ name: req.body.name });
      if (new_user) {
        return (res
          .status(400)
          .json({success, error: "sorry a user with this username already exists" }));
      }
      // Creating New User
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Route 2: Authenticate a user using : Post "api/auth/login" No login req
router.post(
  "/login",
  [
    // Validations for storage of username,email and password
    body("email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // Checking the errors for validation
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors:"Please enter correct credentials in right format" });
      
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return(res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" }));
           ;
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
       
        return (res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" }));
          ;
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ success,authToken });
    } catch (error) {
      res.status(500).send("Internal Server Error");
      // return;
    }
  }
);

// Route 3: Get details of logged in user : Post "api/auth/getUser"Login req
router.get("/getUser", async (req, res) => {
  try {
    let success =false
    const userId = req.header("user-id");
    const user = await User.findById(userId).select("-password");
    if(user){
      success = true
      return res.json({success,user});
    }
   
  } catch (error) {
    console.log(error.message);
    return (res.status(500).json({success,message:"Internal Server Error"}));
  }
});
module.exports = router;
