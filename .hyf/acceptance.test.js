import request from "supertest";
import app from "../app";

const getTestUser = () => ({
  email: `${crypto.randomUUID()}@example.com`,
  password: crypto.randomUUID(),
});

describe("Acceptance Tests", () => {
  it("Acceptance Test - Register ", async () => {
    const testUser = getTestUser();
    const response = await request(app)
      .post("/users/register")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", testUser.email);
  });

  it("Acceptance Test - Login", async () => {
    // First create a test user
    const testUser = getTestUser();
    await request(app).post("/users/register").send(testUser).expect(201);

    const response = await request(app)
      .post("/users/login")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });

  it("Acceptance Test - New Item", async () => {
    // First create a test user and login
    const testUser = getTestUser();
    await request(app).post("/users/register").send(testUser).expect(201);
    const loginResponse = await request(app)
      .post("/users/login")
      .send(testUser);
    const token = loginResponse.body.token;

    const response = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Item", price: 123.45 })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
  });
});
