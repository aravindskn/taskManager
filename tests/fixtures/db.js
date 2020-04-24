const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
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

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  author: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second Task",
  completed: true,
  author: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Three Task",
  completed: true,
  author: userTwo._id,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
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
