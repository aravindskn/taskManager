const mongoose = require("mongoose");

//Task Collection Schema
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //Referencing from User Collection
    },
  },
  { timestamps: true }
);

const Tasks = mongoose.model("Tasks", taskSchema); //Create the Model

module.exports = Tasks;
