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

beforeEach(setUpDatabase); //Setup DB before Testing

//Test to create a Task
test("Create Task for User", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From Jest Test",
    })
    .expect(201);

  const task = await Task.findById(response.body._id); //Get User from DB
  expect(task).not.toBeNull(); //Check if Data is valid from creation
  expect(task.completed).toEqual(false);
});

//Test Tasks of a User
test("Get Tasks from a User", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});

//Test to Delete tasks of other User
test("Try to Fetch Tasks of other Users", async () => {
  await request(app)
    .delete("/tasks/" + taskOne._id)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
