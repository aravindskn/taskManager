//DB Test Config
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId(); //Create a Object ID
//Test User One
const userOne = {
  _id: userOneId,
  name: "TestUser",
  email: "test@test.com",
  password: "Test123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, "learningnodejs"),
    },
  ],
};
//Test User Two
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "TestUser2",
  email: "test123@test.com",
  password: "Test123",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, "learningnodejs"),
    },
  ],
};

//Test Task One
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  author: userOne._id,
};
//Test Task Two
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second Task",
  completed: true,
  author: userOne._id,
};
//Test Task Three
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Three Task",
  completed: true,
  author: userTwo._id,
};

const setUpDatabase = async () => {
  await User.deleteMany(); // Delete all existing Users from DB to create Test Users
  await Task.deleteMany(); // Delete all existing Tasks from DB to create Test Tasks
  //Saving new Docs to DB
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setUpDatabase,
};
