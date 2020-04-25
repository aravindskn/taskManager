//Middlewear for Authenticaton
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //Get Authorization from API request header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verify JWT
    //Get User from DB
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next(); //Continue
  } catch (error) {
    res.status(401).send({ error: "Unauthorised" });
  }
};

module.exports = auth;
