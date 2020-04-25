const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase); //Setup DB before Test

//Test to create new User
test("New User Sign Up", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Test",
      email: "test1@example.com",
      password: "Test123",
    })
    .expect(201);
  //check if user is created in db
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  // check data integrity
  expect(response.body).toMatchObject({
    user: {
      name: "Test",
      email: "test1@example.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("Test123");
});
//Test to check if Login User Exist
test("Login User Exist", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "test@test.com",
      password: "Test123",
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});
//Test for Login Failure
test("Login Failure", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "one@test.com",
      password: "Test123",
    })
    .expect(400);
});
//Test to get Profile
test("Get Profile for User", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
//Test for Unauthorized Login
test("UnAuthorized User", async () => {
  await request(app).get("/users/me").send().expect(401);
});
//Test to Delete User
test("Delete created user account", async () => {
  await request(app)
    .delete("/users/me/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(204);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});
//Test for Unauthorized Deletion
test("Delete created user account, UnAuthorized", async () => {
  await request(app).delete("/users/me/").send().expect(401);
});
//Test to upload File
test("Add Profile Pic", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});
//Test to Update User
test("Update User", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Test User 1",
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("Test User 1");
});
//Test to check Failure of Update User
test("Update User Failure", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Test User 1",
    })
    .expect(400);
});
