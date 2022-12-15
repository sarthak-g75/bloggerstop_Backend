const jwt = require("jsonwebtoken");
const JWT_SECRET = "sarthakIsTheB3$t";
const User = require("../models/User");

const fetchuser = async (req, res, next) => {
  // get the user from the jwt token and id to req obj
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Plese Authenticate using a valid token" });
    return;
  }
  try {
  
    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.user.id;
    const name = await User.findById(userId).select("name");
    req.user = data.user.id;
    req.author = name.name;
    console.log(req.author);
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};
module.exports = fetchuser;