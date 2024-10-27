describe("User service unit test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Write operations", () => {
    it("create a new user", async () => {});
    it("should strip password from user data", async () => {});
  });
  describe("Read operations", () => {
    it("should find user by email", async () => {});
    it("should successfully find user by id", async () => {});
    it("should throw a not found exception if user is not found by id", async () => {});
  });
});
