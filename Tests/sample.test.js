import request from "supertest";
import app from "../app";

const getTestUser = () => ({
  email: `${crypto.randomUUID()}@example.com`,
  password: crypto.randomUUID(),
});

describe("Created unit tests", () => {
  it("Test - Register with correct credentials", async () => {
    const testUser = getTestUser();
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", testUser.email);
  });

  it("Test - Register with the empty credentials", async () => {
    const testUser = {};
    const response = await request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });
});
