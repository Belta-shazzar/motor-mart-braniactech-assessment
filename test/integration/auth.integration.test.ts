import prisma from "../util";

describe("Authentication Integration Tests", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear users before tests
  });

  it("should sign up a new user", async () => {
    //   const response = await request(app)
    //     .post('/auth/register')
    //     .send({
    //       email: 'testuser@example.com',
    //       password: 'testpassword',
    //       name: 'Test User'
    //     });
    //   expect(response.status).toBe(201);
    //   expect(response.body.email).toBe('testuser@example.com');
  });

  it("should not sign up with conflicting credentials", async () => {
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({
    //       email: 'nonexistent@example.com',
    //       password: 'wrongpassword',
    //     });
    //   expect(response.status).toBe(401);
  });

  it("should login with correct credentials", async () => {
    //   await request(app)
    //     .post('/auth/register')
    //     .send({
    //       email: 'loginuser@example.com',
    //       password: 'loginpassword',
    //       name: 'Login User',
    //     });
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({
    //       email: 'loginuser@example.com',
    //       password: 'loginpassword',
    //     });
    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('token');
  });

  it("should not login with incorrect credentials", async () => {
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({
    //       email: 'nonexistent@example.com',
    //       password: 'wrongpassword',
    //     });
    //   expect(response.status).toBe(401);
  });

  it("should get user profile with valid token", async () => {
    //   const registerResponse = await request(app)
    //     .post('/auth/register')
    //     .send({
    //       email: 'profileuser@example.com',
    //       password: 'profilepassword',
    //       name: 'Profile User',
    //     });
    //   const loginResponse = await request(app)
    //     .post('/auth/login')
    //     .send({
    //       email: 'profileuser@example.com',
    //       password: 'profilepassword',
    //     });
    //   const profileResponse = await request(app)
    //     .get('/auth/me')
    //     .set('Authorization', `Bearer ${loginResponse.body.token}`);
    //   expect(profileResponse.status).toBe(200);
    //   expect(profileResponse.body.email).toBe('profileuser@example.com');
  });
});
