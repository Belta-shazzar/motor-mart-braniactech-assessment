import { MockProxy, mock } from "jest-mock-extended";
import { User, UserRole } from "@prisma/client";
import { AuthService } from "../../src/services/auth.service";
import { UserService } from "../../src/services/user.service";
import { HttpException } from "../../src/exceptions/http.exception";
import { SignUpDto, SignInDto } from "../../src/dto/auth.dto";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { generateUUID } from "../util";
import config from "../../src/config";

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService unit test", () => {
  let authService: AuthService;

  // Mock userService
  let userService: MockProxy<UserService>;

  // Mocked user details
  const userId = generateUUID();
  const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const email = faker.internet.email();
  const phoneNumber = faker.phone.number();
  const mockToken = "mock.jwt.token";

  const mockUser: User = {
    id: userId,
    name,
    email,
    password: "hashedPassword",
    phoneNumber,
    role: UserRole.BUYER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockStrippedUser: Partial<User> = {
    id: userId,
    name,
    email,
    phoneNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    userService = mock<UserService>();
    authService = new AuthService(userService);
  });

  describe("Sign up cases", () => {
    const signUpDto: SignUpDto = {
      name,
      email,
      phoneNumber,
      password: "password",
    };

    it("should successfully sign up a new user", async () => {
      // Mock hash password
      const hashedPassword = "hashedPassword";
      (hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock user service methods
      userService.findByEmail.mockResolvedValue(null);
      userService.createUser.mockResolvedValue(mockUser);
      userService.stripUserPassword.mockReturnValue(mockStrippedUser);

      // Mock the createToken method
      jest.spyOn(authService as any, "createToken").mockReturnValue(mockToken);

      // Execute signup
      const result = await authService.signUp(signUpDto);

      // Verify all service calls
      expect(userService.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(userService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: hashedPassword,
      });
      expect(userService.stripUserPassword).toHaveBeenCalledWith(mockUser);
      expect((authService as any).createToken).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(result).toEqual({
        user: mockStrippedUser,
        token: mockToken,
      });
    });

    it("should throw HttpException if email already exists", async () => {
      // Mock existing user
      userService.findByEmail.mockResolvedValue(mockUser);

      // Execute and verify exception
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        new HttpException(409, `This email ${signUpDto.email} already exists`)
      );

      // Verify service calls
      expect(userService.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(hash).not.toHaveBeenCalled();
    });
  });

  describe("Login cases", () => {
    const loginDto: SignInDto = {
      email,
      password: "password",
    };

    it("should successfully sign a user in", async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      userService.stripUserPassword.mockReturnValue(mockStrippedUser);

      // Mock the createToken method
      jest.spyOn(authService as any, "createToken").mockReturnValue(mockToken);

      // Execute signup
      const result = await authService.signIn(loginDto);

      // Verify all service calls
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
      expect(userService.stripUserPassword).toHaveBeenCalledWith(mockUser);
      expect((authService as any).createToken).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(result).toEqual({
        user: mockStrippedUser,
        token: mockToken,
      });
    });

    it("should throw HttpException when incorrect email is sent", async () => {
      userService.findByEmail.mockResolvedValue(null);

      // Execute and verify
      await expect(authService.signIn(loginDto)).rejects.toThrow(HttpException);
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(compare).not.toHaveBeenCalled();
    });

    it("should throw HttpException when incorrect password is sent", async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      // Execute and verify
      await expect(authService.signIn(loginDto)).rejects.toThrow(HttpException);
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(compare).toHaveBeenCalled();
    });
  });

  describe("Create token case", () => {
    it("should create a valid JWT token", () => {
      (sign as jest.Mock).mockResolvedValue(mockToken);

      // Call the private method
      const token = (authService as any).createToken(mockUser.id);

      expect(sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        config.app.jwtSecret,
        {
          expiresIn: 60 * 3600,
        }
      );

      expect(token).toEqual(token);
    });
  });
});
