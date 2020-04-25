const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./task");

//User Collection Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        //Validate Email using Validator
        if (!validator.isEmail(value)) throw new Error("Email was not valid.");
      },
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        //Validate Age
        if (value < 0) throw new Error("Age must be greater than 0.");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [7, "Password must have greater than of 6 characters"],
      validate(value) {
        //Validate Password using Validator
        if (validator.contains(value, "password"))
          throw new Error("Password must not contain string password.");
      },
    },
    tokens: [
      //Add Token to DB
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

//Referencing each Task with one User
userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "author",
});

//findByCredentials definition
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to find user!");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login!");

  return user;
};

//Generate Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Remove private attributes from query
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//Hash Password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Delete User Task when User is Removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ author: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
