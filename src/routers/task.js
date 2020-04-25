const express = require("express");
const router = new express.Router();
const Tasks = require("../models/task");
const auth = require("../middlewear/auth");

//Tasks APIs

//Create Tasks
router.post("/tasks", auth, async (req, res) => {
  // const task = new Tasks(req.body);
  const task = new Tasks({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//List all Tasks
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks = await Tasks.find({author: req.user._id});
    // if (!tasks) return res.status(404).send();
    // res.send(tasks);

    //Alternative Approach
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate(); //This uses the relationship between user and tasks to get all tasks of a user.
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

//Fetch particular Task by ID
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findOne({ _id, author: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//Update task by ID
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidateUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidateUpdate)
    return res.status(400).send({ error: "Invalid Update Option!" });
  try {
    // const task = await Tasks.findById(_id);
    const task = await Tasks.findOne({ _id, author: req.user._id });
    if (!task) return res.status(404).send();
    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

//Delete a Task by ID
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Tasks.findByIdAndDelete(_id);
    const task = await Tasks.findOneAndDelete({ _id, author: req.user._id });
    if (!task) return res.status(404).send();
    res.status(204).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
