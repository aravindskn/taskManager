const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setUpDatabase,
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Create Task for User", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From Jest Test",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Get Tasks from a User", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Try to Fetch Tasks of other Users", async () => {
  await request(app)
    .delete("/tasks/" + taskOne._id)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
